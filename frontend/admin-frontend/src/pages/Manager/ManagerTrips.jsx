import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Table from "../../components/ui/Table";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    driverId: "",
    vehicleId: "",
    from: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Load trips
  const loadTrips = async () => {
    try {
      const res = await API.get("/trips");
      setTrips(res.data.trips ?? []);
    } catch {
      setTrips([]);
    }
  };

  // Load drivers + vehicles
  const loadFormData = async () => {
    try {
      const d = await API.get("/users/drivers");
      setDrivers(d.data.users || []);

      const v = await API.get("/vehicles");
      setVehicles(v.data.vehicles || []);
    } catch {}
  };

  useEffect(() => {
    loadTrips();
    loadFormData();
  }, []);

  const cols = [
    { key: "vehicle", title: "Vehicle", render: r => r.vehicle?.name },
    { key: "driver", title: "Driver", render: r => r.driver?.name },
    { key: "status", title: "Status" },
    { key: "from", title: "From" },
    { key: "to", title: "To" },
    { key: "date", title: "Date", render: r => r.date ? new Date(r.date).toLocaleString() : "" }
  ];

  // --------------------------
  // Submit Start Trip
  // --------------------------
  const handleSubmit = async () => {
    try {
      await API.post("/trips/force-start", form);
      setOpenForm(false);
      setForm({ driverId: "", vehicleId: "", from: "" });
      loadTrips();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start trip");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Trips</h2>

        {/* 🔥 Assign Trip Button */}
        <button
          className="bg-teal-400 text-black px-4 py-2 rounded"
          onClick={() => setOpenForm(true)}
        >
          Assign Trip
        </button>
      </div>

      <Table columns={cols} data={trips} />

      {/* 🔥 Assign Trip Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#102030] w-96 p-6 rounded-lg border border-slate-600">
            <h3 className="text-xl font-bold mb-4">Assign New Trip</h3>

            {/* Driver */}
            <label className="text-gray-400 text-sm">Driver</label>
            <select
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
              value={form.driverId}
              onChange={(e) => setForm({ ...form, driverId: e.target.value })}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.email})
                </option>
              ))}
            </select>

            {/* Vehicle */}
            <label className="text-gray-400 text-sm">Vehicle</label>
            <select
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} ({v.registrationNumber})
                </option>
              ))}
            </select>

            {/* From */}
            <label className="text-gray-400 text-sm">Starting Point</label>
            <input
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-4"
              placeholder="From"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-slate-600 rounded"
                onClick={() => setOpenForm(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-teal-400 text-black rounded"
                onClick={handleSubmit}
              >
                Assign Trip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
