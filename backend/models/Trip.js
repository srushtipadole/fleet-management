import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  from: String,
  to: String,

  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress"
  },

  // 🔥 ADD THESE (IMPORTANT)
  startedAt: Date,
  endedAt: Date,

  distanceKm: Number,     // analytics
  fuelUsed: Number,      // IoT based

  startType: {            // auto/manual/admin
    type: String,
    enum: ["auto", "manual", "admin"],
    default: "auto"
  }

}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
