import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function PaymentForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  if (user?.role !== "manager")
    return <div className="text-red-500">Unauthorized</div>;

  const [form, setForm] = useState({
    amount: 0,
    toType: "Vendor",
    to: "",
    reference: "",
    status: "pending",
    job: ""
  });

  const [vendors, setVendors] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const v = await API.get("/vendors");
        setVendors(v.data.vendors ?? []);
      } catch {}

      try {
        const j = await API.get("/maintenance");
        setJobs(j.data.jobs ?? []);
      } catch {}

      // LOAD PAYMENT IF EDIT MODE
      if (id) {
        const res = await API.get(`/payments/${id}`);
        setForm(res.data.payment ?? res.data);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) await API.put(`/payments/${id}`, form);
      else await API.post("/payments", form);
      nav("/manager/payments");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-[#081826] p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-xl mb-4">
        {id ? "Edit Payment" : "Create Payment"}
      </h2>

      {/* Amount */}
      <input
        type="number"
        className="w-full p-2 mb-2 rounded"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: parseFloat(e.target.value || 0) })
        }
      />

      {/* Payment To */}
      <select
        className="w-full p-2 mb-2 rounded"
        value={form.toType}
        onChange={(e) => setForm({ ...form, toType: e.target.value, to: "" })}
      >
        <option value="Vendor">Vendor</option>
        <option value="User">User</option>
      </select>

      {/* Vendor/User Selection */}
      <select
        className="w-full p-2 mb-2 rounded"
        value={form.to}
        onChange={(e) => setForm({ ...form, to: e.target.value })}
      >
        <option value="">Select {form.toType}</option>

        {form.toType === "Vendor" &&
          vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}

        {form.toType === "User" &&
          users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
      </select>

      {/* Job selection */}
      <select
        className="w-full p-2 mb-2 rounded"
        value={form.job || ""}
        onChange={(e) => setForm({ ...form, job: e.target.value })}
      >
        <option value="">Select Maintenance Job (optional)</option>
        {jobs.map((j) => (
          <option key={j._id} value={j._id}>
            {j.description} ({j.status})
          </option>
        ))}
      </select>

      {/* Status selection */}
      <select
        className="w-full p-2 mb-2 rounded"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="paid">Paid</option>
      </select>

      {/* Reference */}
      <input
        className="w-full p-2 mb-4 rounded"
        placeholder="Reference"
        value={form.reference}
        onChange={(e) => setForm({ ...form, reference: e.target.value })}
      />

      <button className="bg-teal-400 text-black px-4 py-2 rounded">
        {id ? "Update" : "Create"}
      </button>
    </form>
  );
}
