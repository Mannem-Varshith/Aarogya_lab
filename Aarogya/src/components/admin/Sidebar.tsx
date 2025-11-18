import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/approvals', label: 'Approvals', icon: '✅' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reports', label: 'Reports', icon: '📄' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage users, reports & settings</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 hover:bg-gray-50 text-gray-700 ${
              currentPath === item.path ? 'bg-gray-50 border-r-4 border-emerald-500 font-semibold' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white shadow"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

