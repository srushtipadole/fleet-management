// routes/maintenanceRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { createJob, assignVendor, updateJobStatus, listJobs, getJob,getVendorJobs,getDriverMaintenance } from "../controllers/maintenanceController.js";

const router = express.Router();

router.get("/", auth, permit("admin","manager"), listJobs);
router.get("/vendor/:id/jobs", auth, permit("vendor", "admin", "manager"), getVendorJobs);
router.get("/driver/:driverId", auth, permit("driver", "manager", "admin"), getDriverMaintenance);
router.get("/:id", auth, permit("admin","manager","vendor"), getJob);
router.post("/", auth, permit("admin","manager"), createJob);
router.post("/:id/assign-vendor", auth, permit("admin","manager"), assignVendor);
router.put("/:id", auth, permit("admin","manager","vendor"), updateJobStatus);

export default router;
