// routes/analyticsRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { summary } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", auth, permit("admin","manager"), summary);

export default router;
