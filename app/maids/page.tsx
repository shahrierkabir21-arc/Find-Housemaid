'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';

export default function MaidsPage() {
  const [maids, setMaids] = useState<any[]>([]);

  useEffect(() => {
    // লগইন চেক
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
      return;
    }

    axiosInstance.get('/maids').then((res) => setMaids(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Approved Housemaids</h1>
      <div className="grid grid-cols-2 gap-3">
        {maids.map((maid) => (
          <div key={maid.id} className="border p-3 bg-white rounded shadow-sm text-xs space-y-1">
            <h3 className="font-bold text-sm">{maid.name}</h3>
            <p className="text-slate-500">{maid.description || 'No description'}</p>
            <Link href={`/maids/${maid.id}`} className="text-blue-600 underline block pt-1 font-semibold">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}