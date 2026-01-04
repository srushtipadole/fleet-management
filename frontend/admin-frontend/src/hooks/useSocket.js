import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket(user) {
  const ref = useRef(null);

  useEffect(() => {
    const auth = user ? { userId: user.id || user._id, role: user.role } : {};
    ref.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { auth });
    ref.current.on("connect", () => console.log("socket connected", ref.current.id));
    // sample handlers (you can add more in pages)
    ref.current.on("notification:new", (n) => console.log("notif", n));
    return () => ref.current.disconnect();
  }, [user]);

  return ref;
}
