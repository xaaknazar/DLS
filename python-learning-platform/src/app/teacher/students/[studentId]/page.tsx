'use client';

import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { getTopicsByGrade } from '@/data/topics';
import { getProblemsByTopic, problems as allProblems } from '@/data/problems';
import { achievements } from '@/data/achievements';
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Code,
  Flame,
  Trophy,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { students, submissions } = useStore();

  const student = students.find((s) => s.id === studentId);
  if (!student) return <div>Ученик не найден</div>;

  const topics = getTopicsByGrade(student.grade);
  const gradeProblems = allProblems.filter((p) => p.grade === student.grade);
  const studentSubmissions = submissions.filter(
    (s) => s.studentId === studentId
  );
  const earnedAchievements = achievements.filter((a) =>
    student.achievements.includes(a.id)
  );

  const overallProgress =
    (student.completedProblems.length / gradeProblems.length) * 100;

  return (
    <div className="min-h-screen">
      <Header title={student.name} subtitle={`${student.grade} класс`} />

      <div className="p-8">
        {/* Back button */}
        <Link href="/teacher/students">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            К списку учеников
          </Button>
        </Link>

        {/* Student Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <p className="text-gray-400">{student.grade} класс</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  Зарегистрирован: {formatDate(student.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <Card className="p-6">
            <h3 className="text-gray-400 text-sm mb-4">Статистика</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Баллы</p>
                  <p className="text-xl font-bold text-white">{student.points}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Решено</p>
                  <p className="text-xl font-bold text-white">
                    {student.completedProblems.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Серия</p>
                  <p className="text-xl font-bold text-white">
                    {student.streakDays} дн.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Награды</p>
                  <p className="text-xl font-bold text-white">
                    {earnedAchievements.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="p-6">
            <h3 className="text-gray-400 text-sm mb-4">Общий прогресс</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className="text-blue-500"
                    strokeDasharray={`${overallProgress * 3.52} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 text-sm">
              {student.completedProblems.length} из {gradeProblems.length} задач
            </p>
          </Card>
        </div>

        {/* Topics Progress */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Прогресс по темам
          </h2>
          <div className="space-y-4">
            {topics.map((topic) => {
              const topicProblems = getProblemsByTopic(topic.id);
              const completed = topicProblems.filter((p) =>
                student.completedProblems.includes(p.id)
              ).length;
              const progress = (completed / topicProblems.length) * 100;

              return (
                <div key={topic.id} className="flex items-center gap-4">
                  <div className="w-40 text-gray-300 truncate">{topic.titleRu}</div>
                  <div className="flex-1">
                    <Progress value={progress} color={topic.color as any} />
                  </div>
                  <div className="w-24 text-right text-sm">
                    <span className="text-white">{completed}</span>
                    <span className="text-gray-500">
                      {' '}
                      / {topicProblems.length}
                    </span>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-400">
                    {Math.round(progress)}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Submissions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Последние решения
          </h2>
          {studentSubmissions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Решений пока нет</p>
          ) : (
            <div className="space-y-3">
              {studentSubmissions.slice(0, 10).map((submission) => {
                const problem = allProblems.find(
                  (p) => p.id === submission.problemId
                );
                if (!problem) return null;

                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {submission.status === 'passed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">{problem.titleRu}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getDifficultyColor(problem.difficulty)}
                            size="sm"
                          >
                            {getDifficultyLabel(problem.difficulty)}
                          </Badge>
                          <span className="text-gray-500 text-xs">
                            {submission.passedTests}/{submission.totalTests} тестов
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDate(submission.submittedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
