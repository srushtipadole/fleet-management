import Vendor from "../models/Vendor.js";
import Maintenance from "../models/Maintenance.js";
import { addBlockchainLog } from "../utils/blockchain.js";
import User from "../models/User.js";

// ===============================
// LIST VENDORS
// ===============================
export const listVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find();
    res.json({ vendors });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET VENDOR
// ===============================
export const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    res.json({ vendor });
  } catch (err) {
    next(err);
  }
};

// ===============================
// CREATE VENDOR (MANAGER / ADMIN)
// ===============================
export const createVendor = async (req, res, next) => {
  try {
    const { name, email, phone, address, services, walletAddress } = req.body;

    // prevent duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // auto password (TEMP)
    const generatedPassword = Math.random().toString(36).slice(-8);

    // create vendor
    const vendor = await Vendor.create({
      name,
      email,
      phone,
      address,
      services
    });

    // create vendor user
    await User.create({
      name,
      email,
      password: generatedPassword,
      role: "vendor",
      vendor: vendor._id,
      walletAddress
    });

    await addBlockchainLog("VendorCreated", {
      vendorId: vendor._id,
      createdBy: req.user?._id
    });

    // ⚠️ production: send password via email, not response
    res.status(201).json({
      message: "Vendor created successfully",
      vendor
    });

  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE VENDOR (SAFE FIELDS)
// ===============================
export const updateVendor = async (req, res, next) => {
  try {
    const { name, phone, address, services } = req.body;

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    if (name) vendor.name = name;
    if (phone) vendor.phone = phone;
    if (address) vendor.address = address;
    if (services) vendor.services = services;

    await vendor.save();

    res.json({ vendor });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DELETE VENDOR (CLEANUP USER)
// ===============================
export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    // remove linked user
    await User.findOneAndDelete({ vendor: vendor._id });

    await addBlockchainLog("VendorDeleted", {
      vendorId: vendor._id,
      deletedBy: req.user?._id
    });

    res.json({ message: "Vendor removed" });
  } catch (err) {
    next(err);
  }
};

// ===============================
// VENDOR JOBS
// ===============================
export const vendorJobs = async (req, res, next) => {
  try {
    const jobs = await Maintenance.find({ vendor: req.params.id })
      .populate("vehicle");

    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

// ===============================
// VENDOR SUMMARY (SELF)
// ===============================
export const vendorSummary = async (req, res, next) => {
  try {
    if (!req.user.vendor)
      return res.status(400).json({ message: "Vendor profile not linked" });

    const vendorId = req.user.vendor;

    const [pending, completed] = await Promise.all([
      Maintenance.countDocuments({ vendor: vendorId, status: "pending" }),
      Maintenance.countDocuments({ vendor: vendorId, status: "completed" })
    ]);

    const earningsAgg = await Maintenance.aggregate([
      { $match: { vendor: vendorId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$actualCost" } } }
    ]);

    const earnings = earningsAgg[0]?.total || 0;

    res.json({ pending, completed, earnings });
  } catch (err) {
    next(err);
  }
};
