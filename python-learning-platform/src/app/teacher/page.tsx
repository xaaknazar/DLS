'use client';

import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { getShopItemById } from '@/data/shop';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Code,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Activity,
} from 'lucide-react';

export default function TeacherDashboard() {
  const { students, submissions, problems, topics } = useStore();

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => new Date(s.lastActiveAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;
  const totalSubmissions = submissions.length;
  const totalProblemsSolved = students.reduce(
    (sum, s) => sum + s.completedProblems.length,
    0
  );
  const averageProgress =
    students.reduce((sum, s) => {
      const gradeProblems = problems.filter((p) => p.grades.includes(s.grade));
      return sum + (s.completedProblems.length / Math.max(gradeProblems.length, 1)) * 100;
    }, 0) / Math.max(totalStudents, 1);

  // Stats by grade
  const gradeStats = [7, 8, 9, 10].map((grade) => {
    const gradeStudents = students.filter((s) => s.grade === grade);
    const gradeProblems = problems.filter((p) => p.grades.includes(grade));
    const avgSolved =
      gradeStudents.reduce((sum, s) => sum + s.completedProblems.length, 0) /
      Math.max(gradeStudents.length, 1);
    const avgProgress =
      gradeStudents.reduce((sum, s) => {
        return sum + (s.completedProblems.length / Math.max(gradeProblems.length, 1)) * 100;
      }, 0) / Math.max(gradeStudents.length, 1);

    return {
      grade,
      students: gradeStudents.length,
      avgSolved: Math.round(avgSolved),
      avgProgress: Math.round(avgProgress),
      topStudent: gradeStudents.sort((a, b) => b.points - a.points)[0],
    };
  });

  // Recent active students
  const recentActiveStudents = [...students]
    .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Header
        title="Панель учителя"
        subtitle="Обзор успеваемости учеников"
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Всего учеников</p>
                <p className="text-2xl font-bold text-white">{totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Активных за неделю</p>
                <p className="text-2xl font-bold text-white">{activeStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Решено задач</p>
                <p className="text-2xl font-bold text-white">{totalProblemsSolved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Средний прогресс</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(averageProgress)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grade Cards */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Прогресс по классам
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gradeStats.map((stat) => (
              <Link key={stat.grade} href={`/teacher/students?grade=${stat.grade}`}>
                <Card variant="interactive" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {stat.grade} класс
                    </h3>
                    <Badge variant="info">{stat.students} уч.</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Средний прогресс</span>
                        <span>{stat.avgProgress}%</span>
                      </div>
                      <Progress value={stat.avgProgress} color="blue" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Решено в среднем</span>
                      <span className="text-white font-medium">
                        {stat.avgSolved} задач
                      </span>
                    </div>

                    {stat.topStudent && (
                      <div className="pt-3 border-t border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Лидер класса</p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-yellow-400" />
                          </div>
                          <span className="text-white text-sm">
                            {stat.topStudent.name}
                          </span>
                          <span className="text-yellow-400 text-sm ml-auto">
                            {stat.topStudent.points} pts
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Active Students */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Недавно активные
              </h2>
              <Link
                href="/teacher/students"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                Все ученики <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentActiveStudents.map((student) => {
                const timeDiff = Date.now() - new Date(student.lastActiveAt).getTime();
                const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                const timeLabel =
                  hoursAgo < 1
                    ? 'Только что'
                    : hoursAgo < 24
                    ? `${hoursAgo} ч. назад`
                    : `${Math.floor(hoursAgo / 24)} дн. назад`;

                return (
                  <Link
                    key={student.id}
                    href={`/teacher/students/${student.id}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const avatarItem = student.equippedAvatar ? getShopItemById(student.equippedAvatar) : null;
                          const frameItem = student.equippedFrame ? getShopItemById(student.equippedFrame) : null;

                          if (avatarItem) {
                            return (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                                bg-gradient-to-br ${avatarItem.gradient || 'from-gray-600 to-gray-700'}
                                ${frameItem?.borderColor || ''}
                              `}>
                                {avatarItem.image ? (
                                  <img src={avatarItem.image} alt={avatarItem.nameRu} className="w-8 h-8 object-contain" />
                                ) : (
                                  <span className="text-lg">{avatarItem.emoji}</span>
                                )}
                              </div>
                            );
                          }

                          return (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0)}
                            </div>
                          );
                        })()}
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <p className="text-gray-400 text-sm">
                            {student.grade} класс
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {timeLabel}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Общая статистика
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Всего тем</span>
                </div>
                <span className="text-white font-bold">{topics.length}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Всего задач</span>
                </div>
                <span className="text-white font-bold">{problems.length}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Всего решений</span>
                </div>
                <span className="text-white font-bold">{totalSubmissions}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Достижений получено</span>
                </div>
                <span className="text-white font-bold">
                  {students.reduce((sum, s) => sum + s.achievements.length, 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
