import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function VendorMaintenanceForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    status: "",
    workDescription: "",
    amount: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/maintenance/${id}`);
        setForm({
          status: res.data.maintenance.status,
          workDescription: res.data.maintenance.workDescription || "",
          amount: res.data.maintenance.amount || "",
        });
      } catch {}
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/maintenance/${id}`, {
        status: form.status,
      notes: form.workDescription,
      actualCost: form.amount,
      });
      nav("/vendor/maintenance");
    } catch {
      console.log(err);
      
      alert("Update failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-lg bg-[#081826] p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-2xl mb-4">Update Maintenance</h2>

      <label>Status</label>
      <select
        className="w-full p-2 mb-3 rounded bg-[#03151a] border"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <label>Work Description</label>
      <textarea
        className="w-full p-2 mb-3 bg-[#03151a] border rounded"
        value={form.workDescription}
        onChange={(e) => setForm({ ...form, workDescription: e.target.value })}
      />

      <label>Amount (₹)</label>
      <input
        type="number"
        className="w-full p-2 mb-4 bg-[#03151a] border rounded"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <button className="bg-teal-400 text-black px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
