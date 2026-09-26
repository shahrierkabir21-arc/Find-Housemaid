import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
  return NextResponse.json(res.rows);
}