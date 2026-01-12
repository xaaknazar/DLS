import { Student } from '@/types';

export const mockStudents: Student[] = [
  // 7 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-7-${i + 1}`,
    name: `Ученик 7-${i + 1}`,
    email: `student7_${i + 1}@school.edu`,
    role: 'student' as const,
    grade: 7,
    completedProblems: generateRandomProblems(7, Math.floor(Math.random() * 15)),
    points: Math.floor(Math.random() * 500),
    achievements: generateRandomAchievements(Math.floor(Math.random() * 5)),
    streakDays: Math.floor(Math.random() * 30),
    lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-09-01'),
  })),

  // 8 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-8-${i + 1}`,
    name: `Ученик 8-${i + 1}`,
    email: `student8_${i + 1}@school.edu`,
    role: 'student' as const,
    grade: 8,
    completedProblems: generateRandomProblems(8, Math.floor(Math.random() * 20)),
    points: Math.floor(Math.random() * 800),
    achievements: generateRandomAchievements(Math.floor(Math.random() * 7)),
    streakDays: Math.floor(Math.random() * 45),
    lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-09-01'),
  })),

  // 9 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-9-${i + 1}`,
    name: `Ученик 9-${i + 1}`,
    email: `student9_${i + 1}@school.edu`,
    role: 'student' as const,
    grade: 9,
    completedProblems: generateRandomProblems(9, Math.floor(Math.random() * 25)),
    points: Math.floor(Math.random() * 1000),
    achievements: generateRandomAchievements(Math.floor(Math.random() * 8)),
    streakDays: Math.floor(Math.random() * 60),
    lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-09-01'),
  })),

  // 10 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-10-${i + 1}`,
    name: `Ученик 10-${i + 1}`,
    email: `student10_${i + 1}@school.edu`,
    role: 'student' as const,
    grade: 10,
    completedProblems: generateRandomProblems(10, Math.floor(Math.random() * 30)),
    points: Math.floor(Math.random() * 1200),
    achievements: generateRandomAchievements(Math.floor(Math.random() * 10)),
    streakDays: Math.floor(Math.random() * 90),
    lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-09-01'),
  })),
];

function generateRandomProblems(grade: number, count: number): string[] {
  const prefixes: Record<number, string[]> = {
    7: ['var', 'dt', 'io', 'op'],
    8: ['cond', 'for', 'while', 'str'],
    9: ['list', 'tuple', 'dict', 'func'],
    10: ['file', 'exc', 'oop', 'oopa'],
  };

  const gradePrefix = prefixes[grade] || ['var'];
  const problems: string[] = [];

  for (let i = 0; i < count; i++) {
    const prefix = gradePrefix[Math.floor(Math.random() * gradePrefix.length)];
    const num = Math.floor(Math.random() * 10) + 1;
    const id = `${prefix}-${num}`;
    if (!problems.includes(id)) {
      problems.push(id);
    }
  }

  return problems;
}

function generateRandomAchievements(count: number): string[] {
  const allAchievements = [
    'first-solve', 'streak-7', 'streak-30', 'points-100', 'points-500',
    'topic-complete', 'all-easy', 'first-hard', 'speed-demon'
  ];

  return allAchievements.slice(0, count);
}

export const getStudentsByGrade = (grade: number): Student[] => {
  return mockStudents.filter(s => s.grade === grade);
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(s => s.id === id);
};
