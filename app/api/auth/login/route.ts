import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const res = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (res.rows.length === 0) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }
  return NextResponse.json({ user: res.rows[0] });
}