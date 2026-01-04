import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Vendor gets his own based on recipient=user._id
        const res = await API.get("/notifications");
        setNotifications(res.data.notifications);
      } catch (err) {
        console.log("Notification load error", err);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>

      <Card>
        {notifications.length === 0 && (
          <p className="text-slate-400">No notifications yet.</p>
        )}

        {notifications.map((n) => (
          <div key={n._id} className="border-b border-slate-700 py-3">
            <h3 className="text-lg font-semibold">{n.title}</h3>
            <p className="text-slate-300">{n.message}</p>
            <p className="text-xs text-slate-500">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
