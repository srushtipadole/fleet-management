import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function DriverVehicle() {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/vehicles/driver/${user.id}`);
      setVehicle(res.data.vehicle);
    })();
  }, []);

  if (!vehicle) return <div>No vehicle assigned</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Vehicle</h1>

      <div className="bg-[#081826] p-4 rounded border border-slate-700">
        <p><strong>Name:</strong> {vehicle.name}</p>
        <p><strong>Number:</strong> {vehicle.registrationNumber}</p>
        <p><strong>Model:</strong> {vehicle.model}</p>
        <p><strong>Fuel Level:</strong> {vehicle.fuelLevel}%</p>
        <p><strong>Status:</strong> {vehicle.status}</p>
      </div>
    </div>
  );
}
