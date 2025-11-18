import React from 'react';

export default function Topbar() {
  const adminUser = localStorage.getItem('adminUser');
  const user = adminUser ? JSON.parse(adminUser) : null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}

