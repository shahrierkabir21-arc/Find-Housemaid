import { NextResponse } from 'next/server';
import pool from '@/utils/db';
import { registerSchema } from '@/utils/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod Backend Validation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validation.data;

    // Check duplicate email
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'Email address already exists!' }, { status: 400 });
    }

    const res = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}