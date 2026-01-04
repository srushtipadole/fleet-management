import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function DriverNotifications() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/notifications`);
      setList(res.data.notifications);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {list.map(n => (
        <div key={n._id} className="p-3 bg-[#102030] rounded mb-2">
          <strong>{n.title}</strong>
          <p className="text-slate-300">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
