'use client';

import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import {
  BarChart3,
  TrendingUp,
  Users,
  Code,
  Award,
  Target,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { students, submissions, problems, topics } = useStore();

  // Calculate difficulty distribution
  const difficultyStats = {
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
  };

  // Calculate solve rates
  const problemSolveRates = problems.map((problem) => {
    const gradeStudents = students.filter((s) => s.grade === problem.grade);
    const solvedBy = gradeStudents.filter((s) =>
      s.completedProblems.includes(problem.id)
    ).length;
    const solveRate = gradeStudents.length > 0
      ? (solvedBy / gradeStudents.length) * 100
      : 0;
    return {
      ...problem,
      solvedBy,
      totalStudents: gradeStudents.length,
      solveRate,
    };
  });

  // Top 5 hardest problems (lowest solve rate)
  const hardestProblems = [...problemSolveRates]
    .sort((a, b) => a.solveRate - b.solveRate)
    .slice(0, 5);

  // Top 5 easiest problems (highest solve rate)
  const easiestProblems = [...problemSolveRates]
    .sort((a, b) => b.solveRate - a.solveRate)
    .slice(0, 5);

  // Grade activity
  const gradeActivity = [7, 8, 9, 10].map((grade) => {
    const gradeStudents = students.filter((s) => s.grade === grade);
    const totalSolved = gradeStudents.reduce(
      (sum, s) => sum + s.completedProblems.length,
      0
    );
    const avgSolved = gradeStudents.length > 0
      ? totalSolved / gradeStudents.length
      : 0;
    const activeCount = gradeStudents.filter(
      (s) =>
        new Date(s.lastActiveAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      grade,
      students: gradeStudents.length,
      totalSolved,
      avgSolved: Math.round(avgSolved * 10) / 10,
      activeCount,
      activeRate: gradeStudents.length > 0
        ? (activeCount / gradeStudents.length) * 100
        : 0,
    };
  });

  // Topic completion rates
  const topicStats = topics.map((topic) => {
    const topicProblems = problems.filter((p) => p.topicId === topic.id);
    const gradeStudents = students.filter((s) => s.grade === topic.grade);

    const completionRates = gradeStudents.map((student) => {
      const completed = topicProblems.filter((p) =>
        student.completedProblems.includes(p.id)
      ).length;
      return (completed / topicProblems.length) * 100;
    });

    const avgCompletion = completionRates.length > 0
      ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
      : 0;

    return {
      ...topic,
      problemCount: topicProblems.length,
      avgCompletion: Math.round(avgCompletion),
    };
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Аналитика"
        subtitle="Подробная статистика и отчёты"
      />

      <div className="p-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Всего учеников</p>
                <p className="text-2xl font-bold text-white">{students.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Всего задач</p>
                <p className="text-2xl font-bold text-white">{problems.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Всего решений</p>
                <p className="text-2xl font-bold text-white">{submissions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ср. прогресс</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(
                    students.reduce((sum, s) => {
                      const gp = problems.filter((p) => p.grade === s.grade);
                      return sum + (s.completedProblems.length / gp.length) * 100;
                    }, 0) / students.length
                  )}
                  %
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grade Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Активность по классам
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {gradeActivity.map((stat) => (
              <div key={stat.grade} className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-xl font-bold text-white mb-4">
                  {stat.grade} класс
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Учеников</span>
                    <span className="text-white font-medium">{stat.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Активных (7д)</span>
                    <span className="text-green-400 font-medium">
                      {stat.activeCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Ср. решено</span>
                    <span className="text-blue-400 font-medium">
                      {stat.avgSolved}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Активность</span>
                      <span>{Math.round(stat.activeRate)}%</span>
                    </div>
                    <Progress value={stat.activeRate} color="green" size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Problems Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hardest Problems */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-400" />
              Самые сложные задачи
            </h2>
            <div className="space-y-3">
              {hardestProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">{problem.titleRu}</p>
                    <p className="text-gray-400 text-sm">{problem.grade} класс</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-medium">
                      {Math.round(problem.solveRate)}%
                    </p>
                    <p className="text-gray-500 text-xs">
                      {problem.solvedBy}/{problem.totalStudents} решили
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Easiest Problems */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-400" />
              Самые лёгкие задачи
            </h2>
            <div className="space-y-3">
              {easiestProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">{problem.titleRu}</p>
                    <p className="text-gray-400 text-sm">{problem.grade} класс</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">
                      {Math.round(problem.solveRate)}%
                    </p>
                    <p className="text-gray-500 text-xs">
                      {problem.solvedBy}/{problem.totalStudents} решили
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Topic Completion */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Прогресс по темам
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topicStats.map((topic) => (
              <div key={topic.id} className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium truncate">
                    {topic.titleRu}
                  </h3>
                  <span className="text-gray-400 text-xs">{topic.grade} кл</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{topic.problemCount} задач</span>
                  <span>{topic.avgCompletion}%</span>
                </div>
                <Progress
                  value={topic.avgCompletion}
                  color={topic.color as any}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Распределение задач по сложности
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-4xl font-bold text-green-400">
                {difficultyStats.easy}
              </p>
              <p className="text-gray-400 mt-2">Лёгких</p>
            </div>
            <div className="text-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <p className="text-4xl font-bold text-yellow-400">
                {difficultyStats.medium}
              </p>
              <p className="text-gray-400 mt-2">Средних</p>
            </div>
            <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-4xl font-bold text-red-400">
                {difficultyStats.hard}
              </p>
              <p className="text-gray-400 mt-2">Сложных</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
