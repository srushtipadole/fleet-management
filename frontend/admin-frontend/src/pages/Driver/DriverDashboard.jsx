import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import LiveMap from "../../components/map/LiveMap";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [trip, setTrip] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Vehicle
        const vRes = await API.get(`/vehicles/driver/${user.id}`)
          .catch(err =>
            err.response?.status === 404 ? { data: { vehicle: null } } : Promise.reject(err)
          );
        setVehicle(vRes.data.vehicle);

        // Trip
        const tRes = await API.get(`/trips/driver/${user.id}`)
          .catch(err =>
            err.response?.status === 404 ? { data: { trips: [] } } : Promise.reject(err)
          );

        // 🔥 Fix here: take the first active trip
        setTrip(tRes.data.trips?.[0] || null);

        // Notifications
        const nRes = await API.get(`/notifications`)
          .catch(err =>
            err.response?.status === 404 ? { data: { notifications: [] } } : Promise.reject(err)
          );
        setNotifications(nRes.data.notifications);
      } catch (err) {
        console.error("Unexpected error fetching driver data:", err);
      }
    })();
  }, [user.id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="My Vehicle" value={vehicle?.name || "No Vehicle"} />
        <Card title="Current Trip" value={trip?.status || "No Active Trip"} />
        <Card title="Alerts" value={notifications.length} />
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Live Location</h2>
        {vehicle ? (
          <LiveMap vehicles={[vehicle]} style={{ height: 400 }} />
        ) : (
          <p className="text-slate-400">No vehicle assigned yet.</p>
        )}
      </Card>
    </div>
  );
}
