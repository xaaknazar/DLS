import { NextRequest, NextResponse } from 'next/server';
import {
  getSubmissions,
  getStudents,
  getProblems,
  initializeDatabase,
  getUserById,
} from '@/lib/db';
import {
  findSimilarSubmissions,
  analyzeSubmission,
  generateStudentReport,
  generateCheatSummary,
} from '@/lib/cheat-detection';
import { Student, Submission, SubmissionWithCheatData } from '@/types';

// GET /api/cheat-detection - Get cheat detection summary or student report
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const action = searchParams.get('action');
    const gradeFilter = searchParams.get('grade');
    const threshold = parseInt(searchParams.get('threshold') || '70', 10);

    // Get all required data
    const [submissions, students, problems] = await Promise.all([
      getSubmissions(),
      getStudents(),
      getProblems(),
    ]);

    // Filter by grade if specified
    let filteredStudents = students;
    if (gradeFilter) {
      const grade = parseInt(gradeFilter, 10);
      filteredStudents = students.filter(s => s.grade === grade);
    }
    const studentIds = new Set(filteredStudents.map(s => s.id));
    const filteredSubmissions = gradeFilter
      ? submissions.filter(s => studentIds.has(s.studentId))
      : submissions;

    // Find similarity matches
    const similarityMatches = findSimilarSubmissions(filteredSubmissions, threshold);

    // Analyze all submissions
    const problemMap = new Map(problems.map(p => [p.id, p]));
    const submissionsByProblem = new Map<string, Submission[]>();

    for (const sub of filteredSubmissions) {
      const list = submissionsByProblem.get(sub.problemId) || [];
      list.push(sub);
      submissionsByProblem.set(sub.problemId, list);
    }

    const analyzedSubmissions: SubmissionWithCheatData[] = filteredSubmissions.map(sub => {
      const problem = problemMap.get(sub.problemId);
      if (!problem) return { ...sub, cheatFlags: [], cheatScore: 0 };

      const problemSubmissions = submissionsByProblem.get(sub.problemId) || [];
      return analyzeSubmission(sub, undefined, problem, problemSubmissions);
    });

    // If specific student requested
    if (studentId) {
      const student = await getUserById(studentId);
      if (!student || student.role !== 'teacher' && student.role !== 'student') {
        // Check if it's a valid student
        const targetStudent = students.find(s => s.id === studentId);
        if (!targetStudent) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        const report = generateStudentReport(
          targetStudent,
          analyzedSubmissions,
          problems,
          similarityMatches
        );
        return NextResponse.json(report);
      }
    }

    // If action is similarity-only
    if (action === 'similarity') {
      return NextResponse.json({
        matches: similarityMatches,
        total: similarityMatches.length,
        threshold,
      });
    }

    // If action is flagged-submissions
    if (action === 'flagged') {
      const flaggedSubmissions = analyzedSubmissions
        .filter(s => (s.cheatFlags?.length || 0) > 0)
        .sort((a, b) => (b.cheatScore || 0) - (a.cheatScore || 0));

      // Enrich with student and problem info
      const studentMap = new Map(students.map(s => [s.id, s]));

      const enrichedSubmissions = flaggedSubmissions.map(sub => ({
        ...sub,
        studentName: studentMap.get(sub.studentId)?.name || 'Unknown',
        studentGrade: studentMap.get(sub.studentId)?.grade || 0,
        problemTitle: problemMap.get(sub.problemId)?.titleRu || sub.problemId,
        problemDifficulty: problemMap.get(sub.problemId)?.difficulty || 'medium',
      }));

      return NextResponse.json({
        submissions: enrichedSubmissions,
        total: enrichedSubmissions.length,
      });
    }

    // Default: return full summary
    const summary = generateCheatSummary(
      analyzedSubmissions,
      filteredStudents,
      similarityMatches
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Cheat detection error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze submissions' },
      { status: 500 }
    );
  }
}

// POST /api/cheat-detection - Analyze specific submissions or mark as reviewed
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { action, submissionIds, studentId, reviewNotes } = body;

    if (action === 'analyze') {
      // Analyze specific submissions
      const [submissions, problems] = await Promise.all([
        getSubmissions(),
        getProblems(),
      ]);

      const targetSubmissions = submissionIds
        ? submissions.filter((s: Submission) => submissionIds.includes(s.id))
        : studentId
        ? submissions.filter((s: Submission) => s.studentId === studentId)
        : [];

      const problemMap = new Map(problems.map(p => [p.id, p]));
      const submissionsByProblem = new Map<string, Submission[]>();

      for (const sub of submissions) {
        const list = submissionsByProblem.get(sub.problemId) || [];
        list.push(sub);
        submissionsByProblem.set(sub.problemId, list);
      }

      const analyzedSubmissions = targetSubmissions.map((sub: Submission) => {
        const problem = problemMap.get(sub.problemId);
        if (!problem) return { ...sub, cheatFlags: [], cheatScore: 0 };

        const problemSubmissions = submissionsByProblem.get(sub.problemId) || [];
        return analyzeSubmission(sub, undefined, problem, problemSubmissions);
      });

      return NextResponse.json({
        submissions: analyzedSubmissions,
        total: analyzedSubmissions.length,
      });
    }

    if (action === 'compare') {
      // Compare two specific submissions
      const { submissionId1, submissionId2 } = body;
      const submissions = await getSubmissions();

      const sub1 = submissions.find((s: Submission) => s.id === submissionId1);
      const sub2 = submissions.find((s: Submission) => s.id === submissionId2);

      if (!sub1 || !sub2) {
        return NextResponse.json({ error: 'Submissions not found' }, { status: 404 });
      }

      const { compareSubmissions } = await import('@/lib/cheat-detection');
      const comparison = compareSubmissions(sub1.code, sub2.code);

      return NextResponse.json({
        submission1: { id: sub1.id, studentId: sub1.studentId, code: sub1.code },
        submission2: { id: sub2.id, studentId: sub2.studentId, code: sub2.code },
        ...comparison,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Cheat detection POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
