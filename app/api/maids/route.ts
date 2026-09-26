import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query("SELECT id, name, email, phone, description FROM users WHERE role = 'housemaid' AND status = 'Approved'");
  return NextResponse.json(res.rows);
}