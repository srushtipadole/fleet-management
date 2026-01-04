import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function UserForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  if (user?.role !== "manager") return <div className="text-red-500">Unauthorized</div>;

  const [form, setForm] = useState({ name:"", email:"", password:"", role:"driver" });

  useEffect(()=> {
    if(!id) return;
    (async ()=> {
      try {
        const res = await API.get(`/users/${id}`);
        setForm({ name: res.data.user.name, email: res.data.user.email, role: res.data.user.role });
      } catch {}
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) await API.put(`/users/${id}`, form);
      else await API.post("/auth/register", form);
      nav("/manager/users");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl bg-[#081826] p-6 rounded-lg border border-slate-700">
      <h2 className="text-xl mb-4">{id ? "Edit User" : "Add User"}</h2>

      <input className="w-full p-2 mb-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input className="w-full p-2 mb-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      {!id && <input className="w-full p-2 mb-2 rounded" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />}
      <select className="w-full p-2 mb-4 rounded" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="driver">Driver</option>
        <option value="vendor">Vendor</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button className="bg-teal-400 text-black px-4 py-2 rounded">Save</button>
    </form>
  );
}
