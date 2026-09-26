import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function POST(req: Request) {
  try {
    const { jobId, maidId } = await req.json();

    if (!jobId || !maidId) {
      return NextResponse.json({ message: 'Missing jobId or maidId' }, { status: 400 });
    }

    const res = await pool.query(
      "INSERT INTO applications (job_id, maid_id, status) VALUES ($1, $2, 'Pending') RETURNING *",
      [jobId, maidId]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}