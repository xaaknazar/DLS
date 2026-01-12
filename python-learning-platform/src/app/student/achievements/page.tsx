'use client';

import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { achievements } from '@/data/achievements';
import {
  Trophy,
  Star,
  Lock,
  CheckCircle,
  Rocket,
  Flame,
  Award,
  Crown,
  Zap,
  BookOpen,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Rocket,
  CheckCircle,
  Award,
  Flame,
  Star,
  Trophy,
  Crown,
  Zap,
  BookOpen,
};

export default function AchievementsPage() {
  const { user } = useStore();
  const student = user as Student;

  if (!student) return null;

  const earnedAchievements = achievements.filter((a) =>
    student.achievements.includes(a.id)
  );
  const lockedAchievements = achievements.filter(
    (a) => !student.achievements.includes(a.id)
  );
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  const checkProgress = (achievement: typeof achievements[0]) => {
    switch (achievement.requirement.type) {
      case 'problems_solved':
        return {
          current: student.completedProblems.length,
          required: achievement.requirement.value,
        };
      case 'points_earned':
        return {
          current: student.points,
          required: achievement.requirement.value,
        };
      case 'streak':
        return {
          current: student.streakDays,
          required: achievement.requirement.value,
        };
      default:
        return { current: 0, required: achievement.requirement.value };
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Достижения" subtitle="Зарабатывай награды за прогресс" />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Получено</p>
                <p className="text-2xl font-bold text-white">
                  {earnedAchievements.length} / {achievements.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Бонусные баллы</p>
                <p className="text-2xl font-bold text-white">+{totalPoints}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Прогресс</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(
                    (earnedAchievements.length / achievements.length) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Полученные достижения
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {earnedAchievements.map((achievement) => {
                const Icon = iconMap[achievement.icon] || Trophy;

                return (
                  <Card
                    key={achievement.id}
                    className="p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${achievement.color}-500/20`}
                      >
                        <Icon className={`w-7 h-7 text-${achievement.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {achievement.titleRu}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {achievement.descriptionRu}
                        </p>
                        <Badge variant="success" size="sm" className="mt-2">
                          +{achievement.points} баллов
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Locked Achievements */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Недоступные достижения
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            const progress = checkProgress(achievement);
            const progressPercent = Math.min(
              (progress.current / progress.required) * 100,
              100
            );

            return (
              <Card key={achievement.id} className="p-6 opacity-75">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-700">
                    <Icon className="w-7 h-7 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {achievement.titleRu}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {achievement.descriptionRu}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          {progress.current} / {progress.required}
                        </span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="default" size="sm" className="mt-2">
                      +{achievement.points} баллов
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
