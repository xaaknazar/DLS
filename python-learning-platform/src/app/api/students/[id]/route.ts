import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, initializeDatabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({ error: 'Failed to get student' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const updates = await request.json();

    const user = await updateUser(id, updates);

    if (!user) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
