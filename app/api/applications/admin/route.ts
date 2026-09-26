import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query(`
    SELECT a.id, a.status, j.title as "jobTitle", u.name as "maidName"
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.maid_id = u.id
    ORDER BY a.id DESC
  `);
  return NextResponse.json(res.rows);
}