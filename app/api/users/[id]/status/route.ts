import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const res = await pool.query('UPDATE users SET status = $1 WHERE id = $2 RETURNING *', [status, params.id]);
  return NextResponse.json(res.rows[0]);
}