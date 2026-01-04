import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import Table from "../../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Payments(){
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [payments, setPayments] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try { const res = await API.get("/payments"); setPayments(res.data.payments ?? res.data ?? []); } catch { setPayments([]); }
    })();
  }, []);

  const cols = [
    { key:'to', title:'To', render: r => r.to?.name ?? r.to },
    { key:'amount', title:'Amount' },
    { key:'status', title:'Status' },
    { key:'reference', title:'Reference' },
    { key:'actions', title:'Actions', render: r => isManager ? <Link to={`/manager/payments/edit/${r._id}`} className="text-teal-300">Edit</Link> : "Read Only" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Payments</h2>
        {isManager && <Link to="/manager/payments/add" className="bg-teal-400 text-black px-3 py-1 rounded">Create Payment</Link>}
      </div>

      <Table columns={cols} data={payments} />
    </div>
  );
}
