'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';

export default function MaidProfilePage({ params }: { params: { id: string } }) {
  const [maid, setMaid] = useState<any>(null);

  useEffect(() => {
    // সরাসরি params.id ব্যবহার করা হচ্ছে
    axiosInstance.get(`/maids/${params.id}`).then((res) => setMaid(res.data));
  }, [params.id]);

  if (!maid) return <div className="text-xs text-slate-500 text-center py-10">Loading profile...</div>;

  return (
    <div className="border p-5 bg-white rounded shadow-sm max-w-xs mx-auto text-xs space-y-2">
      <h1 className="text-base font-bold">{maid.name}</h1>
      <p className="text-slate-500">{maid.email}</p>
      <div className="bg-slate-50 p-2.5 rounded border space-y-1">
        <p><strong>Description:</strong> {maid.description || 'N/A'}</p>
        
      </div>
    </div>
  );
}