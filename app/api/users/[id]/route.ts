import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await pool.query('DELETE FROM users WHERE id = $1', [params.id]);
  return NextResponse.json({ message: 'User deleted' });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { description } = await req.json();
  const res = await pool.query(
    "UPDATE users SET description = $1, status = 'Pending' WHERE id = $2 RETURNING *",
    [description, params.id]
  );
  return NextResponse.json(res.rows[0]);
}