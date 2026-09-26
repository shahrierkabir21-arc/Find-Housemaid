import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query("SELECT * FROM jobs WHERE status = 'Approved' ORDER BY id DESC");
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  const { employerId, title, location, salary, description } = await req.json();
  const res = await pool.query(
    "INSERT INTO jobs (employer_id, title, location, salary, description, status) VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *",
    [employerId, title, location, salary, description]
  );
  return NextResponse.json(res.rows[0], { status: 201 });
}