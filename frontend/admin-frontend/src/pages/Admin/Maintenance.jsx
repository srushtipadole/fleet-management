import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Table from "../../components/ui/Table";

export default function Maintenance(){
  const [jobs, setJobs] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/maintenance");
      setJobs(res.data.jobs ?? res.data ?? []);
    } catch {
      setJobs([{_id:1,vehicle:"Truck1",desc:"Engine noise",status:"pending"}]);
    }
  })(); },[]);

  const cols = [
    { key:"vehicle", title:"Vehicle", render: r => r.vehicle?.name || r.vehicle?.registrationNumber || "Unknown" },
    { key:"description", title:"Issue" },
    { key:"status", title:"Status" },
    { key:"vendor", title:"Vendor",render: r => r.vendor?.name || "No Vendor" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Maintenance</h2>
      <Table columns={cols} data={jobs} />
    </div>
  );
}
