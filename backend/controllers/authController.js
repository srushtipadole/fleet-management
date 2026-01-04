import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

// ================= TOKEN HELPERS =================
const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, vendor: user.vendor || null },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

// ================= REGISTER =================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // 1️⃣ Create user first
    let user = await User.create({ name, email, password, role });

    // 2️⃣ If vendor, create vendor & link
    if (role === "vendor") {
      const vendor = await Vendor.create({
        name,
        email,
        phone: "",
        services: [],
      });

      user.vendor = vendor._id;
      await user.save();
    }

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendor: user.vendor || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ================= LOGIN =================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).populate("vendor");
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    // 🔥 Blocked user check (recommended)
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked" });
    }

    // Auto-link vendor if missing
    if (user.role === "vendor" && !user.vendor) {
      const vendorDoc = await Vendor.findOne({ email: user.email });
      if (vendorDoc) {
        user.vendor = vendorDoc._id;
        await user.save();
        user = await User.findById(user._id).populate("vendor");
      }
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendor: user.vendor?._id || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ================= REFRESH TOKEN =================
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

// ================= GET ME =================
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("vendor");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
