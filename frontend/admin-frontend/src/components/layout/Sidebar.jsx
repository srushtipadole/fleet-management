import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiTruck, FiMapPin, FiTool, FiBarChart2, FiBell, FiDollarSign, FiClipboard, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  // ------------------------------
  // ADMIN MENU
  // ------------------------------
  const adminMenu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/admin/users", label: "Users", icon: <FiUsers /> },
    { to: "/admin/vehicles", label: "Vehicles", icon: <FiTruck /> },
    { to: "/admin/trips", label: "Trips", icon: <FiMapPin /> },
    { to: "/admin/maintenance", label: "Maintenance", icon: <FiTool /> },
    { to: "/admin/vendors", label: "Vendors", icon: <FiClipboard /> },
    { to: "/admin/payments", label: "Payments", icon: <FiDollarSign /> },
    { to: "/admin/analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { to: "/admin/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/admin/blockchain", label: "Blockchain", icon: <FiClipboard /> },
  ];

  // ------------------------------
  // MANAGER MENU
  // ------------------------------
  const managerMenu = [
    { to: "/Manager/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/manager/vehicles", label: "Vehicles", icon: <FiTruck /> },
    { to: "/manager/users", label: "Users", icon: <FiUsers /> },
    { to: "/manager/trips", label: "Trips", icon: <FiMapPin /> },
    { to: "/manager/maintenance", label: "Maintenance", icon: <FiTool /> },
    { to: "/manager/vendors", label: "Vendors", icon: <FiClipboard /> },
    { to: "/manager/payments", label: "Payments", icon: <FiDollarSign /> },
    { to: "/manager/analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { to: "/manager/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/manager/blockchain", label: "Blockchain", icon: <FiClipboard /> },
  ];

  // ------------------------------
  // DRIVER MENU
  // ------------------------------
  const driverMenu = [
    { to: "/driver/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/driver/vehicle", label: "My Vehicle", icon: <FiTruck /> },
    { to: "/driver/maintenance", label: "My Maintenance", icon: <FiTool /> },
    { to: "/driver/trips", label: "My Trips", icon: <FiMapPin /> },
    { to: "/driver/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/driver/profile", label: "Profile", icon: <FiUser /> },
  ];

  // ------------------------------
  // VENDOR MENU
  // ------------------------------
  const vendorMenu = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/vendor/maintenance", label: "Assigned Jobs", icon: <FiTool /> },
    { to: "/vendor/payments", label: "Payments", icon: <FiDollarSign /> },
    { to: "/vendor/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/vendor/profile", label: "Profile", icon: <FiUser /> },
  ];

  // Decide menu by role
  const menu =
    role === "admin" ? adminMenu :
    role === "manager" ? managerMenu :
    role === "driver" ? driverMenu :
    role === "vendor" ? vendorMenu : [];

  return (
    <aside className="w-72 min-h-screen bg-[#051421] text-slate-200 p-5 flex flex-col">
      <div className="text-2xl font-bold mb-6">FleetHQ ({role})</div>

      <nav className="flex flex-col gap-2">
        {menu.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded ${
                isActive ? "bg-slate-700" : "hover:bg-slate-800"
              }`
            }
          >
            <div className="text-teal-300">{i.icon}</div>
            <div>{i.label}</div>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-sm text-slate-400">
        © {new Date().getFullYear()} FleetHQ
      </div>
    </aside>
  );
}
