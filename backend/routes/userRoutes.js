import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import {
  listUsers,
  listDrivers,
  getUser,
  updateUser,
  deleteUser,
  listVendorUsers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", auth, permit("admin","manager"), listUsers);
router.get("/drivers", auth, permit("admin","manager"), listDrivers);
router.get("/vendors", auth, permit("admin","manager"), listVendorUsers);

router.get("/:id", auth, permit("admin","manager"), getUser);

// 🔒 Admin only
router.put("/:id", auth, permit("admin"), updateUser);
router.delete("/:id", auth, permit("admin"), deleteUser);

export default router;
