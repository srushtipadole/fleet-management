import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Blockchain(){
  const [logs, setLogs] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/blockchain/logs");
      setLogs(res.data.logs ?? res.data ?? []);
    } catch {
      setLogs([{index:1,eventType:"TripStarted",timestamp:Date.now(),data:{}}]);
    }
  })(); },[]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Blockchain Logs</h2>
      <div className="space-y-3">
        {logs.map((l,idx)=>(
          <div key={idx} className="bg-[#081826] p-3 rounded border border-slate-700">
            <div className="text-sm text-slate-400">{new Date(l.timestamp).toLocaleString()}</div>
            <div className="font-medium">{l.eventType}</div>
            <pre className="text-xs mt-2 text-slate-300">{JSON.stringify(l.data)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
