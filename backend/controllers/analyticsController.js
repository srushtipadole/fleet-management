import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Maintenance from "../models/Maintenance.js";
import Notification from "../models/Notification.js";

export const summary = async (req, res, next) => {
  try {
    // ===============================
    // BASIC COUNTS (FLAT)
    // ===============================
    const [
      vehiclesCount,
      driversCount,
      maintenanceCount,
      tripsCount,
      alertsCount
    ] = await Promise.all([
      Vehicle.countDocuments(),
      User.countDocuments({ role: "driver" }),
      Maintenance.countDocuments({ status: { $ne: "completed" } }),
      Trip.countDocuments(),
      Notification.countDocuments()
    ]);

    // ===============================
    // VEHICLES BY STATUS (CHART)
    // ===============================
    const vehiclesByStatus = await Vehicle.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // ===============================
    // ALERTS BY TYPE (CHART)
    // ===============================
    const alertsByType = await Notification.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // ===============================
    // TRIPS LAST 7 DAYS (CHART)
    // ===============================
    const today = new Date();
    const last7 = new Date();
    last7.setDate(today.getDate() - 6);

    const tripsLast7Days = await Trip.aggregate([
      {
        $match: {
          createdAt: { $gte: last7, $lte: today }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          trips: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const tripsChart = tripsLast7Days.map(t => ({
      date: t._id,
      trips: t.trips
    }));

    // ===============================
    // VEHICLE HEALTH (IOT)
    // ===============================
    let offlineVehicles = 0;
    try {
      offlineVehicles = await Vehicle.countDocuments({
        "device.lastPingAt": {
          $lt: new Date(Date.now() - 15 * 60 * 1000)
        }
      });
    } catch {
      offlineVehicles = 0;
    }

    const vehiclesInMaintenance = await Vehicle.countDocuments({
      status: "maintenance"
    });

    // ===============================
    // FINAL RESPONSE (FRONTEND SAFE)
    // ===============================
    res.json({
      // ✅ DASHBOARD CARDS (NUMBERS ONLY)
      vehicles: vehiclesCount,
      drivers: driversCount,
      maintenance: maintenanceCount,
      trips: tripsCount,
      alerts: alertsCount,

      // ✅ EXTRA METRICS
      vehiclesInMaintenance,
      offlineVehicles,

      // ✅ CHART DATA
      vehiclesByStatus,
      alertsByType,
      tripsData: tripsChart
    });

  } catch (err) {
    next(err);
  }
};
