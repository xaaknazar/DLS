'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronRight,
  Star,
  Code,
  Flame,
  Clock,
  SortAsc,
  SortDesc,
} from 'lucide-react';

type SortField = 'name' | 'points' | 'solved' | 'lastActive';
type SortOrder = 'asc' | 'desc';

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const initialGrade = searchParams.get('grade');

  const { students, problems } = useStore();
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(
    initialGrade ? parseInt(initialGrade) : 'all'
  );
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredStudents = students
    .filter((s) => {
      const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
      const matchesSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      return matchesGrade && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'solved':
          comparison = a.completedProblems.length - b.completedProblems.length;
          break;
        case 'lastActive':
          comparison =
            new Date(a.lastActiveAt).getTime() -
            new Date(b.lastActiveAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Ученики"
        subtitle={`${students.length} учеников в системе`}
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
                placeholder="Поиск по имени или email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              {['all', 7, 8, 9, 10].map((grade) => (
                <button
                  key={grade}
                  onClick={() =>
                    setSelectedGrade(grade === 'all' ? 'all' : (grade as number))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedGrade === grade
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {grade === 'all' ? 'Все' : `${grade} кл`}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Table Header */}
        <div className="bg-gray-800/50 rounded-t-xl p-4 border border-gray-700 border-b-0">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
            <div
              className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-white"
              onClick={() => toggleSort('name')}
            >
              Ученик <SortIcon field="name" />
            </div>
            <div className="col-span-2 text-center">Класс</div>
            <div
              className="col-span-2 flex items-center justify-center gap-1 cursor-pointer hover:text-white"
              onClick={() => toggleSort('points')}
            >
              Баллы <SortIcon field="points" />
            </div>
            <div
              className="col-span-2 flex items-center justify-center gap-1 cursor-pointer hover:text-white"
              onClick={() => toggleSort('solved')}
            >
              Решено <SortIcon field="solved" />
            </div>
            <div
              className="col-span-2 flex items-center justify-center gap-1 cursor-pointer hover:text-white"
              onClick={() => toggleSort('lastActive')}
            >
              Активность <SortIcon field="lastActive" />
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="border border-gray-700 rounded-b-xl overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Ученики не найдены
            </div>
          ) : (
            filteredStudents.map((student, index) => {
              const gradeProblems = problems.filter(
                (p) => p.grades.includes(student.grade)
              );
              const progress =
                (student.completedProblems.length / Math.max(gradeProblems.length, 1)) * 100;

              return (
                <Link key={student.id} href={`/teacher/students/${student.id}`}>
                  <div
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/50 transition-colors ${
                      index !== filteredStudents.length - 1
                        ? 'border-b border-gray-700/50'
                        : ''
                    }`}
                  >
                    {/* Student Info */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-gray-400 text-sm">{student.email}</p>
                      </div>
                    </div>

                    {/* Grade */}
                    <div className="col-span-2 text-center">
                      <Badge variant="default">{student.grade} класс</Badge>
                    </div>

                    {/* Points */}
                    <div className="col-span-2 flex items-center justify-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{student.points}</span>
                    </div>

                    {/* Solved */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <Code className="w-4 h-4 text-green-400" />
                        <span className="text-white">
                          {student.completedProblems.length}
                        </span>
                        <span className="text-gray-500">
                          / {gradeProblems.length}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        size="sm"
                        color="green"
                        className="mt-1"
                      />
                    </div>

                    {/* Last Active */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {formatRelativeTime(student.lastActiveAt)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
