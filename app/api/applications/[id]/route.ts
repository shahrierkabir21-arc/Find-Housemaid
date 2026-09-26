import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await pool.query('DELETE FROM applications WHERE id = $1', [params.id]);
  return NextResponse.json({ message: 'Request deleted' });
}