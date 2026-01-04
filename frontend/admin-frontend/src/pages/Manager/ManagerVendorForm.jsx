import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function VendorForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  if (user?.role !== "manager")
    return <div className="text-red-500">Unauthorized</div>;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    services: "",
  });

  // Load vendor if editing
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await API.get(`/vendors/${id}`);
          const data = res.data.vendor;

          setForm({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            services: data.services?.join(", ") || "",
          });
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      services: form.services
        ? form.services.split(",").map((s) => s.trim())
        : [],
    };

    try {
      if (id) {
        await API.put(`/vendors/${id}`, payload);
      } else {
        await API.post("/vendors", payload);
      }
      nav("/manager/vendors");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-[#081826] p-6 rounded-lg border border-slate-700"
    >
      <h2 className="text-xl mb-4">{id ? "Edit Vendor" : "Add Vendor"}</h2>

      {/* Vendor Name */}
      <input
        className="w-full p-2 mb-2 rounded"
        placeholder="Vendor Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Vendor Phone */}
      <input
        className="w-full p-2 mb-2 rounded"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      {/* Vendor Email */}
      <input
        className="w-full p-2 mb-2 rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Vendor Address */}
      <input
        className="w-full p-2 mb-2 rounded"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      {/* Vendor Services */}
      <input
        className="w-full p-2 mb-4 rounded"
        placeholder="Services (comma separated)"
        value={form.services}
        onChange={(e) => setForm({ ...form, services: e.target.value })}
      />

      <button className="bg-teal-400 text-black px-4 py-2 rounded">
        {id ? "Update" : "Create"}
      </button>
    </form>
  );
}
