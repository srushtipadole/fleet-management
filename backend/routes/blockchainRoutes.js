// routes/blockchainRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { listLogs, getLog } from "../controllers/blockchainController.js";

const router = express.Router();

router.get("/logs", auth, permit("admin","manager"), listLogs);
router.get("/logs/:id", auth, permit("admin","manager"), getLog);

export default router;
