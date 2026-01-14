'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditTopicPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = params.topicId as string;
  const isNew = topicId === 'new';
  const defaultGrade = parseInt(searchParams.get('grade') || '7');

  const { topics, updateTopic, createTopic } = useStore();
  const existingTopic = topics.find((t) => t.id === topicId);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    titleRu: '',
    description: '',
    descriptionRu: '',
    order: 1,
    icon: 'BookOpen',
    color: 'blue',
    grades: [defaultGrade] as number[],
    documentation: '',
    problemIds: [] as string[],
  });

  useEffect(() => {
    if (!isNew && existingTopic) {
      setFormData({
        id: existingTopic.id,
        title: existingTopic.title,
        titleRu: existingTopic.titleRu,
        description: existingTopic.description,
        descriptionRu: existingTopic.descriptionRu,
        order: existingTopic.order,
        icon: existingTopic.icon,
        color: existingTopic.color,
        grades: existingTopic.grades || [7],
        documentation: existingTopic.documentation,
        problemIds: existingTopic.problemIds,
      });
    }
  }, [isNew, existingTopic]);

  const toggleGrade = (grade: number) => {
    if (formData.grades.includes(grade)) {
      if (formData.grades.length > 1) {
        setFormData({ ...formData, grades: formData.grades.filter(g => g !== grade) });
      }
    } else {
      setFormData({ ...formData, grades: [...formData.grades, grade].sort() });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleRu.trim()) {
      toast.error('Введите название темы');
      return;
    }

    if (formData.grades.length === 0) {
      toast.error('Выберите хотя бы один класс');
      return;
    }

    try {
      if (isNew) {
        const newId = formData.titleRu
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zа-я0-9-]/g, '') + '-' + Date.now();

        await createTopic({
          ...formData,
          id: newId,
        });
        toast.success('Тема создана');
      } else {
        await updateTopic(topicId, formData);
        toast.success('Тема обновлена');
      }

      router.push('/teacher/content');
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title={isNew ? 'Новая тема' : 'Редактирование темы'}
        subtitle={isNew ? 'Создание новой темы' : formData.titleRu}
      />

      <div className="p-8">
        <Link href="/teacher/content">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="max-w-5xl">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Название (русский)"
                value={formData.titleRu}
                onChange={(e) =>
                  setFormData({ ...formData, titleRu: e.target.value })
                }
                placeholder="Например: Переменные"
                required
              />
              <Input
                label="Название (английский)"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Variables"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Описание (русский)"
                value={formData.descriptionRu}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionRu: e.target.value })
                }
                placeholder="Краткое описание темы"
              />
              <Input
                label="Описание (английский)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Классы
                </label>
                <div className="flex gap-2">
                  {[7, 8, 9, 10].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => toggleGrade(grade)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Цвет темы
                </label>
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blue">Синий</option>
                  <option value="green">Зелёный</option>
                  <option value="purple">Фиолетовый</option>
                  <option value="orange">Оранжевый</option>
                  <option value="red">Красный</option>
                  <option value="yellow">Жёлтый</option>
                  <option value="pink">Розовый</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Документация
              </label>
              <p className="text-gray-500 text-sm mb-3">
                Используйте Markdown для форматирования. Кнопки на панели помогут добавить код, заголовки и списки.
              </p>
              <MarkdownEditor
                value={formData.documentation}
                onChange={(value) =>
                  setFormData({ ...formData, documentation: value })
                }
                placeholder="# Название темы&#10;&#10;Описание темы...&#10;&#10;```python&#10;# Пример кода&#10;print('Hello!')&#10;```"
                minHeight={500}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
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
          </Card>
        </form>
      </div>
    </div>
  );
}
