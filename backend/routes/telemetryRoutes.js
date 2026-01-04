import express from "express";
import { updateTelemetry } from "../controllers/telemetryController.js";
import { iotAuth } from "../middleware/iotAuth.js";

const router = express.Router();

router.post("/update", iotAuth, updateTelemetry);

export default router;
