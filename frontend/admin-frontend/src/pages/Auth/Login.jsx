import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Redirect based on role
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "manager") navigate("/manager/dashboard");
      else if (user.role === "driver") navigate("/driver/dashboard");
      else if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041018]">
      <form onSubmit={handle} className="w-96 bg-[#081826] p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 className="text-2xl text-white mb-4">Sign in</h2>

        <label className="text-sm text-slate-300">Email</label>
        <input
          className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="text-sm text-slate-300">Password</label>
        <input
          type="password"
          className="w-full p-2 rounded bg-[#03151a] border border-slate-700 mb-4"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-teal-400 text-black py-2 rounded font-semibold" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-3 text-sm text-slate-400">
          Don't have account? <a href="/register" className="text-teal-300">Register</a>
        </div>
      </form>
    </div>
  );
}
