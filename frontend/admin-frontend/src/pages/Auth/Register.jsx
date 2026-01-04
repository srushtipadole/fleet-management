import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "driver" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered — login now");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041018]">
      <form onSubmit={submit} className="w-96 bg-[#081826] p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 className="text-2xl text-white mb-4">Create account</h2>

        <label className="text-sm text-slate-300">Name</label>
        <input className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
          value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
        />

        <label className="text-sm text-slate-300">Email</label>
        <input className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
          value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
        />

        <label className="text-sm text-slate-300">Password</label>
        <input type="password" className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
          value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
        />

        <label className="text-sm text-slate-300">Role</label>
        <select className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-4"
          value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
        >
          <option value="driver">Driver</option>
          <option value="vendor">Vendor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-teal-400 text-black py-2 rounded font-semibold">Register</button>

        <div className="mt-3 text-sm text-slate-400">
          Already registered? <a href="/login" className="text-teal-300">Login</a>
        </div>
      </form>
    </div>
  );
}
