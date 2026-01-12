import { NextRequest, NextResponse } from 'next/server';
import { getProblems, getProblemsByGrade, getProblemsByTopic, createProblem, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const topicId = searchParams.get('topicId');

    let problems;

    if (topicId) {
      problems = await getProblemsByTopic(topicId);
    } else if (grade) {
      problems = await getProblemsByGrade(parseInt(grade));
    } else {
      problems = await getProblems();
    }

    return NextResponse.json(problems);
  } catch (error) {
    console.error('Get problems error:', error);
    return NextResponse.json({ error: 'Failed to get problems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const problem = await request.json();

    const newProblem = await createProblem({
      ...problem,
      id: problem.id || `problem-${Date.now()}`,
    });

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error('Create problem error:', error);
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
