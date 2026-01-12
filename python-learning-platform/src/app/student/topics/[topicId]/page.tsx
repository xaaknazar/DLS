'use client';

import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getTopicById } from '@/data/topics';
import { getProblemsByTopic } from '@/data/problems';
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  BookOpen,
  Code,
  ChevronRight,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';
import { useState } from 'react';

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { user } = useStore();
  const student = user as Student;
  const [activeTab, setActiveTab] = useState<'docs' | 'problems'>('docs');

  if (!student) return null;

  const topic = getTopicById(topicId);
  if (!topic) return <div>Тема не найдена</div>;

  const problems = getProblemsByTopic(topicId);
  const completedCount = problems.filter((p) =>
    student.completedProblems.includes(p.id)
  ).length;

  return (
    <div className="min-h-screen">
      <Header title={topic.titleRu} subtitle={topic.descriptionRu} />

      <div className="p-8">
        {/* Topic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Задач</p>
              <p className="text-xl font-bold text-white">{problems.length}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Решено</p>
              <p className="text-xl font-bold text-white">{completedCount}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Баллов</p>
              <p className="text-xl font-bold text-white">
                {problems.reduce((sum, p) => sum + p.points, 0)}
              </p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'docs' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('docs')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Документация
          </Button>
          <Button
            variant={activeTab === 'problems' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('problems')}
          >
            <Code className="w-4 h-4 mr-2" />
            Задачи ({problems.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'docs' ? (
          <Card className="p-8">
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
              <ReactMarkdown>{topic.documentation}</ReactMarkdown>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {problems.map((problem, index) => {
              const isCompleted = student.completedProblems.includes(problem.id);

              return (
                <Link key={problem.id} href={`/student/problems/${problem.id}`}>
                  <Card variant="interactive" className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500/10'
                              : 'bg-gray-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <span className="text-gray-400 font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {problem.titleRu}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {problem.descriptionRu}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge
                          className={getDifficultyColor(problem.difficulty)}
                          size="sm"
                        >
                          {getDifficultyLabel(problem.difficulty)}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {problem.points}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
