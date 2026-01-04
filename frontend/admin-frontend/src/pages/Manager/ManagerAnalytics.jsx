import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../components/ui/Card";
import API from "../../api/axios";

export default function ManagerAnalytics(){
  const [summary, setSummary] = useState({
    vehicles: 0, drivers: 0, maintenance: 0, trips: 0, alerts: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/analytics/summary");
        const data = res.data;
        setSummary({
          vehicles: data.vehicles ?? 0,
          drivers: data.drivers ?? 0,
          maintenance: data.maintenance ?? 0,
          trips: data.trips ?? 0,
          alerts: data.alerts ?? 0
        });
        // transform tripsData to chart format (date,label,trips)
        const trips = (data.tripsData ?? []).map(d => ({
          date: d.date,
          trips: d.trips
        }));
        setChartData(trips);
      } catch (err) {
        console.error("Analytics load error", err);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Vehicles" value={summary.vehicles} />
        <Card title="Drivers" value={summary.drivers} />
        <Card title="Active Maintenance" value={summary.maintenance} />
        <Card title="Total Trips" value={summary.trips} />
      </div>

      <Card>
        <h3 className="mb-2">Trips — Last 7 days</h3>
        <div style={{height:300}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false}/>
              <Tooltip />
              <Line dataKey="trips" stroke="#34D399" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
