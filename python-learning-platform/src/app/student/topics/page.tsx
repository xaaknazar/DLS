'use client';

import { useStore } from '@/lib/store';
import { Student, Topic } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { getTopicsByGrade, getProblemsByTopic } from '@/lib/store';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  CheckCircle,
  Lock,
} from 'lucide-react';

// Color mapping to avoid dynamic Tailwind classes that don't compile
const colorClasses: Record<string, { bg: string; bgGradient: string; border: string; text: string }> = {
  blue: {
    bg: 'bg-blue-500/5',
    bgGradient: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
  },
  green: {
    bg: 'bg-green-500/5',
    bgGradient: 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/20',
    border: 'border-green-500/20',
    text: 'text-green-400',
  },
  purple: {
    bg: 'bg-purple-500/5',
    bgGradient: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/20',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
  },
  orange: {
    bg: 'bg-orange-500/5',
    bgGradient: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/20',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
  },
  red: {
    bg: 'bg-red-500/5',
    bgGradient: 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/20',
    border: 'border-red-500/20',
    text: 'text-red-400',
  },
  yellow: {
    bg: 'bg-yellow-500/5',
    bgGradient: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/20',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
  },
  pink: {
    bg: 'bg-pink-500/5',
    bgGradient: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/20',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
  },
};

const getColorClasses = (color: string) => colorClasses[color] || colorClasses.blue;

export default function TopicsPage() {
  const { user } = useStore();
  const student = user as Student;

  if (!student) return null;

  const topics = getTopicsByGrade(student.grade);

  return (
    <div className="min-h-screen">
      <Header
        title="Темы"
        subtitle={`Изучай Python шаг за шагом - ${student.grade} класс`}
      />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => {
            const problems = getProblemsByTopic(topic.id);
            const completed = problems.filter((p) =>
              student.completedProblems.includes(p.id)
            ).length;
            const isCompleted = problems.length > 0 && completed === problems.length;
            const progress = problems.length > 0 ? (completed / problems.length) * 100 : 0;
            const hasStarted = completed > 0;

            // Only teacher lock matters - topic.isLocked
            const isLocked = topic.isLocked || false;

            const colors = getColorClasses(topic.color);

            return (
              <Link
                key={topic.id}
                href={isLocked ? '#' : `/student/topics/${topic.id}`}
                className={isLocked ? 'cursor-not-allowed' : ''}
              >
                <Card
                  variant={isLocked ? 'default' : 'interactive'}
                  className={`p-6 relative overflow-hidden ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  {/* Background decoration */}
                  <div
                    className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${colors.bg}`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bgGradient} border`}
                        >
                          {isLocked ? (
                            <Lock className="w-6 h-6 text-gray-500" />
                          ) : isCompleted ? (
                            <CheckCircle className={`w-6 h-6 ${colors.text}`} />
                          ) : (
                            <BookOpen className={`w-6 h-6 ${colors.text}`} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {topic.titleRu}
                          </h3>
                          <p className="text-gray-400 text-sm">{topic.title}</p>
                        </div>
                      </div>
                      {isCompleted ? (
                        <Badge variant="success" size="sm">
                          Пройдено
                        </Badge>
                      ) : isLocked ? (
                        <Badge variant="default" size="sm" className="bg-gray-700 text-gray-400">
                          Закрыта
                        </Badge>
                      ) : null}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {topic.descriptionRu}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">
                        {completed} / {problems.length} задач
                      </span>
                      <span className="text-gray-400 text-sm">{Math.round(progress)}%</span>
                    </div>

                    <Progress value={progress} color={topic.color as any} />

                    {!isLocked && (
                      <div className="flex items-center justify-end mt-4 text-blue-400">
                        <span className="text-sm">
                          {isCompleted ? 'Повторить' : hasStarted ? 'Продолжить' : 'Начать'}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    )}

                    {isLocked && (
                      <div className="mt-4 text-gray-500 text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Тема закрыта учителем
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
