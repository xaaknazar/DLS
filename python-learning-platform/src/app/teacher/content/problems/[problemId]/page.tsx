'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { TestCase, Difficulty } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditProblemPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = params.problemId as string;
  const isNew = problemId === 'new';
  const defaultGrade = parseInt(searchParams.get('grade') || '7');

  const { topics, problems, updateProblem, addProblem } = useStore();
  const existingProblem = problems.find((p) => p.id === problemId);
  const gradeTopics = topics.filter((t) => t.grade === defaultGrade);

  const [formData, setFormData] = useState({
    id: '',
    topicId: gradeTopics[0]?.id || '',
    title: '',
    titleRu: '',
    description: '',
    descriptionRu: '',
    difficulty: 'easy' as Difficulty,
    points: 10,
    order: 1,
    grade: defaultGrade,
    starterCode: '# Напишите ваш код здесь\n',
    solution: '',
    hints: [''] as string[],
    testCases: [
      { id: 'tc1', input: '', expectedOutput: '', isHidden: false },
    ] as TestCase[],
  });

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
        order: existingProblem.order,
        grade: existingProblem.grade,
        starterCode: existingProblem.starterCode,
        solution: existingProblem.solution,
        hints: existingProblem.hints.length > 0 ? existingProblem.hints : [''],
        testCases: existingProblem.testCases,
      });
    }
  }, [isNew, existingProblem]);

  // Update topics when grade changes
  useEffect(() => {
    const newGradeTopics = topics.filter((t) => t.grade === formData.grade);
    if (newGradeTopics.length > 0 && !newGradeTopics.find(t => t.id === formData.topicId)) {
      setFormData(prev => ({ ...prev, topicId: newGradeTopics[0].id }));
    }
  }, [formData.grade, topics]);

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Filter empty hints
    const filteredHints = formData.hints.filter((h) => h.trim() !== '');

    if (isNew) {
      const newId =
        formData.titleRu
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-а-яё]/gi, '')
          .substring(0, 20) +
        '-' +
        Date.now().toString(36);

      addProblem({
        ...formData,
        id: newId,
        hints: filteredHints,
      });
      toast.success('Задача создана');
    } else {
      updateProblem(problemId, { ...formData, hints: filteredHints });
      toast.success('Задача обновлена');
    }

    router.push('/teacher/content');
  };

  const currentGradeTopics = topics.filter((t) => t.grade === formData.grade);

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

            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Класс
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>7 класс</option>
                  <option value={8}>8 класс</option>
                  <option value={9}>9 класс</option>
                  <option value={10}>10 класс</option>
                </select>
              </div>

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
                  {currentGradeTopics.map((topic) => (
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

            <Input
              label="Порядок"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              min={1}
            />
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
      </div>
    </div>
  );
}
