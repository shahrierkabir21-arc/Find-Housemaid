'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    axiosInstance.get('/users').then((res) => setUsers(res.data));
    axiosInstance.get('/jobs/admin').then((res) => setJobs(res.data));
    axiosInstance.get('/applications/admin').then((res) => setApps(res.data));
  };

  const handleJobStatus = async (id: number, status: string) => {
    await axiosInstance.patch(`/jobs/${id}/status`, { status });
    loadData();
  };

  const handleMaidStatus = async (id: number, status: string) => {
    await axiosInstance.patch(`/users/${id}/status`, { status });
    loadData();
  };

  const handleAppStatus = async (id: number, status: string) => {
    await axiosInstance.patch(`/applications/${id}/status`, { status });
    loadData();
  };

  const deleteApp = async (id: number) => {
    if (!confirm('Delete request?')) return;
    await axiosInstance.delete(`/applications/${id}`);
    loadData();
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete user completely?')) return;
    await axiosInstance.delete(`/users/${id}`);
    loadData();
  };

  return (
    <div className="space-y-5 text-xs">
      <h1 className="text-xl font-bold text-red-600">Admin Control Panel</h1>

      {/* 1. Jobs Approval */}
      <div className="border p-3 bg-white rounded space-y-2">
        <h2 className="font-bold text-slate-800">1. Pending Job Posts (Employer)</h2>
        {jobs.filter(j => j.status === 'Pending').map((j) => (
          <div key={j.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{j.title}</p>
              <p className="text-slate-500">📍 {j.location} | ৳{j.salary}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleJobStatus(j.id, 'Approved')} className="bg-emerald-600 text-white px-2 py-1 rounded">Accept</button>
              <button onClick={() => handleJobStatus(j.id, 'Rejected')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Maid Description Approval */}
      <div className="border p-3 bg-white rounded space-y-2">
        <h2 className="font-bold text-slate-800">2. Pending Housemaid Descriptions</h2>
        {users.filter(u => u.role === 'housemaid' && u.status === 'Pending').map((m) => (
          <div key={m.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{m.name}</p>
              <p className="text-slate-500 bg-slate-50 p-1 rounded mt-0.5">{m.description || 'No description'}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleMaidStatus(m.id, 'Approved')} className="bg-emerald-600 text-white px-2 py-1 rounded">Accept</button>
              <button onClick={() => handleMaidStatus(m.id, 'Rejected')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Job Requests */}
      <div className="border p-3 bg-white rounded space-y-2">
        <h2 className="font-bold text-slate-800">3. Housemaid Job Requests</h2>
        {apps.map((a) => (
          <div key={a.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{a.maidName} ➔ {a.jobTitle}</p>
              <p className="text-slate-400">Status: {a.status}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleAppStatus(a.id, 'Approved')} className="bg-emerald-600 text-white px-2 py-1 rounded">Accept</button>
              <button onClick={() => deleteApp(a.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Users List */}
      <div className="border p-3 bg-white rounded space-y-2">
        <h2 className="font-bold text-slate-800">4. Manage All Users</h2>
        {users.map((u) => (
          <div key={u.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{u.name} ({u.role})</p>
              <p className="text-slate-500">{u.email}</p>
            </div>
            <button onClick={() => deleteUser(u.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete User</button>
          </div>
        ))}
      </div>
    </div>
  );
}