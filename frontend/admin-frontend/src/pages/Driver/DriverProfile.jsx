import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function DriverProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="bg-[#081826] p-4 rounded border border-slate-700">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
