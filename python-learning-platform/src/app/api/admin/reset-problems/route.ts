import { NextResponse } from 'next/server';
import { resetAllData } from '@/lib/db';

export async function POST() {
  try {
    await resetAllData();
    return NextResponse.json({ success: true, message: 'Topics and problems reset successfully' });
  } catch (error) {
    console.error('Reset data error:', error);
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  }
}
