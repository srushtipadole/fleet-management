// controllers/maintenanceController.js
import Maintenance from "../models/Maintenance.js";
import Vendor from "../models/Vendor.js";
import Vehicle from "../models/Vehicle.js";
import { addBlockchainLog } from "../utils/blockchain.js";
import User from "../models/User.js"; 
import { createNotification } from "./notificationController.js";


export const createJob = async (req, res, next) => {
  try {
    const { vehicleId, description, dueDate, vendorId, costEstimate } = req.body;
    const job = await Maintenance.create({
      vehicle: vehicleId,
      description,
      status: "pending",
      dueDate,
      vendor: vendorId || null,
      costEstimate,
      createdBy: req.user?._id
    });

     // 🔥 set vehicle status → maintenance
    await Vehicle.findByIdAndUpdate(vehicleId, { status: "maintenance" });

    await addBlockchainLog("MaintenanceCreated", { jobId: job._id, vehicleId });
        // 🔥 Notify vendor if job created with vendorId
    if (vendorId) {
      const vendorUser = await User.findOne({ vendor: vendorId });
      if (vendorUser) {
        await createNotification(
          {
            title: "New Maintenance Job Assigned",
            message: `A new maintenance job has been assigned to you.`,
            recipient: vendorUser._id
          },
          req
        );
      }
    }

    res.status(201).json({ job });
  } catch (err) { next(err); }
};

export const assignVendor = async (req, res, next) => {
  try {
    const job = await Maintenance.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const vendor = await Vendor.findById(req.body.vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    job.vendor = vendor._id;
    job.status = "pending";
    await job.save();
    await addBlockchainLog("MaintenanceAssigned", { jobId: job._id, vendorId: vendor._id, assignedBy: req.user?._id });
        // 🔥 Notify vendor user about assignment
    const vendorUser = await User.findOne({ vendor: vendor._id });
    if (vendorUser) {
      await createNotification(
        {
          title: "Maintenance Job Assigned",
          message: `A new job has been assigned to you.`,
          recipient: vendorUser._id
        },
        req
      );
    }

    res.json({ job });
  } catch (err) { next(err); }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const job = await Maintenance.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const { status, notes, actualCost } = req.body;
    if (status) job.status = status;
    if (notes) job.notes = notes;
    if (actualCost !== undefined) job.actualCost = actualCost;
    if (status === "completed") job.completedAt = new Date();
    await job.save();

     // 🔥 update vehicle based on job status
    if (status === "completed") {
      // return vehicle to normal use
      await Vehicle.findByIdAndUpdate(job.vehicle, { status: "idle" });
    } else if (status === "in-progress") {
      await Vehicle.findByIdAndUpdate(job.vehicle, { status: "maintenance" });
    }


    await addBlockchainLog("MaintenanceUpdated", { jobId: job._id, status, updatedBy: req.user?._id });
    res.json({ job });
  } catch (err) { next(err); }
};

export const listJobs = async (req, res, next) => {
  try {
    const jobs = await Maintenance.find().populate("vehicle vendor createdBy");
    res.json({ jobs });
  } catch (err) { next(err); }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Maintenance.findById(req.params.id).populate("vehicle vendor createdBy");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) { next(err); }
};
// Get Jobs for a Specific Vendor
export const getVendorJobs = async (req, res, next) => {
  try {
    const vendorId = req.params.id;

    const jobs = await Maintenance.find({ vendor: vendorId })
      .populate("vehicle vendor createdBy");

    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

export const getDriverMaintenance = async (req, res, next) => {
  try {
    const driverId = req.params.driverId;

    // Step 1: find the vehicle assigned to this driver
    const vehicle = await Vehicle.findOne({ assignedDriver: driverId });

    if (!vehicle) {
      return res.json({ maintenance: [] });
    }

    // Step 2: get maintenance for that vehicle
    const maintenance = await Maintenance.find({ vehicle: vehicle._id })
      .populate("vehicle vendor");

    res.json({ maintenance });
  } catch (err) {
    next(err);
  }
};

