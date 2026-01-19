import { NextResponse } from 'next/server';
import { initializeDatabase, recalculateAllStudentPoints } from '@/lib/db';

export async function POST() {
  try {
    await initializeDatabase();

    const result = await recalculateAllStudentPoints();

    return NextResponse.json({
      success: true,
      message: `Баллы пересчитаны у ${result.recalculatedCount} учеников`,
      recalculatedCount: result.recalculatedCount,
      details: result.details,
    });
  } catch (error: any) {
    console.error('Recalculate points error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
