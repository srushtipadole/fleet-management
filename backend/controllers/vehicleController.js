import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import { addBlockchainLog } from "../utils/blockchain.js";

// ===============================
// LIST VEHICLES
// ===============================
export const listVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("assignedDriver", "name email");
    res.json({ vehicles });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET VEHICLE
// ===============================
export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("assignedDriver", "name email");

    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ===============================
// CREATE VEHICLE
// ===============================
export const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    await addBlockchainLog("VehicleCreated", {
      vehicleId: vehicle._id,
      createdBy: req.user?._id
    });

    res.status(201).json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE VEHICLE
// ===============================
export const updateVehicle = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    const oldVehicle = await Vehicle.findById(req.params.id);
    if (!oldVehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    // auto status update on assign/unassign
    if ("assignedDriver" in updateData) {
      updateData.status = updateData.assignedDriver ? "assigned" : "idle";
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // 🔥 Remove vehicle from old driver
    if (!updateData.assignedDriver && oldVehicle.assignedDriver) {
      await User.findByIdAndUpdate(oldVehicle.assignedDriver, {
        vehicle: null
      });
    }

    // 🔥 Assign vehicle to new driver
    if (updateData.assignedDriver) {
      // ensure driver is free
      const existing = await Vehicle.findOne({
        assignedDriver: updateData.assignedDriver,
        _id: { $ne: vehicle._id }
      });

      if (existing) {
        return res.status(400).json({
          message: "Driver already assigned to another vehicle"
        });
      }

      await User.findByIdAndUpdate(updateData.assignedDriver, {
        vehicle: vehicle._id
      });
    }

    await addBlockchainLog("VehicleUpdated", {
      vehicleId: vehicle._id,
      updatedBy: req.user?._id,
      data: updateData
    });

    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DELETE VEHICLE
// ===============================
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    // cleanup driver link
    if (vehicle.assignedDriver) {
      await User.findByIdAndUpdate(vehicle.assignedDriver, {
        vehicle: null
      });
    }

    await addBlockchainLog("VehicleDeleted", {
      vehicleId: vehicle._id,
      deletedBy: req.user?._id
    });

    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    next(err);
  }
};

// ===============================
// ASSIGN DRIVER (EXPLICIT)
// ===============================
export const assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    const driver = await User.findById(driverId);
    if (!driver)
      return res.status(404).json({ message: "Driver not found" });

    // guard
    const existing = await Vehicle.findOne({
      assignedDriver: driverId,
      _id: { $ne: vehicle._id }
    });
    if (existing)
      return res.status(400).json({
        message: "Driver already assigned to another vehicle"
      });

    vehicle.assignedDriver = driver._id;
    vehicle.status = "assigned";
    await vehicle.save();

    driver.vehicle = vehicle._id;
    await driver.save();

    await addBlockchainLog("DriverAssigned", {
      vehicleId: vehicle._id,
      driverId: driver._id,
      assignedBy: req.user?._id
    });

    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET VEHICLE BY DRIVER
// ===============================
export const listVehicleByDriver = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ assignedDriver: req.params.id })
      .populate("assignedDriver", "-password");

    if (!vehicle)
      return res.status(404).json({ message: "No vehicle assigned" });

    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};
