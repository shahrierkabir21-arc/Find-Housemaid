'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function EmployerDashboard() {
  const [form, setForm] = useState({ title: '', location: '', salary: '', description: '' });
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance.get('/applications/employer').then((res) => setApps(res.data));
  }, []);

  const postJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await axiosInstance.post('/jobs', { ...form, employerId: user.id });
    alert('Job submitted! Pending Admin approval.');
    setForm({ title: '', location: '', salary: '', description: '' });
  };

  return (
    <div className="space-y-5 text-xs">
      <h1 className="text-lg font-bold">Employer Dashboard</h1>

      <form onSubmit={postJob} className="border p-4 bg-white rounded space-y-2.5">
        <h2 className="font-bold text-sm">Post a New Job</h2>
        <input
          type="text"
          placeholder="Job Title"
          required
          value={form.title}
          className="w-full border p-2 rounded outline-none"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          required
          value={form.location}
          className="w-full border p-2 rounded outline-none"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Salary"
          required
          value={form.salary}
          className="w-full border p-2 rounded outline-none"
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          value={form.description}
          className="w-full border p-2 rounded outline-none h-16"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold">Submit Job</button>
      </form>

      <div className="border p-4 bg-white rounded space-y-2">
        <h2 className="font-bold text-sm">Approved Housemaid Applications</h2>
        {apps.filter(a => a.status === 'Approved').map((a) => (
          <div key={a.id} className="py-2 border-b flex justify-between">
            <div>
              <p className="font-bold">{a.maidName}</p>
              <p className="text-slate-500">Job: {a.jobTitle}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Approved</span>
          </div>
        ))}
      </div>
    </div>
  );
}