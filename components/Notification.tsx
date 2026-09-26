'use client';
import { useEffect, useState } from 'react';
import { getPusherClient } from '@/utils/pusher';

export default function Notification({ userId }: { userId: number }) {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!userId) return;
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind('status-update', (data: any) => setMsg(data.message));

    return () => { pusher.unsubscribe(`user-${userId}`); };
  }, [userId]);

  if (!msg) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-800 p-3 rounded my-3 flex justify-between text-xs">
      <span>🔔 {msg}</span>
      <button onClick={() => setMsg('')} className="font-bold">✕</button>
    </div>
  );
}