import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

  // affected driver
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null
  },

  description: String,

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },

  // 🔥 ADD THESE
  type: {
    type: String,
    enum: ["manual", "scheduled", "iot-alert"],
    default: "manual"
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },

  dueDate: Date,

  costEstimate: Number,
  actualCost: Number,

  notes: String,

  // 🔥 downtime tracking
  startedAt: Date,
  completedAt: Date,

  // 🔥 approval workflow
  approval: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  documents: [String],

  // 🔥 link to alert
  alertCode: String

}, { timestamps: true });

export default mongoose.model("Maintenance", maintenanceSchema);
