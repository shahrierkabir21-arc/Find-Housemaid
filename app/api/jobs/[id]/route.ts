import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const res = await pool.query('SELECT * FROM jobs WHERE id = $1', [params.id]);
  return NextResponse.json(res.rows[0]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await pool.query('DELETE FROM jobs WHERE id = $1', [params.id]);
  return NextResponse.json({ message: 'Job deleted' });
}