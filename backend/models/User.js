import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    lowercase: true
  },

  password: String,

  role: {
    type: String,
    enum: ["admin", "driver", "vendor", "manager"],
    default: "driver"
  },

  // 🔥 ADD THESE
  phone: String,

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  },

  lastLoginAt: Date,

  permissions: [String], // future fine-grained access

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null
  },

  walletAddress: String
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
