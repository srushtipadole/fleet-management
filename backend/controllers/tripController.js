import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import { addBlockchainLog } from "../utils/blockchain.js";
import mongoose from "mongoose";

// ===============================
// LIST ALL TRIPS
// ===============================
export const listTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle", "name registrationNumber model")
      .populate("driver", "name email")
      .sort({ createdAt: -1 });

    res.json({ trips });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET TRIP BY ID
// ===============================
export const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("vehicle", "name registrationNumber model")
      .populate("driver", "name email");

    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
};

// ===============================
// FORCE START TRIP (ADMIN / MANAGER)
// ===============================
export const forceStartTrip = async (req, res, next) => {
  try {
    const { vehicleId, driverId, from } = req.body;

    if (
      !mongoose.isValidObjectId(vehicleId) ||
      !mongoose.isValidObjectId(driverId)
    ) {
      return res.status(400).json({ message: "Invalid Vehicle or Driver ID" });
    }

    // Guards
    const activeDriverTrip = await Trip.findOne({ driver: driverId, status: "in-progress" });
    if (activeDriverTrip)
      return res.status(400).json({ message: "Driver already has an active trip" });

    const activeVehicleTrip = await Trip.findOne({ vehicle: vehicleId, status: "in-progress" });
    if (activeVehicleTrip)
      return res.status(400).json({ message: "Vehicle already in active trip" });

    let trip = await Trip.create({
      vehicle: vehicleId,
      driver: driverId,
      from: from || "Manual Start",
      status: "in-progress",
      startedAt: new Date(),
      startType: "admin"
    });

    // Sync vehicle
    await Vehicle.findByIdAndUpdate(vehicleId, { status: "on-trip" });

    await addBlockchainLog("TripStarted", {
      tripId: trip._id,
      vehicleId,
      startedBy: req.user?._id
    });

    trip = await Trip.findById(trip._id)
      .populate("vehicle", "name registrationNumber model")
      .populate("driver", "name email");

    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
};

// ===============================
// FORCE COMPLETE TRIP (ADMIN / MANAGER)
// ===============================
export const forceCompleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.status === "completed")
      return res.status(400).json({ message: "Trip already completed" });

    trip.status = "completed";
    trip.to = req.body.to || trip.to;
    trip.endedAt = new Date();
    await trip.save();

    // Sync vehicle
    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "idle" });

    await addBlockchainLog("TripCompleted", {
      tripId: trip._id,
      completedBy: req.user?._id
    });

    const updatedTrip = await Trip.findById(trip._id)
      .populate("vehicle", "name registrationNumber model")
      .populate("driver", "name email");

    res.json({ trip: updatedTrip });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET TRIPS BY DRIVER
// ===============================
export const getTripByDriver = async (req, res, next) => {
  try {
    const trips = await Trip.find({ driver: req.params.id })
      .sort({ createdAt: -1 })
      .populate("vehicle", "name registrationNumber model")
      .populate("driver", "name email");

    res.json({ trips });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DRIVER START TRIP
// ===============================
export const driverStartTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.driver.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your trip" });

    if (trip.status === "in-progress")
      return res.status(400).json({ message: "Trip already started" });

    trip.status = "in-progress";
    trip.startedAt = new Date();
    await trip.save();

    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "on-trip" });

    res.json({ trip });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DRIVER COMPLETE TRIP
// ===============================
export const driverCompleteTrip = async (req, res, next) => {
  try {
    const { to, notes } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.driver.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your trip" });

    if (trip.status === "completed")
      return res.status(400).json({ message: "Trip already completed" });

    trip.status = "completed";
    trip.to = to || trip.to;
    trip.notes = notes || "";
    trip.endedAt = new Date();
    await trip.save();

    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "idle" });

    await addBlockchainLog("TripCompleted", {
      tripId: trip._id,
      completedBy: req.user?._id
    });

    res.json({ trip });
  } catch (err) {
    next(err);
  }
};
