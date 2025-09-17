import React from 'react';

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p>Welcome, {user.name || 'User'} ({user.email})</p>
      <hr style={{margin:'12px 0'}} />
      <p>View your uploads, charts, and history here.</p>
    </div>
  );
}
