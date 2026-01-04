import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function DriverMaintenance() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/maintenance/driver/${user.id}`);
      setList(res.data.maintenance || []);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Maintenance Tasks</h1>

      {list.length === 0 && <p>No maintenance tasks for your vehicle.</p>}

      {list.map(m => (
        <div key={m._id} className="p-4 bg-[#081826] rounded mb-3 border border-slate-700">
          <p><strong>Vehicle:</strong> {m.vehicle?.name}</p>
          <p><strong>Description:</strong> {m.description}</p>
          <p><strong>Status:</strong> {m.status}</p>
          <p><strong>Vendor:</strong> {m.vendor?.name || "Not Assigned"}</p>
          <p><strong>Due Date:</strong> {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "—"}</p>
        </div>
      ))}
    </div>
  );
}
