import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function VehicleForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  if (user?.role !== "manager") return <div className="text-red-500">Unauthorized</div>;

  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    model: "",
    capacity: "",
    assignedDriver: ""
  });

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await API.get("/users/drivers");
        setDrivers(d.data.users ?? d.data ?? []);
      } catch {}

      if (id) {
        try {
          const res = await API.get(`/vehicles/${id}`);
          const v = res.data.vehicle ?? res.data;

          setForm({
            name: v.name || "",
            registrationNumber: v.registrationNumber || "",
            model: v.model || "",
            capacity: v.capacity || "",
            assignedDriver: v.assignedDriver?._id || ""
          });
        } catch {}
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      assignedDriver: form.assignedDriver || null // always send valid value
    };

    try {
      if (id) await API.put(`/vehicles/${id}`, payload);
      else await API.post("/vehicles", payload);

      nav("/manager/vehicles");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-[#081826] p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-xl mb-4">{id ? "Edit Vehicle" : "Add Vehicle"}</h2>

      <input
        className="w-full p-2 mb-2 rounded bg-[#03151a] border border-slate-700"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full p-2 mb-2 rounded bg-[#03151a] border border-slate-700"
        placeholder="Registration Number"
        value={form.registrationNumber}
        onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
      />

      <input
        className="w-full p-2 mb-2 rounded bg-[#03151a] border border-slate-700"
        placeholder="Model"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
      />

      <input
        className="w-full p-2 mb-2 rounded bg-[#03151a] border border-slate-700"
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
      />

      <select
        className="w-full p-2 mb-4 rounded bg-[#03151a] border border-slate-700"
        value={form.assignedDriver}
        onChange={(e) => setForm({ ...form, assignedDriver: e.target.value })}
      >
        <option value="">Assign driver (optional)</option>

        {drivers.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.email})
          </option>
        ))}
      </select>

      <button className="bg-teal-400 text-black px-4 py-2 rounded">
        {id ? "Update" : "Create"}
      </button>
    </form>
  );
}
