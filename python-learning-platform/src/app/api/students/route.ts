import { NextRequest, NextResponse } from 'next/server';
import { getStudents, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    let students = await getStudents();

    if (grade) {
      students = students.filter(s => s.grade === parseInt(grade));
    }

    // Remove passwords from response
    const safeStudents = students.map(({ password, ...s }) => s);

    return NextResponse.json(safeStudents);
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Failed to get students' }, { status: 500 });
  }
}
