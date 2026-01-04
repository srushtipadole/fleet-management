import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import Table from "../../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Vendors(){
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [vendors, setVendors] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try { const res = await API.get("/vendors"); setVendors(res.data.vendors ?? res.data ?? []); } catch { setVendors([]); }
    })();
  }, []);

  const cols = [
    { key:'name', title:'Name' },
    { key:'phone', title:'Phone' },
    { key:'email', title:'Email' },
    { key:'actions', title:'Actions', render: r => isManager ? <Link to={`/manager/vendors/edit/${r._id}`} className="text-teal-300">Edit</Link> : "Read Only" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Vendors</h2>
        {isManager && <Link to="/manager/vendors/add" className="bg-teal-400 text-black px-3 py-1 rounded">Add Vendor</Link>}
      </div>

      <Table columns={cols} data={vendors} />
    </div>
  );
}
