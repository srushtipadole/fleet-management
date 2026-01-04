import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";

export default function Users(){
  const [users, setUsers] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await api.get("/users");
      setUsers(res.data.users ?? res.data ?? []);
    } catch {
      setUsers([{_id:1,name:"Admin",email:"admin@test.com",role:"admin"}]);
    }
  })(); },[]);

  const cols = [
    { key:"name", title:"Name" },
    { key:"email", title:"Email" },
    { key:"role", title:"Role" },
    { key:"actions", title:"Actions", render: r => <Link to={`/users/edit/${r._id}`} className="text-teal-300">Edit</Link> }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        {/* <Link to="/users/add" className="bg-teal-400 text-black px-3 py-1 rounded">Add User</Link> */}
      </div>
      <Table columns={cols} data={users} />
    </div>
  );
}
