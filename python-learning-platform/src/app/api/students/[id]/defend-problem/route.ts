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
    const { problemId, action } = await request.json();

    if (!problemId) {
      return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = user as Student;
    const defendedProblems = student.defendedProblems || [];

    let newDefendedProblems: string[];

    if (action === 'undefend') {
      // Remove problem from defended list
      newDefendedProblems = defendedProblems.filter(p => p !== problemId);
    } else {
      // Add problem to defended list (default action)
      if (defendedProblems.includes(problemId)) {
        return NextResponse.json({
          success: true,
          message: 'Problem already defended',
          defendedProblems
        });
      }
      newDefendedProblems = [...defendedProblems, problemId];
    }

    const updated = await updateUser(id, {
      defendedProblems: newDefendedProblems,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }

    const { password, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      student: safeUser,
      defendedProblems: newDefendedProblems,
      action: action || 'defend',
    });
  } catch (error) {
    console.error('Defend problem error:', error);
    return NextResponse.json({ error: 'Failed to update defended problems' }, { status: 500 });
  }
}
