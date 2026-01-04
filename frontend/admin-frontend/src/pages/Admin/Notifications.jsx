import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Notifications(){
  const [notifs, setNotifs] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/notifications");
      setNotifs(res.data.notifications ?? res.data ?? []);
    } catch {
      setNotifs([{_id:1,title:"Low Fuel",message:"Truck5 fuel low"}]);
    }
  })(); },[]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifs.map(n=>(
          <div key={n._id} className="bg-[#081826] p-3 rounded border border-slate-700">
            <div className="font-semibold">{n.title}</div>
            <div className="text-slate-400 text-sm">{n.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
