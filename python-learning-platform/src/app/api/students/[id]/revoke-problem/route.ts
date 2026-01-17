import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, initializeDatabase } from '@/lib/db';
import { Student } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const { problemId, points } = await request.json();

    if (!problemId) {
      return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = user as Student;

    // Check if problem is in completed list
    if (!student.completedProblems.includes(problemId)) {
      return NextResponse.json({ error: 'Problem not in completed list' }, { status: 400 });
    }

    // Remove problem from completed list
    const newCompletedProblems = student.completedProblems.filter(p => p !== problemId);

    // Deduct points
    const pointsToDeduct = points || 0;
    const newPoints = Math.max(0, student.points - pointsToDeduct);

    const updated = await updateUser(id, {
      completedProblems: newCompletedProblems,
      points: newPoints,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }

    const { password, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      student: safeUser,
      deductedPoints: pointsToDeduct,
    });
  } catch (error) {
    console.error('Revoke problem error:', error);
    return NextResponse.json({ error: 'Failed to revoke problem' }, { status: 500 });
  }
}
