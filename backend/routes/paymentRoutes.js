import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import {
  createPayment,
  listPayments,
  getPayment,
  approvePayment,
  rejectPayment,
  getVendorPayments
} from "../controllers/paymentController.js";

const router = express.Router();

// list all payments
router.get("/", auth, permit("admin","manager"), listPayments);

// vendor payments (MOVE UP ⬆️)
router.get("/vendor/:vendorId", auth, permit("vendor","admin","manager"), getVendorPayments);

// get single payment
router.get("/:id", auth, permit("admin","manager"), getPayment);

// create payment
router.post("/", auth, permit("admin","manager"), createPayment);

// approve / reject
router.post("/:id/approve", auth, permit("admin","manager"), approvePayment);
router.post("/:id/reject", auth, permit("admin","manager"), rejectPayment);

export default router;
