import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { addBlockchainLog } from "../utils/blockchain.js";
import { createNotification } from "./notificationController.js";

const LOW_FUEL_THRESHOLD = 15;
const OVERSPEED_LIMIT = 120;
const ALERT_COOLDOWN = 10 * 60 * 1000; // 10 min

export const updateTelemetry = async (req, res) => {
  try {
    const { userId, vehicleId, lat, lng, speed = 0, fuelLevel, location } = req.body;
    const io = req.app.get("io");

    // ===============================
    // FIND VEHICLE
    // ===============================
    let user = null;
    let vehicle = null;

    if (vehicleId) {
      vehicle = await Vehicle.findById(vehicleId);
    } else if (userId) {
      user = await User.findById(userId);
      if (!user || !user.vehicle)
        return res.status(400).json({ message: "User or vehicle not found" });
      vehicle = await Vehicle.findById(user.vehicle);
    }

    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    // ===============================
    // UPDATE VEHICLE STATE
    // ===============================
    vehicle.location = lat && lng ? { lat, lng } : vehicle.location;
    vehicle.speed = speed;
    vehicle.fuelLevel = fuelLevel ?? vehicle.fuelLevel;
    vehicle.device = {
      ...vehicle.device,
      lastPingAt: new Date()
    };
    await vehicle.save();

    // ===============================
    // LOW FUEL ALERT (WITH COOLDOWN)
    // ===============================
    if (fuelLevel !== undefined && fuelLevel < LOW_FUEL_THRESHOLD) {
      await createNotification(
        {
          title: "Low Fuel",
          message: `Fuel low (${fuelLevel}%)`,
          type: "warning",
          vehicle: vehicle._id,
          alertCode: "LOW_FUEL",
          roles: ["admin", "manager"],
          recipient: user?._id || null
        },
        req
      );
    }

    // ===============================
    // OVERSPEED ALERT (WITH COOLDOWN)
    // ===============================
    if (speed > OVERSPEED_LIMIT) {
      await createNotification(
        {
          title: "Overspeed Alert",
          message: `Speed ${speed} km/h`,
          type: "critical",
          vehicle: vehicle._id,
          alertCode: "OVERSPEED",
          roles: ["admin", "manager"],
          recipient: user?._id || null
        },
        req
      );
    }

    // ===============================
    // TRIP MANAGEMENT (STABLE)
    // ===============================
    let trip = await Trip.findOne({
      vehicle: vehicle._id,
      status: "in-progress"
    });

    // START trip only once
    if (!trip && speed > 10) {
      trip = await Trip.create({
        vehicle: vehicle._id,
        driver: user?._id || vehicle.assignedDriver,
        from: location || "Auto",
        status: "in-progress",
        startedAt: new Date(),
        startType: "auto"
      });

      await addBlockchainLog("TripStarted", {
        tripId: trip._id,
        vehicleId: vehicle._id
      });
    }

    // END trip only if idle for some time (simple version)
    if (trip && speed < 5) {
      trip.status = "completed";
      trip.endedAt = new Date();
      trip.to = location || trip.to;
      await trip.save();

      await addBlockchainLog("TripCompleted", {
        tripId: trip._id,
        vehicleId: vehicle._id
      });
    }

    // ===============================
    // TELEMETRY BLOCKCHAIN LOG
    // ===============================
    await addBlockchainLog("TelemetryUpdated", {
      vehicleId: vehicle._id,
      speed,
      fuelLevel,
      location
    });

    // ===============================
    // REALTIME EMIT (ADMIN DASHBOARD)
    // ===============================
    io?.to("admins").emit("telemetry:update", {
      _id: vehicle._id,
      name: vehicle.name,
      speed: vehicle.speed,
      fuelLevel: vehicle.fuelLevel,
      status: vehicle.status,
      location: vehicle.location
    });

    res.json({ message: "Telemetry updated", vehicle });

  } catch (err) {
    console.error("Telemetry error:", err);
    res.status(500).json({ message: err.message });
  }
};
