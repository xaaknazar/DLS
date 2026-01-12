import { NextRequest, NextResponse } from 'next/server';
import { updateStudentPoints, initializeDatabase } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const { delta } = await request.json();

    const student = await updateStudentPoints(id, delta);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { password, ...safeStudent } = student;
    return NextResponse.json(safeStudent);
  } catch (error) {
    console.error('Update points error:', error);
    return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
  }
}
