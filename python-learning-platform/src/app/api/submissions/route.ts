import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, getSubmissionsByStudent, getSubmissionsByProblem, createSubmission, markProblemCompleted, initializeDatabase, getProblemById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const problemId = searchParams.get('problemId');

    let submissions;

    if (studentId) {
      submissions = await getSubmissionsByStudent(studentId);
    } else if (problemId) {
      submissions = await getSubmissionsByProblem(problemId);
    } else {
      submissions = await getSubmissions();
    }

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ error: 'Failed to get submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const submission = await request.json();

    const newSubmission = await createSubmission({
      ...submission,
      id: submission.id || `submission-${Date.now()}`,
      submittedAt: new Date(),
    });

    // If submission passed, mark problem as completed
    if (submission.status === 'passed' && submission.studentId && submission.problemId) {
      // Get problem points from database
      const problem = await getProblemById(submission.problemId);
      const points = problem?.points || 0;
      await markProblemCompleted(submission.studentId, submission.problemId, points);
    }

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Create submission error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
