import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  assignDriver,
  listVehicleByDriver
} from "../controllers/vehicleController.js";

const router = express.Router();

// List all vehicles
router.get("/", auth, permit("admin","manager"), listVehicles);

// Vehicle by driver (MOVE UP ⬆️)
router.get("/driver/:id", auth, permit("driver","admin","manager"), listVehicleByDriver);

// Create vehicle
router.post("/", auth, permit("admin","manager"), createVehicle);

// Assign driver
router.post("/:id/assign-driver", auth, permit("admin","manager"), assignDriver);

// Update / delete
router.put("/:id", auth, permit("admin","manager"), updateVehicle);
router.delete("/:id", auth, permit("admin","manager"), deleteVehicle);

// Get single vehicle (KEEP LAST ⬇️)
router.get("/:id", auth, permit("admin","manager"), getVehicle);

export default router;
