import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";

export default function Vehicles(){
  const [vehicles, setVehicles] = useState([]);
  useEffect(()=> {
    (async ()=> {
      try {
        const res = await API.get("/vehicles");
        setVehicles(res.data.vehicles ?? res.data ?? []);
      } catch (err) {
        setVehicles([]);
      }
    })();
  },[]);

  const cols = [
    { key: "name", title: "Name" },
    { key: "registrationNumber", title: "Reg No." },
    { key: "status", title: "Status", render: r => <span className={`px-2 py-1 rounded ${r.status==="running"?"bg-green-600":"bg-slate-700"}`}>{r.status}</span> },
    // { key: "actions", title: "Actions", render: r => (<div className="flex gap-2"><Link to={`/vehicles/edit/${r._id}`} className="text-teal-300">Edit</Link></div>) }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Vehicles</h2>
        {/* <Link to="/vehicles/add" className="bg-teal-400 text-black px-3 py-1 rounded">Add Vehicle</Link> */}
      </div>

      <Table columns={cols} data={vehicles} />
    </div>
  );
}
