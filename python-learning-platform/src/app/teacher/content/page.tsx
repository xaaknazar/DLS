'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import Link from 'next/link';
import {
  BookOpen,
  Code,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  FileText,
  FlaskConical,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContentManagementPage() {
  const { topics, problems, deleteTopic, deleteProblem } = useStore();
  const [selectedGrade, setSelectedGrade] = useState(7);
  const [activeTab, setActiveTab] = useState<'topics' | 'problems'>('topics');

  const gradeTopics = topics.filter((t) => t.grades.includes(selectedGrade));
  const gradeProblems = problems.filter((p) => p.grades.includes(selectedGrade));

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    if (confirm(`Удалить тему "${topicName}" и все её задачи?`)) {
      deleteTopic(topicId);
      toast.success('Тема удалена');
    }
  };

  const handleDeleteProblem = (problemId: string, problemName: string) => {
    if (confirm(`Удалить задачу "${problemName}"?`)) {
      deleteProblem(problemId);
      toast.success('Задача удалена');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Управление контентом"
        subtitle="Редактирование тем и задач"
      />

      <div className="p-8">
        {/* Grade Tabs */}
        <div className="flex gap-2 mb-6">
          {[7, 8, 9, 10].map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? 'primary' : 'ghost'}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade} класс
            </Button>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'topics' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('topics')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Темы ({gradeTopics.length})
          </Button>
          <Button
            variant={activeTab === 'problems' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('problems')}
          >
            <Code className="w-4 h-4 mr-2" />
            Задачи ({gradeProblems.length})
          </Button>
        </div>

        {/* Topics List */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Темы {selectedGrade} класса
              </h2>
              <Link href={`/teacher/content/topics/new?grade=${selectedGrade}`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить тему
                </Button>
              </Link>
            </div>

            {gradeTopics.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Нет тем для этого класса</p>
              </Card>
            ) : (
              gradeTopics.map((topic) => {
                const topicProblems = problems.filter(
                  (p) => p.topicId === topic.id
                );

                return (
                  <Card key={topic.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {topic.titleRu}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {topicProblems.length} задач
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/teacher/content/topics/${topic.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteTopic(topic.id, topic.titleRu)
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Problems List */}
        {activeTab === 'problems' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Задачи {selectedGrade} класса
              </h2>
              <Link href={`/teacher/content/problems/new?grade=${selectedGrade}`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить задачу
                </Button>
              </Link>
            </div>

            {gradeProblems.length === 0 ? (
              <Card className="p-8 text-center">
                <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Нет задач для этого класса</p>
              </Card>
            ) : (
              gradeProblems.map((problem) => {
                const topic = topics.find((t) => t.id === problem.topicId);

                return (
                  <Card key={problem.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 font-medium">
                            {problem.order}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {problem.titleRu}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {topic?.titleRu} • {problem.points} баллов
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded-lg">
                          <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-purple-400 text-sm font-medium">
                            {problem.testCases?.length || 0}
                          </span>
                        </div>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {getDifficultyLabel(problem.difficulty)}
                        </Badge>
                        <Link href={`/teacher/content/problems/${problem.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteProblem(problem.id, problem.titleRu)
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
