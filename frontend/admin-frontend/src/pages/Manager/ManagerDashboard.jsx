import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import LiveMap from "../../components/map/LiveMap";
import Card from "../../components/ui/Card";

export default function ManagerDashboard() {
  // ✅ Safe initial state (no null rendering issues)
  const [summary, setSummary] = useState({
    vehicles: 0,
    drivers: 0,
    maintenance: 0,
    trips: 0,
    alerts: 0,
    tripsData: []
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [sumRes, vRes] = await Promise.all([
          API.get("/analytics/summary"),
          API.get("/vehicles")
        ]);

        // ✅ analytics summary
        setSummary(sumRes.data);

        // ✅ vehicles list (backend safe)
        setVehicles(vRes.data?.vehicles || []);
      } catch (err) {
        console.error("Dashboard load error:", err);

        // fallback (dashboard never crashes)
        setSummary({
          vehicles: 0,
          drivers: 0,
          maintenance: 0,
          trips: 0,
          alerts: 0,
          tripsData: []
        });
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400 text-center mt-10">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Full operational control — vehicles, drivers, vendors, maintenance & trips.
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Total Vehicles" value={summary.vehicles} />
        <Card title="Drivers" value={summary.drivers} />
        <Card title="Active Maintenance" value={summary.maintenance} />
        <Card title="Trips" value={summary.trips} />
        <Card title="Alerts" value={summary.alerts} />
      </div>

      {/* ================= MAP + NOTIFICATIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="text-lg font-semibold mb-3">Live Vehicle Map</h3>
            <LiveMap vehicles={vehicles} style={{ height: 480 }} />
          </Card>
        </div>

        {/* Notifications Placeholder */}
        <div>
          <Card className="h-full">
            <h3 className="text-lg font-semibold mb-3">Recent Notifications</h3>
            <p className="text-gray-400 text-sm">
              Real-time alerts, overspeed, fuel & maintenance notifications will appear here.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
