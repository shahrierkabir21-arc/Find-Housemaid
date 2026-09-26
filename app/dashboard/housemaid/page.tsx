'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import Notification from '@/components/Notification';

export default function HousemaidDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const u = JSON.parse(data);
      setUser(u);
      setDesc(u.description || '');
    }
    axiosInstance.get('/applications/my-applications').then((res) => setApps(res.data));
  }, []);

  const saveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await axiosInstance.put(`/users/${user.id}`, { description: desc });
    alert('Profile description submitted for Admin approval!');
  };

  return (
    <div className="space-y-5 text-xs">
      <h1 className="text-lg font-bold">Housemaid Dashboard</h1>

      {user && <Notification userId={user.id} />}

      <form onSubmit={saveDescription} className="border p-4 bg-white rounded space-y-2.5">
        <h2 className="font-bold text-sm">Post/Update Your Description</h2>
        <textarea
          placeholder="Describe your skills and experience and phone number..."
          required
          value={desc}
          className="w-full border p-2 rounded outline-none h-20"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold">Submit Description</button>
      </form>

      <div className="border p-4 bg-white rounded space-y-2">
        <h2 className="font-bold text-sm">My Job Requests</h2>
        {apps.map((a) => (
          <div key={a.id} className="py-2 border-b flex justify-between">
            <span>{a.jobTitle}</span>
            <span className="font-bold text-amber-600">{a.status || 'Pending'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}