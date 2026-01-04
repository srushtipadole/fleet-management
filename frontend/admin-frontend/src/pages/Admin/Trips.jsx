import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Table from "../../components/ui/Table";

export default function Trips(){
  const [trips, setTrips] = useState([]);
  useEffect(()=> {
    (async ()=> {
      try {
        const res = await API.get("/trips");
        setTrips(res.data.trips ?? res.data ?? []);
      } catch { setTrips([]); }
    })();
  },[]);

  const cols = [
    { key: "vehicle", title: "Vehicle", render: r => r.vehicle?.name || r.vehicle },
    { key: "driver", title: "Driver", render: r => r.driver?.name || r.driver },
    { key: "status", title: "Status" },
    { key: "date", title: "Date", render: r => new Date(r.date).toLocaleString() },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Trips</h2>
      <Table columns={cols} data={trips} />
    </div>
  );
}
