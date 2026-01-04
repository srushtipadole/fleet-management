import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import {
  listTrips,
  getTrip,
  forceStartTrip,
  forceCompleteTrip,
  getTripByDriver,
  driverStartTrip,
  driverCompleteTrip
} from "../controllers/tripController.js";

const router = express.Router();

// Driver-specific
router.get("/driver/:id", auth, permit("driver","admin","manager"), getTripByDriver);
router.put("/start/:id", auth, permit("driver"), driverStartTrip);
router.put("/complete/:id", auth, permit("driver"), driverCompleteTrip);

// Admin / Manager
router.get("/", auth, permit("admin","manager"), listTrips);
router.post("/force-start", auth, permit("admin","manager"), forceStartTrip);
router.post("/:id/force-complete", auth, permit("admin","manager"), forceCompleteTrip);
router.get("/:id", auth, permit("admin","manager"), getTrip);

export default router;
