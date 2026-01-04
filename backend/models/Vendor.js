import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  phone: String,
  email: String,
  address: String,

  services: [String],

  // 🔥 ADD THESE
  verified: {
    type: Boolean,
    default: false
  },

  slaHours: Number, // expected response time

  activeJobs: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("Vendor", VendorSchema);
