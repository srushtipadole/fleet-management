import jwt from "jsonwebtoken";

export const attachSocketHandlers = (io) => {
  io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.disconnect(true);
        return;
      }

      // 🔐 Verify JWT
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { id, role } = payload;

      // 👤 Personal room
      socket.join(id.toString());

      // 👥 Role-based rooms
      if (role === "admin") socket.join("admins");
      if (role === "manager") socket.join("managers");
      if (role === "vendor") socket.join("vendors");
      if (role === "driver") socket.join("drivers");

      console.log(`Socket connected: ${id} (${role})`);

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${id} (${role})`);
      });

    } catch (err) {
      console.error("Socket auth failed:", err.message);
      socket.disconnect(true);
    }
  });
};
