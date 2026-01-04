import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  toType: {
    type: String,
    enum: ["Vendor", "User", "other"],
    default: "User"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "toType",
    required: true
  },

  job: { type: mongoose.Schema.Types.ObjectId, ref: "Maintenance" },

  reference: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "paid"],
    default: "pending"
  },

  // 🔥 ADD THESE
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: Date,

  paidAt: Date,
  paymentMode: {
    type: String,
    enum: ["cash", "upi", "bank", "cheque", "crypto"]
  },

  meta: Object,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);
