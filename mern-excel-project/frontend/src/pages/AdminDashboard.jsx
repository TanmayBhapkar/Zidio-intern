import React from 'react';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.name || 'Admin'} ({user.email})</p>
      <hr style={{margin:'12px 0'}} />
      <p>Here you can manage users, view reports, and access admin-only features.</p>
    </div>
  );
}
