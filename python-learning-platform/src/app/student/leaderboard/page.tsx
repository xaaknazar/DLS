'use client';

import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import { useState, useEffect, useCallback } from 'react';
import { getShopItemById } from '@/data/shop';
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Code,
  Crown,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Award,
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  grade: number;
  points: number;
  completedProblems: number;
  streakDays: number;
  currentRank: number;
  previousRank: number | null;
  change: number | null;
  equippedAvatar: string | null;
  equippedFrame: string | null;
}

export default function LeaderboardPage() {
  const { user, students, loadStudents } = useStore();
  const currentStudent = user as Student;
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(
    currentStudent?.grade || 7
  );
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const gradeParam = selectedGrade === 'all' ? 'all' : selectedGrade;
      const response = await fetch(`/api/leaderboard/update-ranks?grade=${gradeParam}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
    }
  }, [selectedGrade]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await loadStudents();
        await fetchLeaderboard();
      } catch (e) {
        console.error('Failed to load data:', e);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [loadStudents, fetchLeaderboard]);

  // Обновляем снимок рейтинга при первом посещении
  useEffect(() => {
    const updateRankSnapshot = async () => {
      try {
        await fetch('/api/leaderboard/update-ranks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade: selectedGrade === 'all' ? undefined : selectedGrade }),
        });
      } catch (e) {
        console.error('Failed to update rank snapshot:', e);
      }
    };
    updateRankSnapshot();
  }, []);

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

  // Fallback to local data if API failed
  const displayData = leaderboard.length > 0
    ? leaderboard
    : (() => {
        const filteredStudents = selectedGrade === 'all'
          ? students
          : students.filter((s) => s.grade === selectedGrade);
        const sortedStudents = [...filteredStudents].sort((a, b) => b.points - a.points);
        return sortedStudents.map((s, i) => ({
          id: s.id,
          name: s.name,
          grade: s.grade,
          points: s.points,
          completedProblems: s.completedProblems.length,
          streakDays: s.streakDays,
          currentRank: i + 1,
          previousRank: s.previousRank ?? null,
          change: s.previousRank ? s.previousRank - (i + 1) : null,
          equippedAvatar: s.equippedAvatar,
          equippedFrame: s.equippedFrame,
        }));
      })();

  const currentUserEntry = displayData.find((e) => e.id === currentStudent.id);
  const currentUserRank = currentUserEntry?.currentRank || 0;
  const currentUserChange = currentUserEntry?.change ?? null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <Crown className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        );
      case 2:
        return <Medal className="w-6 h-6 text-gray-300 drop-shadow-md" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />;
      default:
        return (
          <span className="text-gray-400 font-mono font-bold text-lg">{rank}</span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 via-amber-500/15 to-yellow-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/10';
      case 2:
        return 'bg-gradient-to-r from-gray-400/15 via-slate-400/10 to-gray-400/15 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/15 via-orange-500/10 to-amber-600/15 border-amber-600/30';
      default:
        return 'hover:bg-gray-800/50';
    }
  };

  const getRankChangeDisplay = (change: number | null) => {
    if (change === null) {
      return (
        <div className="flex items-center gap-1 text-gray-500 text-sm min-w-[50px] justify-end">
          <Minus className="w-4 h-4" />
          <span>-</span>
        </div>
      );
    }

    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-400 text-sm font-medium min-w-[50px] justify-end animate-pulse">
          <TrendingUp className="w-4 h-4" />
          <span>+{change}</span>
        </div>
      );
    }

    if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-sm font-medium min-w-[50px] justify-end">
          <TrendingDown className="w-4 h-4" />
          <span>{change}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-gray-500 text-sm min-w-[50px] justify-end">
        <Minus className="w-4 h-4" />
        <span>0</span>
      </div>
    );
  };

  const getAvatar = (entry: LeaderboardEntry, size: 'sm' | 'md' | 'lg' = 'sm', isCurrentUser = false) => {
    const avatarItem = entry.equippedAvatar ? getShopItemById(entry.equippedAvatar) : null;
    const frameItem = entry.equippedFrame ? getShopItemById(entry.equippedFrame) : null;

    const sizeClasses = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    const innerSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
    };

    const textSizes = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
    };

    if (avatarItem) {
      return (
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden
            bg-gradient-to-br ${avatarItem.gradient || 'from-gray-600 to-gray-700'}
            ${frameItem?.borderColor || ''}
          `}
        >
          {avatarItem.image ? (
            <img
              src={avatarItem.image}
              alt={avatarItem.nameRu}
              className={`${innerSizes[size]} object-contain`}
            />
          ) : (
            <span className={textSizes[size]}>{avatarItem.emoji}</span>
          )}
        </div>
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ${
          isCurrentUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        {entry.name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header title="Рейтинг" subtitle="Соревнуйся с одноклассниками" />

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Current User Rank Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-blue-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {currentUserEntry && getAvatar(currentUserEntry, 'lg', true)}
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm">Твоя позиция</p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-white">
                    #{currentUserRank}
                    <span className="text-gray-500 text-lg font-normal ml-1">
                      из {displayData.length}
                    </span>
                  </p>
                  {currentUserChange !== null && currentUserChange !== 0 && (
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                        currentUserChange > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {currentUserChange > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          <span>+{currentUserChange}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4" />
                          <span>{currentUserChange}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-xs sm:text-sm">Баллы</p>
                <div className="flex items-center gap-1 text-yellow-400 text-lg sm:text-xl font-bold">
                  <Star className="w-5 h-5" />
                  {currentStudent.points}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs sm:text-sm">Решено</p>
                <div className="flex items-center gap-1 text-green-400 text-lg sm:text-xl font-bold">
                  <Code className="w-5 h-5" />
                  {currentStudent.completedProblems.length}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs sm:text-sm">Серия</p>
                <div className="flex items-center gap-1 text-orange-400 text-lg sm:text-xl font-bold">
                  <Flame className="w-5 h-5" />
                  {currentStudent.streakDays}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-gray-400 whitespace-nowrap">Класс:</span>
          <div className="flex gap-2">
            {[7, 8, 9, 10, 'all'].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade as number | 'all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedGrade === grade
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
              >
                {grade === 'all' ? 'Все' : `${grade} класс`}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {displayData.length >= 3 && (
          <div className="flex justify-center items-end gap-2 sm:gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="mb-2">{getAvatar(displayData[1], 'md')}</div>
              <div className="bg-gradient-to-b from-gray-400/20 to-gray-500/10 rounded-t-lg p-3 sm:p-4 w-20 sm:w-28 h-24 sm:h-28 flex flex-col items-center justify-end border border-gray-400/30">
                <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mb-1" />
                <p className="text-xs sm:text-sm text-gray-300 font-medium text-center truncate w-full">
                  {displayData[1].name.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-400">{displayData[1].points} pts</p>
                {getRankChangeDisplay(displayData[1].change)}
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-4">
              <div className="mb-2 relative">
                {getAvatar(displayData[0], 'lg')}
                <Crown className="w-6 h-6 text-yellow-400 absolute -top-3 left-1/2 -translate-x-1/2" />
              </div>
              <div className="bg-gradient-to-b from-yellow-500/20 to-amber-500/10 rounded-t-lg p-3 sm:p-4 w-24 sm:w-32 h-32 sm:h-36 flex flex-col items-center justify-end border border-yellow-500/40 shadow-lg shadow-yellow-500/10">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mb-1" />
                <p className="text-sm sm:text-base text-yellow-300 font-bold text-center truncate w-full">
                  {displayData[0].name.split(' ')[0]}
                </p>
                <p className="text-xs sm:text-sm text-yellow-400">{displayData[0].points} pts</p>
                {getRankChangeDisplay(displayData[0].change)}
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="mb-2">{getAvatar(displayData[2], 'md')}</div>
              <div className="bg-gradient-to-b from-amber-600/20 to-orange-500/10 rounded-t-lg p-3 sm:p-4 w-20 sm:w-28 h-20 sm:h-24 flex flex-col items-center justify-end border border-amber-600/30">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mb-1" />
                <p className="text-xs sm:text-sm text-amber-400 font-medium text-center truncate w-full">
                  {displayData[2].name.split(' ')[0]}
                </p>
                <p className="text-xs text-amber-500">{displayData[2].points} pts</p>
                {getRankChangeDisplay(displayData[2].change)}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {displayData.map((entry) => {
            const rank = entry.currentRank;
            const isCurrentUser = entry.id === currentStudent.id;

            return (
              <Card
                key={entry.id}
                className={`p-3 sm:p-4 transition-all duration-300 ${getRankBg(rank)} ${
                  isCurrentUser ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank */}
                  <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  {/* Rank Change */}
                  <div className="hidden sm:block">
                    {getRankChangeDisplay(entry.change)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getAvatar(entry, 'sm', isCurrentUser)}
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-blue-400 text-sm">(Вы)</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>{entry.grade} класс</span>
                        <span className="sm:hidden">
                          {entry.change !== null && entry.change !== 0 && (
                            <span
                              className={
                                entry.change > 0 ? 'text-green-400' : 'text-red-400'
                              }
                            >
                              {entry.change > 0 ? `+${entry.change}` : entry.change}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-green-400">
                      <Code className="w-4 h-4" />
                      <span className="font-medium">{entry.completedProblems}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">{entry.streakDays}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 min-w-[60px] sm:min-w-[80px] justify-end">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{entry.points}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {displayData.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Пока нет участников</p>
            <p className="text-gray-500 text-sm">Решай задачи и попади в рейтинг!</p>
          </div>
        )}
      </div>
    </div>
  );
}
