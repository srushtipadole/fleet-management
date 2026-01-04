import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,

  type: {
    type: String,
    enum: ["info", "warning", "critical", "success"],
    default: "info"
  },

  // personal notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // 🔥 ADD THIS (role-based)
  roles: [{
    type: String,
    enum: ["admin", "manager", "driver", "vendor"]
  }],

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null
  },

  // 🔥 ADD THIS (IoT spam control & analytics)
  alertCode: String, // LOW_FUEL, OVERSPEED

  source: {
    type: String,
    enum: ["telemetry", "trip", "maintenance", "payment"],
    default: "telemetry"
  },

  read: { type: Boolean, default: false },

  meta: Object
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
