import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query(`
    SELECT a.id, a.status, j.title as "jobTitle"
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
  `);
  return NextResponse.json(res.rows);
}