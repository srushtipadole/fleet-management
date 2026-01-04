import User from "../models/User.js";

// ===============================
// LIST ALL USERS (ADMIN / MANAGER)
// ===============================
export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// ===============================
// LIST DRIVERS
// ===============================
export const listDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: "driver" }).select("-password");
    res.json({ users: drivers });
  } catch (err) {
    next(err);
  }
};

// ===============================
// LIST VENDORS
// ===============================
export const listVendorUsers = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password");
    res.json({ users: vendors });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET USER
// ===============================
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE USER (SAFE)
// ===============================
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, vehicle } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Allowed fields only
    if (name) user.name = name;
    if (email) user.email = email;
    if (vehicle !== undefined) user.vehicle = vehicle;

    // Password update (SAFE – triggers pre-save hash)
    if (password) {
      user.password = password;
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    res.json({ user: safeUser });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DELETE USER
// ===============================
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
