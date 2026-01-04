import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-[#071018] flex items-center justify-between px-6 border-b border-slate-700">
      <div className="text-white font-semibold">Fleet Management</div>
      <div className="flex items-center gap-4">
        <div className="text-slate-300">{user?.name || "Admin"}</div>
        <button onClick={logout} className="bg-teal-400 text-black px-3 py-1 rounded-md">Logout</button>
      </div>
    </header>
  );
}
