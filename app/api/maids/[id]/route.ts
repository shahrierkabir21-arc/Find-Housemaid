import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const res = await pool.query('SELECT id, name, email, phone, description FROM users WHERE id = $1', [params.id]);
  return NextResponse.json(res.rows[0]);
}