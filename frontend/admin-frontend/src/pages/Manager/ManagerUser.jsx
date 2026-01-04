import React, { useEffect, useState } from "react";
import API from "../../api/axios.js";
import Table from "../../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Users(){
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users ?? res.data ?? []);
    } catch { setUsers([]); }
  };

  useEffect(()=> { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await API.delete(`/users/${id}`);
      load();
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const cols = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    { key: "actions", title: "Actions", render: r => isManager ? <div className="flex gap-2"><Link to={`/manager/users/edit/${r._id}`} className="text-yellow-300">Edit</Link><button onClick={()=>handleDelete(r._id)} className="text-red-400">Delete</button></div> : "Read Only" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        {isManager && <Link to="/manager/users/add" className="bg-teal-400 text-black px-3 py-1 rounded">Add User</Link>}
      </div>

      <Table columns={cols} data={users} />
    </div>
  );
}
