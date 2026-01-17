'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore, getTopicsByGrade, getProblemsByTopic } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { achievements } from '@/data/achievements';
import { shopItems, getShopItemById, getRarityColor } from '@/data/shop';
import { formatDate, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
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
  Plus,
  Minus,
  Eye,
  X,
  ShoppingBag,
  Gift,
  Trash2,
  Ban,
  RotateCcw,
  Award,
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const {
    students,
    loadStudents,
    loadSubmissions,
    submissions,
    updateStudentPoints,
    problems: allProblems,
    topics,
    loadProblems,
    loadTopics,
  } = useStore();

  const [pointsToAdd, setPointsToAdd] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewingCode, setViewingCode] = useState<string | null>(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopAction, setShopAction] = useState<'give' | 'remove' | null>(null);

  useEffect(() => {
    loadStudents();
    loadSubmissions(studentId);
    loadProblems();
    loadTopics();
  }, [studentId]);

  const student = students.find((s) => s.id === studentId);
  if (!student) return <div className="p-8 text-white">Загрузка...</div>;

  const studentTopics = getTopicsByGrade(student.grade);
  const gradeProblems = allProblems.filter((p) => p.grades.includes(student.grade));
  const studentSubmissions = submissions.filter((s) => s.studentId === studentId);
  const earnedAchievements = achievements.filter((a) =>
    student.achievements.includes(a.id)
  );

  const overallProgress =
    gradeProblems.length > 0
      ? (student.completedProblems.length / gradeProblems.length) * 100
      : 0;

  const handleAddPoints = async () => {
    setIsUpdating(true);
    try {
      await updateStudentPoints(studentId, pointsToAdd);
      toast.success(`Добавлено ${pointsToAdd} баллов`);
    } catch {
      toast.error('Ошибка при добавлении баллов');
    }
    setIsUpdating(false);
  };

  const handleDeductPoints = async () => {
    setIsUpdating(true);
    try {
      await updateStudentPoints(studentId, -pointsToAdd);
      toast.success(`Снято ${pointsToAdd} баллов`);
    } catch {
      toast.error('Ошибка при снятии баллов');
    }
    setIsUpdating(false);
  };

  const handleShopAction = async (itemId: string, action: 'give' | 'remove') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/students/${studentId}/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      await loadStudents(); // Reload to get updated data
      const item = getShopItemById(itemId);
      if (action === 'give') {
        toast.success(`${item?.nameRu} выдан ученику`);
      } else {
        toast.success(`${item?.nameRu} убран у ученика`);
      }
    } catch {
      toast.error('Ошибка при управлении предметом');
    }
    setIsUpdating(false);
  };

  const handleRevokeProblem = async (problemId: string, points: number) => {
    if (!confirm(`Вы уверены? Это уберёт задачу из решённых и снимет ${points} баллов.`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/students/${studentId}/revoke-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, points }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      await loadStudents();
      toast.success(`Задача отменена, снято ${points} баллов`);
    } catch {
      toast.error('Ошибка при отмене задачи');
    }
    setIsUpdating(false);
  };

  const handleRevokeAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    const points = achievement?.points || 0;

    if (!confirm(`Вы уверены? Это уберёт достижение "${achievement?.titleRu}" и снимет ${points} баллов.`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/students/${studentId}/revoke-achievement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementId }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      await loadStudents();
      toast.success(`Достижение убрано, снято ${points} баллов`);
    } catch {
      toast.error('Ошибка при удалении достижения');
    }
    setIsUpdating(false);
  };

  // Get student's purchased items
  const studentPurchasedItems = (student?.purchasedItems || [])
    .map(id => getShopItemById(id))
    .filter(Boolean);

  // Get items student doesn't have
  const availableItems = shopItems.filter(
    item => !student?.purchasedItems?.includes(item.id)
  );

  const viewingSubmission = viewingCode
    ? studentSubmissions.find((s) => s.id === viewingCode)
    : null;
  const viewingProblem = viewingSubmission
    ? allProblems.find((p) => p.id === viewingSubmission.problemId)
    : null;

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
              {(() => {
                const avatarItem = student.equippedAvatar ? getShopItemById(student.equippedAvatar) : null;
                const frameItem = student.equippedFrame ? getShopItemById(student.equippedFrame) : null;

                if (avatarItem) {
                  return (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden
                      bg-gradient-to-br ${avatarItem.gradient || 'from-gray-600 to-gray-700'}
                      ${frameItem?.borderColor || ''}
                    `}>
                      {avatarItem.image ? (
                        <img src={avatarItem.image} alt={avatarItem.nameRu} className="w-14 h-14 object-contain" />
                      ) : (
                        <span className="text-3xl">{avatarItem.emoji}</span>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {student.name.charAt(0)}
                  </div>
                );
              })()}
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

        {/* Points Management */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Управление баллами
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Количество:</span>
              <input
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-center"
                min="1"
              />
            </div>
            <Button
              onClick={handleAddPoints}
              disabled={isUpdating}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить баллы
            </Button>
            <Button
              onClick={handleDeductPoints}
              disabled={isUpdating}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              <Minus className="w-4 h-4 mr-2" />
              Снять баллы
            </Button>
          </div>
        </Card>

        {/* Shop Management */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Управление покупками
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShopAction('give'); setShowShopModal(true); }}
                className="border-green-500 text-green-400 hover:bg-green-500/10"
              >
                <Gift className="w-4 h-4 mr-2" />
                Выдать предмет
              </Button>
            </div>
          </div>

          {studentPurchasedItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">У ученика нет покупок</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentPurchasedItems.map((item) => item && (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                      ${item.gradient ? `bg-gradient-to-br ${item.gradient}` : 'bg-gray-700'}
                    `}>
                      {item.image ? (
                        <img src={item.image} alt={item.nameRu} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-lg">{item.emoji}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{item.nameRu}</p>
                      <p className={`text-xs ${getRarityColor(item.rarity)}`}>
                        {item.category === 'reward' ? 'Награда' : item.category === 'avatar' ? 'Аватар' : 'Рамка'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShopAction(item.id, 'remove')}
                    disabled={isUpdating}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Topics Progress */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Прогресс по темам
          </h2>
          <div className="space-y-4">
            {studentTopics.map((topic) => {
              const topicProblems = getProblemsByTopic(topic.id);
              const completed = topicProblems.filter((p) =>
                student.completedProblems.includes(p.id)
              ).length;
              const progress = topicProblems.length > 0
                ? (completed / topicProblems.length) * 100
                : 0;

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

        {/* Completed Problems with Revoke */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Решённые задачи ({student.completedProblems.length})
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Если ученик списал - нажмите кнопку отмены, чтобы убрать задачу и снять баллы
          </p>
          {student.completedProblems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Ученик ещё не решил ни одной задачи</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {student.completedProblems.map((problemId) => {
                const problem = allProblems.find((p) => p.id === problemId);
                if (!problem) return null;

                return (
                  <div
                    key={problemId}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{problem.titleRu}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getDifficultyColor(problem.difficulty)}
                            size="sm"
                          >
                            {getDifficultyLabel(problem.difficulty)}
                          </Badge>
                          <span className="text-yellow-400 text-sm flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {problem.points}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {topics.find(t => t.id === problem.topicId)?.titleRu || 'Тема'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeProblem(problemId, problem.points)}
                      disabled={isUpdating}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Отменить
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Achievements with Revoke */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Достижения ({earnedAchievements.length})
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Нажмите кнопку отмены, чтобы убрать достижение и снять бонусные баллы
          </p>
          {earnedAchievements.length === 0 ? (
            <p className="text-gray-400 text-center py-4">У ученика пока нет достижений</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-${achievement.color}-500/20`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{achievement.titleRu}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 text-sm flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          +{achievement.points}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {achievement.descriptionRu}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeAchievement(achievement.id)}
                    disabled={isUpdating}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Убрать
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Submissions with Code View */}
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
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCode(submission.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Код
                      </Button>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDate(submission.submittedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Code Viewer Modal */}
      {viewingCode && viewingSubmission && viewingProblem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {viewingProblem.titleRu}
                </h3>
                <p className="text-sm text-gray-400">
                  {viewingSubmission.status === 'passed' ? 'Решено верно' : 'Не решено'} •{' '}
                  {viewingSubmission.passedTests}/{viewingSubmission.totalTests} тестов
                </p>
              </div>
              <button
                onClick={() => setViewingCode(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              <pre className="bg-gray-800 p-4 rounded-xl overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono whitespace-pre">
                  {viewingSubmission.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Shop Give Item Modal */}
      {showShopModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-400" />
                  Выдать предмет
                </h3>
                <p className="text-sm text-gray-400">
                  Выберите предмет для выдачи ученику
                </p>
              </div>
              <button
                onClick={() => setShowShopModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              {availableItems.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  У ученика уже есть все предметы
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden
                          ${item.gradient ? `bg-gradient-to-br ${item.gradient}` : 'bg-gray-700'}
                        `}>
                          {item.image ? (
                            <img src={item.image} alt={item.nameRu} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-2xl">{item.emoji}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.nameRu}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${getRarityColor(item.rarity)}`}>
                              {item.category === 'reward' ? 'Награда' : item.category === 'avatar' ? 'Аватар' : 'Рамка'}
                            </span>
                            <span className="text-xs text-yellow-400">
                              {item.price} ⭐
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleShopAction(item.id, 'give');
                          setShowShopModal(false);
                        }}
                        disabled={isUpdating}
                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                      >
                        <Gift className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
