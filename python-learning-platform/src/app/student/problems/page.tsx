'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Student, Difficulty } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getProblemsByGrade, getTopicById } from '@/lib/store';
import { getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import Link from 'next/link';
import {
  ChevronRight,
  CheckCircle,
  Star,
  Filter,
  Search,
} from 'lucide-react';

export default function ProblemsPage() {
  const { user } = useStore();
  const student = user as Student;
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [status, setStatus] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [search, setSearch] = useState('');

  if (!student) return null;

  const allProblems = getProblemsByGrade(student.grade);

  const filteredProblems = allProblems.filter((problem) => {
    const matchesDifficulty =
      difficulty === 'all' || problem.difficulty === difficulty;
    const isSolved = student.completedProblems.includes(problem.id);
    const matchesStatus =
      status === 'all' ||
      (status === 'solved' && isSolved) ||
      (status === 'unsolved' && !isSolved);
    const matchesSearch =
      search === '' ||
      problem.titleRu.toLowerCase().includes(search.toLowerCase()) ||
      problem.descriptionRu.toLowerCase().includes(search.toLowerCase());

    return matchesDifficulty && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Все задачи"
        subtitle={`${allProblems.length} задач для ${student.grade} класса`}
      />

      <div className="p-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск задач..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все сложности</option>
                <option value="easy">Легко</option>
                <option value="medium">Средне</option>
                <option value="hard">Сложно</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | 'solved' | 'unsolved')}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="solved">Решённые</option>
              <option value="unsolved">Нерешённые</option>
            </select>
          </div>
        </Card>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-400">Задачи не найдены</p>
            </Card>
          ) : (
            filteredProblems.map((problem) => {
              const isCompleted = student.completedProblems.includes(problem.id);
              const topic = getTopicById(problem.topicId);

              return (
                <Link key={problem.id} href={`/student/problems/${problem.id}`}>
                  <Card variant="interactive" className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isCompleted ? 'bg-green-500/10' : 'bg-gray-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <span className="text-gray-400 font-mono text-sm">
                              #{problem.order}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">
                              {problem.titleRu}
                            </h3>
                            {topic && (
                              <Badge variant="default" size="sm">
                                {topic.titleRu}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                            {problem.descriptionRu}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge
                          className={getDifficultyColor(problem.difficulty)}
                          size="sm"
                        >
                          {getDifficultyLabel(problem.difficulty)}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {problem.points}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
