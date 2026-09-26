'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    // লগইন চেক
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
      return;
    }

    axiosInstance.get('/jobs').then((res) => setJobs(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Approved Job Postings</h1>
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="border p-3 bg-white rounded shadow-sm flex justify-between items-center text-xs">
            <div>
              <h2 className="font-bold text-sm">{job.title}</h2>
              <p className="text-slate-500">📍 {job.location} | Salary: ৳{job.salary}</p>
            </div>
            <Link href={`/jobs/${job.id}`} className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold">
              Details ➔
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}