import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function MaintenanceForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  if (user?.role !== "manager") return <div className="text-red-500">Unauthorized</div>;

  const [form, setForm] = useState({ vehicle:"", description:"", vendor:"", costEstimate:0, dueDate:"" });
  const [vendors, setVendors] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try {
        const v = await API.get("/vendors");
        setVendors(v.data.vendors ?? v.data ?? []);

        const veh = await API.get("/vehicles");
        setVehicles(veh.data.vehicles ?? veh.data ?? []);
      } catch {}

      if (id) {
  try {
    const res = await API.get(`/maintenance/${id}`);
    const job = res.data.job ?? res.data;

    setForm({
      vehicle: job.vehicle?._id || "",
      vendor: job.vendor?._id || "",
      description: job.description || "",
      costEstimate: job.costEstimate || 0,
      dueDate: job.dueDate ? job.dueDate.slice(0,10) : ""
    });

  } catch (err) {
    console.log(err);
  }
}

    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
    vehicleId: form.vehicle,
    description: form.description,
    vendorId: form.vendor || null,
    dueDate: form.dueDate,
    costEstimate: form.costEstimate
  };
    try {
      if (id) await API.put(`/maintenance/${id}`, payload);
      else await API.post("/maintenance", payload);
      nav("/manager/maintenance");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl bg-[#081826] p-6 rounded-lg border border-slate-700">
      <h2 className="text-xl mb-4">{id ? "Edit Job" : "Create Maintenance Job"}</h2>

      {/* Vehicle Select */}
      <select className="w-full p-2 mb-2 rounded"
        value={form.vehicle}
        onChange={e=>setForm({...form,vehicle:e.target.value})}>
        <option value="">Select Vehicle</option>
        {vehicles.map(v => (
          <option key={v._id} value={v._id}>
            {v.name} ({v.registrationNumber})
          </option>
        ))}
      </select>

      <textarea className="w-full p-2 mb-2 rounded" placeholder="Description"
        value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />

      {/* Vendor Select */}
      <select className="w-full p-2 mb-2 rounded" value={form.vendor}
        onChange={e=>setForm({...form,vendor:e.target.value})}>
        <option value="">Select Vendor</option>
        {vendors.map(v => (
          <option key={v._id} value={v._id}>{v.name}</option>
        ))}
      </select>

      <input type="date" className="w-full p-2 mb-2 rounded"
        value={form.dueDate ? form.dueDate.slice(0,10) : ''}
        onChange={e=>setForm({...form,dueDate:e.target.value})} />

      <input type="number" className="w-full p-2 mb-4 rounded"
        placeholder="Cost Estimate" value={form.costEstimate}
        onChange={e=>setForm({...form,costEstimate:parseFloat(e.target.value||0)})} />

      <button className="bg-teal-400 text-black px-4 py-2 rounded">{id ? "Update" : "Create"}</button>
    </form>
  );
}
