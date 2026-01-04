// routes/dashboardRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";

const router = express.Router();

// Admin-only
router.get("/admin-dashboard", auth, permit("admin"), (req, res) => {
  res.json({ secret: "Admin data" });
});

// Admin or Manager
router.get("/manage-dashboard", auth, permit("admin", "manager"), (req, res) => {
  res.json({ secret: "Admin & Manager data" });
});

export default router;
// 