import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Layouts
import Layout from "./components/layout/Layout";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Users from "./pages/Admin/Users.jsx";
import Vehicle from "./pages/Admin/Vehicle.jsx";
import Maintenance from "./pages/Admin/Maintenance.jsx";
import Vendors from "./pages/Admin/Vendors.jsx";
import Payments from "./pages/Admin/Payments.jsx";
import Trips from "./pages/Admin/Trips.jsx";
import Analytics from "./pages/Admin/Analytics.jsx";
import Blockchain from "./pages/Admin/Blockchain.jsx";
import Notifications from "./pages/Admin/Notifications.jsx";

// Manager Pages
import ManagerDashboard from "./pages/Manager/ManagerDashboard.jsx";
import ManagerVehicle from "./pages/Manager/ManagerVehicle.jsx";
import ManagerUser from "./pages/Manager/ManagerUser.jsx";
import ManagerTrips from "./pages/Manager/ManagerTrips.jsx";
import ManagerMaintenance from "./pages/Manager/ManagerMaintenance.jsx";
import ManagerVendors from "./pages/Manager/ManagerVendors.jsx";
import ManagerPayments from "./pages/Manager/ManagerPayments.jsx";
import ManagerNotifications from "./pages/Manager/ManagerNotifications.jsx";
import VehicleForm from "./pages/Manager/ManagerVehicleForm.jsx";
import ManagerUserForm from "./pages/Manager/ManagerUserForm.jsx";
import ManagerMaintenanceForm from "./pages/Manager/ManagerMaintenanceForm.jsx";
import ManagerVendorForm from "./pages/Manager/ManagerVendorForm.jsx";
import ManagerPaymentForm from "./pages/Manager/ManagerPaymentForm.jsx";
import ManagerAnalytics from "./pages/Manager/ManagerAnalytics.jsx";
import ManagerBlockchain from "./pages/Manager/ManagerBlockchain.jsx";
// Vendor Pages
import VendorDashboard from "./pages/Vendor/VendorDashboard.jsx";
import VendorMaintenance from "./pages/Vendor/VendorMaintenance.jsx";
import VendorMaintenanceForm from "./pages/Vendor/VendorMaintenanceForm.jsx";
import VendorNotifications from "./pages/Vendor/VendorNotifications.jsx";
import VendorPayments from "./pages/Vendor/VendorPayments.jsx";
import VendorProfile from "./pages/Vendor/VendorProfile.jsx";

// Driver Pages
import DriverDashboard from "./pages/Driver/DriverDashboard.jsx";
import DriverVehicle from "./pages/Driver/DriverVehicle.jsx";
import DriverTrips from "./pages/Driver/DriverTrips.jsx";
import DriverMaintenance from "./pages/Driver/DriverMaintenance.jsx";
import DriverNotification from "./pages/Driver/DriverNotification.jsx";
import DriverProfile from "./pages/Driver/DriverProfile.jsx";
import DriverNotifications from "./pages/Driver/DriverNotification.jsx";

function Protected({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <Protected roles={["admin"]}>
                <Layout />
              </Protected>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="vehicles" element={<Vehicle />} />
            <Route path="trips" element={<Trips />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="payments" element={<Payments />} />

            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="blockchain" element={<Blockchain />} />
          </Route>

          {/* MANAGER */}
          <Route
            path="/manager"
            element={
              <Protected roles={["manager"]}>
                <Layout />
              </Protected>
            }
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="vehicles" element={<ManagerVehicle />} />
            <Route path="vehicles/add" element={<VehicleForm />} />
            <Route path="vehicles/edit/:id" element={<VehicleForm />} />

            <Route path="users" element={<ManagerUser />} />
            <Route path="users/add" element={<ManagerUserForm />} />
            <Route path="users/edit/:id" element={<ManagerUserForm />} />
            <Route path="trips" element={<ManagerTrips />} />

            <Route path="maintenance" element={<ManagerMaintenance />} />
            <Route
              path="maintenance/add"
              element={<ManagerMaintenanceForm />}
            />
            <Route
              path="maintenance/edit/:id"
              element={<ManagerMaintenanceForm />}
            />
            <Route path="vendors" element={<ManagerVendors />} />
            <Route path="vendors/add" element={<ManagerVendorForm />} />
            <Route path="vendors/edit/:id" element={<ManagerVendorForm />} />
            <Route path="payments" element={<ManagerPayments />} />
            <Route path="payments/add" element={<ManagerPaymentForm />} />
            <Route path="payments/edit/:id" element={<ManagerPaymentForm />} />

            <Route path="notifications" element={<ManagerNotifications />} />
            <Route path="analytics" element={<ManagerAnalytics />} />
            <Route path="blockchain" element={<ManagerBlockchain />} />
          </Route>

          {/* VENDOR */}
          <Route
            path="/vendor"
            element={
              <Protected roles={["vendor"]}>
                <Layout />
              </Protected>
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="maintenance" element={<VendorMaintenance />} />
            <Route path="maintenance/:id" element={<VendorMaintenanceForm />} />
            <Route path="payments" element={<VendorPayments />} />
            <Route path="notifications" element={<VendorNotifications />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>

          {/* DRIVER */}
          <Route
            path="/driver"
            element={
              <Protected roles={["driver"]}>
                <Layout />
              </Protected>
            }
          >
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="vehicle" element={<DriverVehicle />} />
            <Route path="maintenance" element={<DriverMaintenance />} />
            <Route path="trips" element={<DriverTrips />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
