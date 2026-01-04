import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import LiveMap from "../../components/map/LiveMap";
import Card from "../../components/ui/Card";

export default function Dashboard(){
  const [summary, setSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(()=> {
    (async ()=>{
      try {
        const [sumRes, vRes] = await Promise.all([
          API.get("/analytics/summary"),
          API.get("/vehicles")
        ]);
        setSummary(sumRes.data);
        setVehicles(vRes.data.vehicles ?? vRes.data ?? []);
      } catch (err) {
        setSummary({ vehicles:0, drivers:0, maintenance:0, trips:0, alerts:0 });
        setVehicles([]);
      }
    })();
  },[]);

  return (
    <div>
      <div className="mb-4"><h1 className="text-3xl font-bold">Admin Dashboard</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Vehicles" value={summary?.vehicles ?? 0} />
        <Card title="Drivers" value={summary?.drivers ?? 0} />
        <Card title="Maintenance" value={summary?.maintenance ?? 0} />
        <Card title="Trips" value={summary?.trips ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-3">Live Map</h3>
            <LiveMap vehicles={vehicles} style={{ height: 480 }} />
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-lg font-semibold mb-3">Recent Notifications</h3>
            {/* Simple fetch could be added */}
          </Card>
        </div>
      </div>
    </div>
  );
}
