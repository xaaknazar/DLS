import { NextResponse } from 'next/server';
import { initializeDatabase, recalculateAllStudentPoints } from '@/lib/db';

export async function POST() {
  try {
    await initializeDatabase();

    console.log('[Recalculate] Starting points recalculation...');
    const result = await recalculateAllStudentPoints();

    // Log details for debugging
    result.details.forEach(d => {
      console.log(`[Recalculate] ${d.name}: points ${d.oldPoints} -> ${d.newPoints}, shopPoints ${d.oldShopPoints} -> ${d.newShopPoints}`);
    });

    console.log(`[Recalculate] Completed: ${result.recalculatedCount} students recalculated`);

    return NextResponse.json({
      success: true,
      message: `Баллы пересчитаны у ${result.recalculatedCount} учеников`,
      recalculatedCount: result.recalculatedCount,
      details: result.details,
    });
  } catch (error: any) {
    console.error('[Recalculate] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
