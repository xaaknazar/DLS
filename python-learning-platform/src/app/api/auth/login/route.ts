import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const { email, password } = await request.json();

    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
