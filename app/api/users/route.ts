import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query("SELECT id, name, email, role, status, description FROM users WHERE role != 'admin' ORDER BY id DESC");
  return NextResponse.json(res.rows);
}