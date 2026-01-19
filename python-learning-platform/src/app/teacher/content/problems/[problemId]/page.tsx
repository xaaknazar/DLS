'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { TestCase, Difficulty, Problem, Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Save, Plus, Trash2, Loader2, Users, RotateCcw, CheckCircle, Eye, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditProblemPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = decodeURIComponent(params.problemId as string);
  const isNew = problemId === 'new';

  const { topics, problems, updateProblem, createProblem, loadProblems, loadTopics, students, loadStudents, loadSubmissions, submissions } = useStore();
  const [existingProblem, setExistingProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isRevoking, setIsRevoking] = useState(false);
  const [viewingCode, setViewingCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    topicId: topics[0]?.id || '',
    title: '',
    titleRu: '',
    description: '',
    descriptionRu: '',
    difficulty: 'easy' as Difficulty,
    points: 10,
    grades: [7, 8, 9, 10] as number[],
    starterCode: '# Напишите ваш код здесь\n',
    solution: '',
    hints: [''] as string[],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '', isHidden: false },
    ] as TestCase[],
  });

  // Load problem from API
  useEffect(() => {
    const fetchProblem = async () => {
      if (isNew) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Load topics if needed
      if (topics.length === 0) {
        await loadTopics();
      }

      // Try to find in store first
      let found = problems.find((p) => p.id === problemId);

      // If not found, try loading problems
      if (!found && problems.length === 0) {
        await loadProblems();
        found = problems.find((p) => p.id === problemId);
      }

      // Still not found? Try API directly
      if (!found) {
        try {
          const response = await fetch(`/api/problems/${encodeURIComponent(problemId)}`);
          if (response.ok) {
            found = await response.json();
          }
        } catch (e) {
          console.error('Failed to fetch problem:', e);
        }
      }

      if (found) {
        setExistingProblem(found);
      }

      setIsLoading(false);
    };

    fetchProblem();
  }, [isNew, problemId, problems, topics.length, loadProblems, loadTopics]);

  // Load students and submissions for existing problems
  useEffect(() => {
    if (!isNew) {
      loadStudents();
      loadSubmissions(undefined, problemId);
    }
  }, [isNew, problemId, loadStudents, loadSubmissions]);

  // Update form when problem is loaded
  useEffect(() => {
    if (!isNew && existingProblem) {
      setFormData({
        id: existingProblem.id,
        topicId: existingProblem.topicId,
        title: existingProblem.title,
        titleRu: existingProblem.titleRu,
        description: existingProblem.description,
        descriptionRu: existingProblem.descriptionRu,
        difficulty: existingProblem.difficulty,
        points: existingProblem.points,
        grades: existingProblem.grades,
        starterCode: existingProblem.starterCode,
        solution: existingProblem.solution,
        hints: existingProblem.hints.length > 0 ? existingProblem.hints : [''],
        testCases: existingProblem.testCases,
      });
    }
  }, [isNew, existingProblem]);

  // Set default topic when topics load
  useEffect(() => {
    if (topics.length > 0 && !formData.topicId) {
      setFormData(prev => ({ ...prev, topicId: topics[0].id }));
    }
  }, [topics, formData.topicId]);

  const toggleGrade = (grade: number) => {
    if (formData.grades.includes(grade)) {
      if (formData.grades.length > 1) {
        setFormData({ ...formData, grades: formData.grades.filter(g => g !== grade) });
      }
    } else {
      setFormData({ ...formData, grades: [...formData.grades, grade].sort() });
    }
  };

  const addHint = () => {
    setFormData({ ...formData, hints: [...formData.hints, ''] });
  };

  const removeHint = (index: number) => {
    setFormData({
      ...formData,
      hints: formData.hints.filter((_, i) => i !== index),
    });
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...formData.hints];
    newHints[index] = value;
    setFormData({ ...formData, hints: newHints });
  };

  const addTestCase = () => {
    const newId = `tc${formData.testCases.length + 1}`;
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        { id: newId, input: '', expectedOutput: '', isHidden: false },
      ],
    });
  };

  const removeTestCase = (index: number) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index),
    });
  };

  const updateTestCase = (
    index: number,
    field: keyof TestCase,
    value: any
  ) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  // Get students who solved this problem
  const solvedByStudents = !isNew
    ? students.filter((s) => s.completedProblems?.includes(problemId))
    : [];

  // Get submissions for this problem
  const problemSubmissions = submissions.filter((s) => s.problemId === problemId);

  // Get submission code for a student
  const getStudentSubmission = (studentId: string) => {
    return problemSubmissions.find(
      (s) => s.studentId === studentId && s.status === 'passed'
    );
  };

  // Handle revoking a problem solution
  const handleRevokeProblem = async (studentId: string, studentName: string) => {
    if (!confirm(`Обнулить решение для "${studentName}"? Это уберёт задачу из решённых и снимет ${existingProblem?.points || 0} баллов.`)) {
      return;
    }

    setIsRevoking(true);
    try {
      const response = await fetch(`/api/students/${studentId}/revoke-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, points: existingProblem?.points || 0 }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      await loadStudents();
      toast.success(`Решение обнулено для ${studentName}`);
    } catch {
      toast.error('Ошибка при обнулении решения');
    }
    setIsRevoking(false);
  };

  // Get viewing submission data
  const viewingSubmission = viewingCode
    ? problemSubmissions.find((s) => s.id === viewingCode)
    : null;
  const viewingStudent = viewingSubmission
    ? students.find((s) => s.id === viewingSubmission.studentId)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleRu.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    if (!formData.topicId) {
      toast.error('Выберите тему');
      return;
    }

    if (formData.testCases.length === 0) {
      toast.error('Добавьте хотя бы один тест');
      return;
    }

    if (formData.grades.length === 0) {
      toast.error('Выберите хотя бы один класс');
      return;
    }

    // Filter empty hints
    const filteredHints = formData.hints.filter((h) => h.trim() !== '');

    try {
      if (isNew) {
        const newId =
          formData.titleRu
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-а-яё]/gi, '')
            .substring(0, 20) +
          '-' +
          Date.now().toString(36);

        // Auto-calculate order: add to end of topic
        const topicProblems = problems.filter(p => p.topicId === formData.topicId);
        const maxOrder = topicProblems.length > 0
          ? Math.max(...topicProblems.map(p => p.order))
          : 0;

        await createProblem({
          ...formData,
          id: newId,
          order: maxOrder + 1,
          hints: filteredHints,
        });
        toast.success('Задача создана');
      } else {
        await updateProblem(problemId, { ...formData, hints: filteredHints });
        toast.success('Задача обновлена');
      }

      router.push('/teacher/content');
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isNew && !existingProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Задача не найдена</h2>
          <p className="text-gray-400 mb-4">ID: {problemId}</p>
          <Link href="/teacher/content">
            <Button>Назад к контенту</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title={isNew ? 'Новая задача' : 'Редактирование задачи'}
        subtitle={isNew ? 'Создание новой задачи' : formData.titleRu}
      />

      <div className="p-8">
        <Link href="/teacher/content">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Basic Info */}
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Основная информация</h2>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Название (русский)"
                value={formData.titleRu}
                onChange={(e) =>
                  setFormData({ ...formData, titleRu: e.target.value })
                }
                placeholder="Например: Сумма двух чисел"
                required
              />
              <Input
                label="Название (английский)"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Sum of Two Numbers"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Описание (русский)
                </label>
                <textarea
                  value={formData.descriptionRu}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionRu: e.target.value })
                  }
                  placeholder="Подробное описание задачи..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Описание (английский)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed description..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
            </div>

            {/* Grades selection - multiple choice */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Для каких классов эта задача
              </label>
              <div className="flex gap-3">
                {[7, 8, 9, 10].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => toggleGrade(grade)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.grades.includes(grade)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {grade} класс
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Тема
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) =>
                    setFormData({ ...formData, topicId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.titleRu}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Сложность
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as Difficulty,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Легко</option>
                  <option value="medium">Средне</option>
                  <option value="hard">Сложно</option>
                </select>
              </div>

              <Input
                label="Баллы"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: parseInt(e.target.value) })
                }
                min={1}
              />
            </div>

          </Card>

          {/* Code */}
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Код</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Начальный код (шаблон для ученика)
              </label>
              <textarea
                value={formData.starterCode}
                onChange={(e) =>
                  setFormData({ ...formData, starterCode: e.target.value })
                }
                placeholder="# Напишите ваш код здесь"
                rows={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Решение (для справки)
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) =>
                  setFormData({ ...formData, solution: e.target.value })
                }
                placeholder="Правильное решение задачи..."
                rows={8}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
              />
            </div>
          </Card>

          {/* Test Cases */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Тесты ({formData.testCases.length})
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить тест
              </Button>
            </div>

            <div className="space-y-4">
              {formData.testCases.map((tc, index) => (
                <div
                  key={tc.id}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Тест {index + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) =>
                            updateTestCase(index, 'isHidden', e.target.checked)
                          }
                          className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        Скрытый
                      </label>
                      {formData.testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Входные данные
                      </label>
                      <textarea
                        value={tc.input}
                        onChange={(e) =>
                          updateTestCase(index, 'input', e.target.value)
                        }
                        placeholder="5&#10;3"
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Ожидаемый вывод
                      </label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) =>
                          updateTestCase(index, 'expectedOutput', e.target.value)
                        }
                        placeholder="8"
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hints */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Подсказки ({formData.hints.filter((h) => h.trim()).length})
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addHint}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить подсказку
              </Button>
            </div>

            <div className="space-y-3">
              {formData.hints.map((hint, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={hint}
                    onChange={(e) => updateHint(index, e.target.value)}
                    placeholder={`Подсказка ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.hints.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHint(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link href="/teacher/content">
              <Button variant="outline" type="button">
                Отмена
              </Button>
            </Link>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {isNew ? 'Создать' : 'Сохранить'}
            </Button>
          </div>
        </form>

        {/* Solved By Students Section - Only for existing problems */}
        {!isNew && (
          <Card className="p-6 mt-6 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Решили задачу ({solvedByStudents.length})
              </h2>
            </div>

            {solvedByStudents.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Пока никто не решил эту задачу</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {solvedByStudents.map((student) => {
                  const submission = getStudentSubmission(student.id);

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge size="sm" className="bg-blue-500/20 text-blue-400">
                              {student.grade} класс
                            </Badge>
                            <span className="text-gray-500 text-xs">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingCode(submission.id)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Код
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeProblem(student.id, student.name)}
                          disabled={isRevoking}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Обнулить
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Code Viewer Modal */}
      {viewingCode && viewingSubmission && viewingStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Код {viewingStudent.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {viewingSubmission.status === 'passed' ? 'Решено верно' : 'Не решено'} •{' '}
                  {viewingSubmission.passedTests}/{viewingSubmission.totalTests} тестов
                </p>
              </div>
              <button
                onClick={() => setViewingCode(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              <pre className="bg-gray-800 p-4 rounded-xl overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono whitespace-pre">
                  {viewingSubmission.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
