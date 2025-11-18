import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/admin/Sidebar";
import Topbar from "./components/admin/Topbar";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Approvals from "./pages/admin/Approvals";
import AdminLoginPage from "./components/auth/AdminLoginPage";

// Protected Admin Route
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  if (!token || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  try {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedAdminRoute>
            <div className="flex min-h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/approvals" element={<Approvals />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

