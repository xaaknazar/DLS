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
  getExpectedUniqueness,
  getStudentSubmissionsWithAnalysis,
  DetailedSubmissionAnalysis,
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

    // Find similarity matches (now uses problem-specific thresholds)
    const similarityMatches = findSimilarSubmissions(filteredSubmissions, problems, threshold);

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
      // Use metadata from submission if available
      return analyzeSubmission(sub, sub.metadata, problem, problemSubmissions);
    });

    // If action is 'students' - return list of students with their cheat summary
    if (action === 'students') {
      const category = searchParams.get('category'); // 'similarity' | 'behavior' | 'ai' | null (all)

      const studentCheatData = filteredStudents.map(student => {
        const studentSubmissions = analyzedSubmissions.filter(s => s.studentId === student.id);
        const passedSubmissions = studentSubmissions.filter(s => s.status === 'passed');
        const flaggedSubmissions = studentSubmissions.filter(s => (s.cheatFlags?.length || 0) > 0);

        let totalCheatScore = 0;
        let highSeverityCount = 0;

        // Category-specific scores
        let maxSimilarityScore = 0;
        let maxBehaviorScore = 0;
        let maxAiScore = 0;
        let isCheater = false; // similarity >= 95%

        // Get all similarity matches for this student
        const studentSimilarityMatches = similarityMatches.filter(
          m => m.studentId1 === student.id || m.studentId2 === student.id
        );

        if (studentSimilarityMatches.length > 0) {
          maxSimilarityScore = Math.max(...studentSimilarityMatches.map(m => m.similarityScore));
          if (maxSimilarityScore >= 95) {
            isCheater = true;
          }
        }

        for (const sub of flaggedSubmissions) {
          totalCheatScore += sub.cheatScore || 0;
          if (sub.cheatFlags?.some(f => f.severity === 'high' || f.severity === 'critical')) {
            highSeverityCount++;
          }

          // Check for behavior flags (fast_solution, copy_paste)
          const hasBehaviorFlags = sub.cheatFlags?.some(f =>
            f.type === 'fast_solution' || f.type === 'copy_paste'
          );
          if (hasBehaviorFlags) {
            const behaviorScore = sub.cheatFlags
              ?.filter(f => f.type === 'fast_solution' || f.type === 'copy_paste')
              .reduce((sum, f) => sum + (f.confidence || 0), 0) || 0;
            maxBehaviorScore = Math.max(maxBehaviorScore, behaviorScore);
          }

          // Check for AI flags
          const hasAiFlags = sub.cheatFlags?.some(f =>
            f.type === 'ai_patterns' || f.type === 'english_comments' || f.type === 'advanced_code'
          );
          if (hasAiFlags) {
            const aiFlag = sub.cheatFlags?.find(f => f.type === 'ai_patterns');
            if (aiFlag) {
              maxAiScore = Math.max(maxAiScore, aiFlag.confidence || 0);
            }
          }
        }

        return {
          id: student.id,
          name: student.name,
          grade: student.grade,
          solvedProblems: passedSubmissions.length,
          flaggedSubmissions: flaggedSubmissions.length,
          averageCheatScore: flaggedSubmissions.length > 0
            ? Math.round(totalCheatScore / flaggedSubmissions.length)
            : 0,
          maxCheatScore: flaggedSubmissions.length > 0
            ? Math.max(...flaggedSubmissions.map(s => s.cheatScore || 0))
            : 0,
          highSeverityCount,
          // Category-specific data
          maxSimilarityScore,
          maxBehaviorScore,
          maxAiScore,
          isCheater,
          similarityMatchCount: studentSimilarityMatches.length,
        };
      });

      // Filter by category if specified
      let filteredData = studentCheatData;
      if (category === 'similarity') {
        filteredData = studentCheatData.filter(s => s.maxSimilarityScore > 0);
        filteredData.sort((a, b) => b.maxSimilarityScore - a.maxSimilarityScore);
      } else if (category === 'behavior') {
        filteredData = studentCheatData.filter(s => s.maxBehaviorScore > 0);
        filteredData.sort((a, b) => b.maxBehaviorScore - a.maxBehaviorScore);
      } else if (category === 'ai') {
        filteredData = studentCheatData.filter(s => s.maxAiScore > 0);
        filteredData.sort((a, b) => b.maxAiScore - a.maxAiScore);
      } else {
        // Default: sort by max cheat score descending
        filteredData.sort((a, b) => b.maxCheatScore - a.maxCheatScore);
      }

      return NextResponse.json({
        students: filteredData,
        total: filteredData.length,
        category,
      });
    }

    // If action is 'student-details' - return detailed analysis for specific student
    if (action === 'student-details' && studentId) {
      const targetStudent = students.find(s => s.id === studentId);
      if (!targetStudent) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      // Build metadata map from submissions
      const metadataMap = new Map(
        submissions
          .filter(s => s.metadata)
          .map(s => [s.id, s.metadata!])
      );

      // Get detailed analysis for all student's submissions
      const detailedAnalysis = getStudentSubmissionsWithAnalysis(
        studentId,
        submissions,
        problems,
        students,
        metadataMap
      );

      return NextResponse.json({
        student: {
          id: targetStudent.id,
          name: targetStudent.name,
          grade: targetStudent.grade,
        },
        submissions: detailedAnalysis,
        totalSubmissions: detailedAnalysis.length,
      });
    }

    // If specific student requested (legacy)
    if (studentId && !action) {
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

      const enrichedSubmissions = flaggedSubmissions.map(sub => {
        const problem = problemMap.get(sub.problemId);
        return {
          ...sub,
          studentName: studentMap.get(sub.studentId)?.name || 'Unknown',
          studentGrade: studentMap.get(sub.studentId)?.grade || 0,
          problemTitle: problem?.titleRu || sub.problemId,
          problemDifficulty: problem?.difficulty || 'medium',
          // Add uniqueness info for UI context
          problemUniqueness: problem ? getExpectedUniqueness(problem) : 'medium',
        };
      });

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
        // Use metadata from submission if available
        return analyzeSubmission(sub, sub.metadata, problem, problemSubmissions);
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
