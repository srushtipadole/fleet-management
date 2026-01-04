import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Card from "../../components/ui/Card";

export default function Notifications(){
  const [notifs, setNotifs] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try { const res = await API.get("/notifications"); setNotifs(res.data.notifications ?? res.data ?? []); } catch { setNotifs([]); }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifs.length === 0 && <div className="text-slate-400">No notifications</div>}
        {notifs.map(n => (<Card key={n._id}><div className="flex justify-between"><div><div className="font-semibold">{n.title}</div><div className="text-slate-400 text-sm">{n.message}</div></div><div className="text-sm text-slate-400">{new Date(n.createdAt).toLocaleString()}</div></div></Card>))}
      </div>
    </div>
  );
}
