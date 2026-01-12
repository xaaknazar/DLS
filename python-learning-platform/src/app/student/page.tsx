'use client';

import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { getTopicsByGrade, getProblemsByGrade } from '@/lib/store';
import Link from 'next/link';
import {
  BookOpen,
  Code,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useStore();
  const student = user as Student;

  if (!student) return null;

  const topics = getTopicsByGrade(student.grade);
  const problems = getProblemsByGrade(student.grade);
  const completedCount = student.completedProblems.length;
  const totalProblems = problems.length;
  const progressPercent = Math.round((completedCount / totalProblems) * 100);

  return (
    <div className="min-h-screen">
      <Header
        title={`Привет, ${student.name.split(' ')[0]}!`}
        subtitle="Продолжай изучать Python"
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Решено задач</p>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Баллы</p>
                <p className="text-2xl font-bold text-white">{student.points}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Дней подряд</p>
                <p className="text-2xl font-bold text-white">{student.streakDays}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Достижения</p>
                <p className="text-2xl font-bold text-white">{student.achievements.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Общий прогресс</h2>
            <span className="text-blue-400 font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} size="lg" color="blue" />
          <p className="text-gray-400 text-sm mt-3">
            Решено {completedCount} из {totalProblems} задач для {student.grade} класса
          </p>
        </Card>

        {/* Topics and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Темы для изучения</h2>
              <Link
                href="/student/topics"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                Все темы <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.slice(0, 4).map((topic) => {
                const topicProblems = problems.filter((p) => p.topicId === topic.id);
                const completed = topicProblems.filter((p) =>
                  student.completedProblems.includes(p.id)
                ).length;

                return (
                  <Link key={topic.id} href={`/student/topics/${topic.id}`}>
                    <Card variant="interactive" className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${topic.color}-500/10`}
                        >
                          <BookOpen className={`w-5 h-5 text-${topic.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{topic.titleRu}</h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {completed}/{topicProblems.length} задач
                          </p>
                          <Progress
                            value={(completed / topicProblems.length) * 100}
                            size="sm"
                            className="mt-3"
                            color={topic.color as any}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              <Link href="/student/problems">
                <Card variant="interactive" className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Решить задачу</h3>
                    <p className="text-gray-400 text-sm">Случайная задача</p>
                  </div>
                </Card>
              </Link>

              <Link href="/student/leaderboard">
                <Card variant="interactive" className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Рейтинг</h3>
                    <p className="text-gray-400 text-sm">Сравни с одноклассниками</p>
                  </div>
                </Card>
              </Link>

              <Link href="/student/achievements">
                <Card variant="interactive" className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Достижения</h3>
                    <p className="text-gray-400 text-sm">Получи новые награды</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
