import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function Blockchain(){
  const [logs, setLogs] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try { const res = await API.get("/blockchain/logs"); setLogs(res.data.logs ?? res.data ?? []); } catch { setLogs([]); }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Blockchain Logs</h2>
      <div className="space-y-3">
        {logs.length === 0 && <div className="text-slate-400">No blockchain logs</div>}
        {logs.map(l => (
          <Card key={l._id}>
            <div className="text-sm text-slate-400">{new Date(l.createdAt).toLocaleString()}</div>
            <div className="font-medium mt-1">{l.eventType}</div>
            <pre className="text-xs mt-2 text-slate-300">{JSON.stringify(l.data, null, 2)}</pre>
          </Card>
        ))}
      </div>
    </div>
  );
}
