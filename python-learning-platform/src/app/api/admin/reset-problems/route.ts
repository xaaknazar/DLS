import { NextResponse } from 'next/server';
import { resetProblems } from '@/lib/db';

export async function POST() {
  try {
    await resetProblems();
    return NextResponse.json({ success: true, message: 'Problems reset successfully' });
  } catch (error) {
    console.error('Reset problems error:', error);
    return NextResponse.json({ error: 'Failed to reset problems' }, { status: 500 });
  }
}
