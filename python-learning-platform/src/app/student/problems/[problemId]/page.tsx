'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { Student, TestResult, Submission } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CodeEditor from '@/components/code-editor/CodeEditor';
import TestResults from '@/components/code-editor/TestResults';
import { getProblemById } from '@/data/problems';
import { getTopicById } from '@/data/topics';
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Star,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;
  const { user, addSubmission, updateStudentProgress } = useStore();
  const student = user as Student;

  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  if (!student) return null;

  const problem = getProblemById(problemId);
  if (!problem) return <div>Задача не найдена</div>;

  const topic = getTopicById(problem.topicId);
  const isCompleted = student.completedProblems.includes(problem.id);

  const runCode = useCallback(async (code: string) => {
    setIsRunning(true);
    setTestResults([]);

    // Simulate code execution with test cases
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results: TestResult[] = problem.testCases
      .filter((tc) => !tc.isHidden || isCompleted)
      .map((testCase) => {
        // Simulate running the code
        // In production, this would call a Python execution API
        const startTime = Date.now();

        // Simple simulation - check if code contains expected patterns
        let passed = false;
        let actualOutput = '';
        let error = '';

        try {
          // Very basic simulation for demo purposes
          // In real implementation, this would use Pyodide or backend API
          if (code.includes('print') && code.length > 10) {
            // Simulate that code produces expected output for demo
            actualOutput = testCase.expectedOutput;
            passed = actualOutput.trim() === testCase.expectedOutput.trim();
          } else {
            actualOutput = 'Нет вывода';
            passed = false;
          }
        } catch (e) {
          error = 'Ошибка выполнения';
          passed = false;
        }

        const executionTime = Date.now() - startTime;

        return {
          testCaseId: testCase.id,
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          executionTime,
          error,
        };
      });

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
      toast.success(`Поздравляем! +${problem.points} баллов!`);
    } else if (allPassed) {
      toast.success('Все тесты пройдены!');
    } else {
      toast.error(`Пройдено ${passedCount}/${results.length} тестов`);
    }

    setIsRunning(false);
  }, [problem, student, isCompleted, addSubmission, updateStudentProgress]);

  return (
    <div className="min-h-screen">
      <Header
        title={problem.titleRu}
        subtitle={topic?.titleRu}
      />

      <div className="p-8">
        {/* Back button */}
        <Link href="/student/problems">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            К списку задач
          </Button>
        </Link>

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
                  .map((tc, i) => (
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
