import { NextResponse } from 'next/server';
import pool from '@/utils/db';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
  useTLS: true,
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const res = await pool.query('UPDATE applications SET status = $1 WHERE id = $2 RETURNING *', [status, params.id]);
  const maidId = res.rows[0].maid_id;

  await pusher.trigger(`user-${maidId}`, 'status-update', {
    message: `Your job request status: ${status}`,
  });

  return NextResponse.json(res.rows[0]);
}