// controllers/blockchainController.js
import BlockchainLog from "../models/BlockchainLog.js";

export const listLogs = async (req, res, next) => {
  try {
    const logs = await BlockchainLog.find().sort({ createdAt: -1 }).limit(500);
    res.json({ logs });
  } catch (err) { next(err); }
};

export const getLog = async (req, res, next) => {
  try {
    const log = await BlockchainLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Not found" });
    res.json({ log });
  } catch (err) { next(err); }
};
