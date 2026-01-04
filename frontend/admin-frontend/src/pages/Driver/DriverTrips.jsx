import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function DriverTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [openForm, setOpenForm] = useState(null); 
  const [form, setForm] = useState({ to: "", notes: "", status: "" });

  const loadTrips = async () => {
    const res = await API.get(`/trips/driver/${user.id}`);
    setTrips(res.data.trips || []);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleSubmit = async (tripId) => {
    try {
      await API.put(`/trips/complete/${tripId}`, {
        to: form.to,
        notes: form.notes,
        status: form.status,  // 🔥 send updated status
      });

      setOpenForm(null);
      loadTrips();
    } catch {
      alert("Failed to update trip");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Trips</h1>

      {trips.length === 0 && <p>No active trips found.</p>}
<table className="min-w-full border-collapse rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-[#0f2437] text-gray-300 text-xs uppercase tracking-wider">
      <th className="p-3 text-center w-1/6">From</th>
      <th className="p-3 text-center w-1/6">To</th>
      <th className="p-3 text-center w-1/6">Status</th>
      <th className="p-3 text-center w-1/6">Start</th>
      <th className="p-3 text-center w-1/6">End</th>
      <th className="p-3 text-center w-1/6">Actions</th>
    </tr>
  </thead>

  <tbody>
    {trips.map((t, i) => (
      <tr
        key={t._id}
        className={`border-b border-slate-700 ${
          i % 2 === 0 ? "bg-[#0a1a2a]" : "bg-[#0d2237]"
        }`}
      >
        <td className="p-3 text-center">{t.from || "--"}</td>
        <td className="p-3 text-center">{t.to || "--"}</td>

        <td className="p-3 text-center">
          <span
            className={`px-3 py-1 rounded text-sm ${
              t.status === "completed"
                ? "bg-green-600 text-white"
                : t.status === "in-progress"
                ? "bg-blue-500 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {t.status}
          </span>
        </td>

        <td className="p-3 text-center">
          {t.createdAt ? new Date(t.createdAt).toLocaleString() : "--"}
        </td>

        <td className="p-3 text-center">
          {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "--"}
        </td>

        <td className="p-3 text-center">
          <button
            className="bg-teal-400 text-black px-3 py-1 rounded"
            onClick={() => {
              setForm({
                to: t.to || "",
                notes: t.notes || "",
                status: t.status,
              });
              setOpenForm(t._id);
            }}
          >
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* 🔥 EDIT MODAL */}
      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-[#102030] p-6 rounded-lg w-96 border border-slate-700">
            <h2 className="text-xl mb-3">Edit Trip</h2>

            <label className="text-gray-300 text-sm">Destination (To)</label>
            <input
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-2"
              placeholder="Destination"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />

            <label className="text-gray-300 text-sm">Notes</label>
            <textarea
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-4"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <label className="text-gray-300 text-sm">Status</label>
            <select
              className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-4"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-slate-600 rounded"
                onClick={() => setOpenForm(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-teal-400 text-black rounded"
                onClick={() => handleSubmit(openForm)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
