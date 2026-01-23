import { NextResponse } from 'next/server';
import { resetAllStudentProgress } from '@/lib/db';

export async function POST() {
  try {
    const resetCount = await resetAllStudentProgress();
    return NextResponse.json({
      success: true,
      message: `Progress reset for ${resetCount} students`,
      studentsReset: resetCount
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 });
  }
}
