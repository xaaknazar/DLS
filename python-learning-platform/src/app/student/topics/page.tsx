'use client';

import { useStore } from '@/lib/store';
import { Student } from '@/types';
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
          {topics.map((topic, index) => {
            const problems = getProblemsByTopic(topic.id);
            const completed = problems.filter((p) =>
              student.completedProblems.includes(p.id)
            ).length;
            const isCompleted = completed === problems.length;
            const progress = (completed / problems.length) * 100;

            // Check if previous topic is completed (for unlocking)
            const previousTopic = topics[index - 1];
            const previousProblems = previousTopic
              ? getProblemsByTopic(previousTopic.id)
              : [];
            const previousCompleted = previousProblems.filter((p) =>
              student.completedProblems.includes(p.id)
            ).length;
            const isLocked =
              index > 0 && previousCompleted < previousProblems.length * 0.5;

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
                    className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-${topic.color}-500/5`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-${topic.color}-500/20 to-${topic.color}-600/20 border border-${topic.color}-500/20`}
                        >
                          {isLocked ? (
                            <Lock className="w-6 h-6 text-gray-500" />
                          ) : isCompleted ? (
                            <CheckCircle className={`w-6 h-6 text-${topic.color}-400`} />
                          ) : (
                            <BookOpen className={`w-6 h-6 text-${topic.color}-400`} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {topic.titleRu}
                          </h3>
                          <p className="text-gray-400 text-sm">{topic.title}</p>
                        </div>
                      </div>
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          Пройдено
                        </Badge>
                      )}
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
                          {isCompleted ? 'Повторить' : 'Продолжить'}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    )}

                    {isLocked && (
                      <div className="mt-4 text-gray-500 text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Пройдите 50% предыдущей темы
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
