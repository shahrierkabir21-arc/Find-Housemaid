'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
    axiosInstance.get(`/jobs/${params.id}`).then((res) => setJob(res.data));
  }, [params.id]);

  const applyJob = async () => {
    if (!user || !user.id) {
      alert('Please login as a housemaid first!');
      return;
    }

    try {
      await axiosInstance.post('/applications', { jobId: params.id, maidId: user.id });
      alert('Request sent to Admin for approval!');
      window.location.href = '/dashboard/housemaid';
    } catch (err: any) {
      alert('Failed to apply: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!job) return <div className="text-xs text-slate-500 text-center py-10">Loading details...</div>;

  return (
    <div className="border p-5 bg-white rounded shadow-sm max-w-sm mx-auto space-y-3 text-xs">
      <h1 className="text-base font-bold">{job.title}</h1>
      <p className="text-slate-500">Location: {job.location}</p>
      <p className="font-bold text-emerald-600">Salary: ৳{job.salary}</p>
      <p className="bg-slate-50 p-2.5 rounded border">{job.description}</p>
      {user?.role === 'housemaid' && (
        <button onClick={applyJob} className="bg-emerald-600 text-white w-full py-2 rounded font-bold">
          Request to Apply
        </button>
      )}
    </div>
  );
}