import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import Table from "../../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Maintenance(){
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    try {
      const res = await API.get("/maintenance");
      setJobs(res.data.jobs ?? res.data ?? []);
    } catch { setJobs([]); }
  };

  useEffect(()=> { load(); }, []);

  const cols = [
    { key:'vehicle', title:'Vehicle', render: r => r.vehicle?.name ?? r.vehicle },
    { key:'description', title:'Issue' },
    { key:'status', title:'Status' },
    { key:'vendor', title:'Vendor', render: r => r.vendor?.name ?? '' },
    { key:'actions', title:'Actions', render: r => isManager ? <Link to={`/manager/maintenance/edit/${r._id}`} className="text-teal-300">Edit</Link> : "Read Only" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Maintenance</h2>
        {isManager && <Link to="/manager/maintenance/add" className="bg-teal-400 text-black px-3 py-1 rounded">Create Job</Link>}
      </div>

      <Table columns={cols} data={jobs} />
    </div>
  );
}
