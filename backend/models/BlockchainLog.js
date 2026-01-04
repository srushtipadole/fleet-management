import mongoose from "mongoose";
import crypto from "crypto";

const blockSchema = new mongoose.Schema({
  index: Number,
  timestamp: Date,
  eventType: String,
  data: Object,
  previousHash: String,
  hash: String
});

blockSchema.statics.createBlock = async function(eventType, data){
  const last = await this.findOne().sort({ index: -1 });
  const index = last ? last.index + 1 : 0;
  const previousHash = last ? last.hash : "0";
  const timestamp = new Date();
  const payload = JSON.stringify({ index, timestamp, eventType, data, previousHash });
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  return this.create({ index, timestamp, eventType, data, previousHash, hash });
};

export default mongoose.model("BlockchainLog", blockSchema);
