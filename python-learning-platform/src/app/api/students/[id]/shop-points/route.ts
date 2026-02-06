import { NextRequest, NextResponse } from 'next/server';
import { updateStudentShopPoints, initializeDatabase } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const { delta } = await request.json();

    console.log(`[API] Updating shopPoints for student ${id}: delta=${delta}`);

    const student = await updateStudentShopPoints(id, delta);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { password, ...safeStudent } = student;
    return NextResponse.json(safeStudent);
  } catch (error) {
    console.error('Update shop points error:', error);
    return NextResponse.json({ error: 'Failed to update shop points' }, { status: 500 });
  }
}
