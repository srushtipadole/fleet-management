import Payment from "../models/Payment.js";
import { addBlockchainLog } from "../utils/blockchain.js";
import { createNotification } from "./notificationController.js";

// ===============================
// CREATE PAYMENT
// ===============================
export const createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      status: "pending",
      createdBy: req.user._id
    });

    await addBlockchainLog("PaymentCreated", {
      paymentId: payment._id,
      amount: payment.amount,
      createdBy: req.user._id
    });

    res.status(201).json({ payment });
  } catch (err) {
    next(err);
  }
};

// ===============================
// LIST PAYMENTS (ADMIN / MANAGER)
// ===============================
export const listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("to createdBy job");

    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GET SINGLE PAYMENT
// ===============================
export const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("to createdBy job");

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// ===============================
// APPROVE PAYMENT (ADMIN / MANAGER)
// ===============================
export const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "pending")
      return res.status(400).json({ message: "Payment already processed" });

    payment.status = "approved";
    payment.approvedBy = req.user._id;
    payment.approvedAt = new Date();

    await payment.save();

    await addBlockchainLog("PaymentApproved", {
      paymentId: payment._id,
      approvedBy: req.user._id
    });

    // 🔔 notify vendor/user
    await createNotification(
      {
        title: "Payment Approved",
        message: `Payment of ₹${payment.amount} approved`,
        recipient: payment.to,
        type: "success"
      },
      req
    );

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// ===============================
// REJECT PAYMENT
// ===============================
export const rejectPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "pending")
      return res.status(400).json({ message: "Payment already processed" });

    payment.status = "rejected";
    await payment.save();

    await addBlockchainLog("PaymentRejected", {
      paymentId: payment._id,
      rejectedBy: req.user._id
    });

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// ===============================
// MARK PAYMENT AS PAID
// ===============================
export const markAsPaid = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "approved")
      return res.status(400).json({ message: "Payment not approved yet" });

    payment.status = "paid";
    payment.paidAt = new Date();
    payment.paymentMode = req.body.paymentMode;

    await payment.save();

    await addBlockchainLog("PaymentPaid", {
      paymentId: payment._id,
      paidBy: req.user._id
    });

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// ===============================
// VENDOR PAYMENTS
// ===============================
export const getVendorPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      toType: "Vendor",
      to: req.params.vendorId
    })
      .populate("job to createdBy");

    res.json({ payments });
  } catch (err) {
    next(err);
  }
};
