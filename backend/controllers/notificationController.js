import Notification from "../models/Notification.js";

// ===============================
// CREATE NOTIFICATION
// ===============================
export const createNotification = async (payload = {}, req) => {
  // --------- IoT SPAM CONTROL (optional but recommended) ----------
  if (payload.alertCode && payload.vehicle) {
    const recent = await Notification.findOne({
      vehicle: payload.vehicle,
      alertCode: payload.alertCode,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } // 10 min cooldown
    });
    if (recent) return recent; // skip duplicate
  }

  // --------- SAVE ----------
  const notif = await Notification.create(payload);

  // --------- SOCKET EMIT ----------
  const io = req?.app?.get("io");
  if (!io) return notif;

  // personal user (driver/vendor)
  if (payload.recipient) {
    io.to(payload.recipient.toString())
      .emit("notification:new", notif);
  }

  // role-based broadcast
  if (payload.roles?.includes("admin")) {
    io.to("admins").emit("notification:new", notif);
  }
  if (payload.roles?.includes("manager")) {
    io.to("managers").emit("notification:new", notif);
  }
  if (payload.roles?.includes("vendor")) {
    io.to("vendors").emit("notification:new", notif);
  }

  return notif;
};

// ===============================
// GET NOTIFICATIONS
// ===============================
export const getNotifications = async (req, res, next) => {
  try {
    const { user } = req;

    let query = {};

    if (user.role === "admin") {
      // admin sees all
      query = {};
    } else {
      // user sees:
      // 1) personal notifications
      // 2) role-based notifications
      query = {
        $or: [
          { recipient: user._id },
          { roles: user.role }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ notifications });
  } catch (err) {
    next(err);
  }
};
