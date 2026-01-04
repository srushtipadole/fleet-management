import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: String,
  model: String,

  registrationNumber: {
    type: String,
    unique: true
  },

  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // live location
  location: {
    lat: Number,
    lng: Number
  },

  speed: Number,
  fuelLevel: Number,

  status: {
    type: String,
    enum: ["idle", "assigned", "on-trip", "maintenance"],
    default: "idle"
  },

  mileage: Number,

  // 🔥 ADD THESE (IoT CORE)
  device: {
    imei: String,
    firmware: String,
    lastPingAt: Date
  },

  health: {
    engineTemp: Number,
    battery: Number
  },

  totalDistance: {
    type: Number,
    default: 0
  },

  lastMaintenanceAt: Date

}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
