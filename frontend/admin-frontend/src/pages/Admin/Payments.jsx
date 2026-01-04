import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Table from "../../components/ui/Table";

export default function Payments(){
  const [payments, setPayments] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/payments");
      setPayments(res.data.payments ?? res.data ?? []);
    } catch {
      setPayments([{_id:1,amount:1000,to:"Vendor A",status:"pending"}]);
    }
  })(); },[]);

  const cols = [
    { key:"to", title:"To", render: r => r.to?.name || "Unknown Vendor" },
    { key:"amount", title:"Amount" },
    { key:"status", title:"Status" },
    { key:"reference", title:"Reference" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>
      <Table columns={cols} data={payments} />
    </div>
  );
}
