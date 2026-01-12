'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Student, TestResult, Submission } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CodeEditor from '@/components/code-editor/CodeEditor';
import TestResults from '@/components/code-editor/TestResults';
import { getProblemById, getProblemsByTopic, getTopicById } from '@/lib/store';
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import { executePythonCode, usePyodide } from '@/lib/pyodide';
import toast from 'react-hot-toast';
import {
  Star,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  PartyPopper,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;
  const { user, addSubmission, updateStudentProgress } = useStore();
  const student = user as Student;
  const { isLoading: pyodideLoading, isReady: pyodideReady } = usePyodide();

  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  if (!student) return null;

  const problem = getProblemById(problemId);
  if (!problem) return <div>Задача не найдена</div>;

  const topic = getTopicById(problem.topicId);
  const isCompleted = student.completedProblems.includes(problem.id);

  // Get next problem
  const topicProblems = getProblemsByTopic(problem.topicId);
  const currentIndex = topicProblems.findIndex(p => p.id === problem.id);
  const nextProblem = topicProblems[currentIndex + 1];

  const goToNextProblem = () => {
    setShowSuccess(false);
    if (nextProblem) {
      router.push(`/student/problems/${nextProblem.id}`);
    } else {
      router.push(`/student/topics/${problem.topicId}`);
    }
  };

  const runCode = useCallback(async (code: string) => {
    if (!pyodideReady) {
      toast.error('Python загружается, подождите...');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setShowSuccess(false);

    const results: TestResult[] = [];

    // Run code against all test cases
    for (const testCase of problem.testCases) {
      if (testCase.isHidden && !isCompleted) continue;

      const startTime = Date.now();
      const result = await executePythonCode(code, testCase.input);
      const executionTime = Date.now() - startTime;

      const actualOutput = result.output.trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = !result.error && actualOutput === expectedOutput;

      results.push({
        testCaseId: testCase.id,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.error ? `Ошибка: ${result.error}` : result.output,
        executionTime,
        error: result.error || undefined,
      });
    }

    setTestResults(results);

    const allPassed = results.every((r) => r.passed);
    const passedCount = results.filter((r) => r.passed).length;

    // Create submission
    const submission: Submission = {
      id: `sub-${Date.now()}`,
      problemId: problem.id,
      studentId: student.id,
      code,
      status: allPassed ? 'passed' : 'failed',
      testResults: results,
      passedTests: passedCount,
      totalTests: results.length,
      executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      submittedAt: new Date(),
    };

    addSubmission(submission);

    if (allPassed && !isCompleted) {
      updateStudentProgress(student.id, problem.id, problem.points);
      setEarnedPoints(problem.points);
      setShowSuccess(true);
    } else if (allPassed) {
      toast.success('Все тесты пройдены!');
    } else {
      toast.error(`Пройдено ${passedCount}/${results.length} тестов`);
    }

    setIsRunning(false);
  }, [problem, student, isCompleted, pyodideReady, addSubmission, updateStudentProgress]);

  return (
    <div className="min-h-screen">
      <Header
        title={problem.titleRu}
        subtitle={topic?.titleRu}
      />

      {/* Pyodide Loading Indicator */}
      {pyodideLoading && (
        <div className="fixed top-20 right-8 z-40 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-blue-400 text-sm">Загрузка Python...</span>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Отлично!</h2>
            <p className="text-gray-400 mb-4">Вы успешно решили задачу</p>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-2xl font-bold">+{earnedPoints}</span>
                <span className="text-lg">баллов</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSuccess(false)}
              >
                Остаться
              </Button>
              <Button
                className="flex-1"
                onClick={goToNextProblem}
              >
                {nextProblem ? (
                  <>
                    Следующая
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'К теме'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Back button */}
        <div className="flex items-center justify-between mb-4">
          <Link href={`/student/topics/${problem.topicId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              К теме
            </Button>
          </Link>

          {nextProblem && (
            <Link href={`/student/problems/${nextProblem.id}`}>
              <Button variant="ghost" size="sm">
                Следующая задача
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Problem description */}
          <div className="space-y-6">
            <Card className="p-6">
              {/* Problem header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge
                    className={getDifficultyColor(problem.difficulty)}
                  >
                    {getDifficultyLabel(problem.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">{problem.points} баллов</span>
                  </div>
                </div>
                {isCompleted && (
                  <Badge variant="success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Решено
                  </Badge>
                )}
              </div>

              {/* Description */}
              <h2 className="text-lg font-semibold text-white mb-2">Описание</h2>
              <p className="text-gray-300 mb-6">{problem.descriptionRu}</p>

              {/* Test cases preview */}
              <h3 className="text-lg font-semibold text-white mb-3">Примеры</h3>
              <div className="space-y-3">
                {problem.testCases
                  .filter((tc) => !tc.isHidden)
                  .slice(0, 2)
                  .map((tc) => (
                    <div
                      key={tc.id}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Ввод:</p>
                          <code className="text-green-400 font-mono text-sm whitespace-pre">
                            {tc.input || '(пусто)'}
                          </code>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Вывод:</p>
                          <code className="text-blue-400 font-mono text-sm whitespace-pre">
                            {tc.expectedOutput}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Hints */}
            <Card className="p-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">
                    Подсказки ({problem.hints.length})
                  </span>
                </div>
                {showHints ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showHints && (
                <div className="mt-4 space-y-3">
                  {problem.hints.map((hint, i) => (
                    <div key={i}>
                      {i < hintsRevealed ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-gray-300">
                          {hint}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHintsRevealed(i + 1)}
                          className="w-full"
                        >
                          Показать подсказку {i + 1}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Test Results */}
            <TestResults results={testResults} isRunning={isRunning} />
          </div>

          {/* Right side - Code editor */}
          <div className="h-[calc(100vh-200px)] sticky top-24">
            <CodeEditor
              initialCode={problem.starterCode}
              onRun={runCode}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
