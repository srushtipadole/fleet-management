// routes/vendorRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { listVendors, getVendor, createVendor, updateVendor, deleteVendor, vendorJobs,vendorSummary } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", auth, permit("admin","manager"), listVendors);
router.post("/", auth, permit("admin","manager"), createVendor);
router.get("/summary/me",auth, permit("vendor"), vendorSummary);
router.get("/:id/jobs", auth, permit("admin","manager","vendor"), vendorJobs);
router.get("/:id", auth, permit("admin","manager","vendor"), getVendor);
router.put("/:id", auth, permit("admin","manager"), updateVendor);
router.delete("/:id", auth, permit("admin","manager"), deleteVendor);



export default router;
