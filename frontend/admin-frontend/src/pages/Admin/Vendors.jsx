import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Table from "../../components/ui/Table";

export default function Vendors(){
  const [vendors, setVendors] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/vendors");
      setVendors(res.data.vendors ?? res.data ?? []);
    } catch {
      setVendors([{_id:1,name:"Vendor A",phone:"9999999999"}]);
    }
  })(); },[]);

  const cols = [
    { key:"name", title:"Name" },
    { key:"phone", title:"Phone" },
    { key:"actions", title:"Actions", render: r => <button className="text-teal-300">View</button> }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Vendors</h2>
      <Table columns={cols} data={vendors} />
    </div>
  );
}
