'use client';

import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useState, useEffect } from 'react';
import { getShopItemById } from '@/data/shop';
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Code,
  Crown,
  Loader2,
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user, students, loadStudents } = useStore();
  const currentStudent = user as Student;
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(
    currentStudent?.grade || 7
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        await loadStudents();
      } catch (e) {
        console.error('Failed to load students:', e);
      }
      setIsLoading(false);
    };
    fetchStudents();
  }, [loadStudents]);

  if (!currentStudent) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Рейтинг" subtitle="Соревнуйся с одноклассниками" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  const filteredStudents =
    selectedGrade === 'all'
      ? students
      : students.filter((s) => s.grade === selectedGrade);

  const sortedStudents = [...filteredStudents].sort(
    (a, b) => b.points - a.points
  );

  const currentUserRank =
    sortedStudents.findIndex((s) => s.id === currentStudent.id) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="text-gray-400 font-mono font-bold">{rank}</span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/30';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Рейтинг" subtitle="Соревнуйся с одноклассниками" />

      <div className="p-8">
        {/* Current User Rank */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(() => {
                const avatarItem = currentStudent.equippedAvatar ? getShopItemById(currentStudent.equippedAvatar) : null;
                const frameItem = currentStudent.equippedFrame ? getShopItemById(currentStudent.equippedFrame) : null;

                if (avatarItem) {
                  return (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden
                      bg-gradient-to-br ${avatarItem.gradient || 'from-blue-500 to-purple-600'}
                      ${frameItem?.borderColor || ''}
                    `}>
                      {avatarItem.image ? (
                        <img src={avatarItem.image} alt={avatarItem.nameRu} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-2xl">{avatarItem.emoji}</span>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {currentStudent.name.charAt(0)}
                  </div>
                );
              })()}
              <div>
                <p className="text-gray-400 text-sm">Твоя позиция</p>
                <p className="text-2xl font-bold text-white">
                  #{currentUserRank} из {sortedStudents.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Баллы</p>
                <div className="flex items-center gap-1 text-yellow-400 text-xl font-bold">
                  <Star className="w-5 h-5" />
                  {currentStudent.points}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Решено</p>
                <div className="flex items-center gap-1 text-green-400 text-xl font-bold">
                  <Code className="w-5 h-5" />
                  {currentStudent.completedProblems.length}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Серия</p>
                <div className="flex items-center gap-1 text-orange-400 text-xl font-bold">
                  <Flame className="w-5 h-5" />
                  {currentStudent.streakDays}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-400">Класс:</span>
          {[7, 8, 9, 10, 'all'].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade as number | 'all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedGrade === grade
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {grade === 'all' ? 'Все' : `${grade} класс`}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {sortedStudents.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = student.id === currentStudent.id;

            return (
              <Card
                key={student.id}
                className={`p-4 ${getRankBg(rank)} ${
                  isCurrentUser ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1">
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
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isCurrentUser
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {student.name.charAt(0)}
                        </div>
                      );
                    })()}
                    <div>
                      <p className="font-medium text-white">
                        {student.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-blue-400 text-sm">(Вы)</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">{student.grade} класс</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-green-400">
                      <Code className="w-4 h-4" />
                      <span className="font-medium">
                        {student.completedProblems.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">{student.streakDays}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 min-w-[80px] justify-end">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{student.points}</span>
                    </div>
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
