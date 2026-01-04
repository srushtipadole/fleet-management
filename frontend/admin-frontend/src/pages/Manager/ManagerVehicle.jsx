import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import Table from "../../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const load = async () => {
    try {
      const res = await API.get("/vehicles");
      setVehicles(res.data.vehicles ?? res.data ?? []);
    } catch {
      setVehicles([]);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete vehicle?")) return;
    try {
      await API.delete(`/vehicles/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🔥 STATUS BADGE UI
  const StatusBadge = ({ status }) => {
    const colors = {
      idle: "bg-gray-600 text-white",
      assigned: "bg-blue-600 text-white",
      "on-trip": "bg-yellow-500 text-black",
      maintenance: "bg-red-600 text-white"
    };

    return (
      <span className={`px-3 py-1 rounded text-sm ${colors[status] || "bg-gray-500"}`}>
        {status}
      </span>
    );
  };

  const cols = [
    { key: "name", title: "Name" },
    { key: "registrationNumber", title: "Reg No." },
    { key: "model", title: "Model" },

    {
      key: "assignedDriver",
      title: "Assigned Driver",
      render: r => r.assignedDriver ? r.assignedDriver.name : "—"
    },

    {
      key: "fuelLevel",
      title: "Fuel",
      render: r => `${r.fuelLevel ?? 0}%`
    },

    {
      key: "status",
      title: "Status",
      render: r => <StatusBadge status={r.status} />
    },

    {
      key: "actions",
      title: "Actions",
      render: r => isManager ? (
        <div className="flex gap-2">
          <Link to={`/manager/vehicles/edit/${r._id}`} className="text-yellow-300">
            Edit
          </Link>
          <button
            onClick={() => handleDelete(r._id)}
            className="text-red-400"
          >
            Delete
          </button>
        </div>
      ) : "Read Only"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Vehicles</h2>

        {isManager && (
          <Link
            to="/manager/vehicles/add"
            className="bg-teal-400 text-black px-3 py-1 rounded"
          >
            Add Vehicle
          </Link>
        )}
      </div>

      <Table columns={cols} data={vehicles} />
    </div>
  );
}
