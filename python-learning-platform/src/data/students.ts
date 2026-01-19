import { Student } from '@/types';

export const mockStudents: Student[] = [
  // 7 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-7-${i + 1}`,
    name: `Ученик 7-${i + 1}`,
    email: `student7_${i + 1}@school.edu`,
    password: 'student123',
    role: 'student' as const,
    grade: 7,
    completedProblems: [] as string[],
    points: 0,
    shopPoints: 0,
    achievements: [] as string[],
    streakDays: 0,
    lastActiveAt: new Date(),
    createdAt: new Date('2024-09-01'),
    purchasedItems: [] as string[],
    equippedAvatar: null,
    equippedFrame: null,
  })),

  // 8 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-8-${i + 1}`,
    name: `Ученик 8-${i + 1}`,
    email: `student8_${i + 1}@school.edu`,
    password: 'student123',
    role: 'student' as const,
    grade: 8,
    completedProblems: [] as string[],
    points: 0,
    shopPoints: 0,
    achievements: [] as string[],
    streakDays: 0,
    lastActiveAt: new Date(),
    createdAt: new Date('2024-09-01'),
    purchasedItems: [] as string[],
    equippedAvatar: null,
    equippedFrame: null,
  })),

  // 9 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-9-${i + 1}`,
    name: `Ученик 9-${i + 1}`,
    email: `student9_${i + 1}@school.edu`,
    password: 'student123',
    role: 'student' as const,
    grade: 9,
    completedProblems: [] as string[],
    points: 0,
    shopPoints: 0,
    achievements: [] as string[],
    streakDays: 0,
    lastActiveAt: new Date(),
    createdAt: new Date('2024-09-01'),
    purchasedItems: [] as string[],
    equippedAvatar: null,
    equippedFrame: null,
  })),

  // 10 класс - 20 учеников
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `student-10-${i + 1}`,
    name: `Ученик 10-${i + 1}`,
    email: `student10_${i + 1}@school.edu`,
    password: 'student123',
    role: 'student' as const,
    grade: 10,
    completedProblems: [] as string[],
    points: 0,
    shopPoints: 0,
    achievements: [] as string[],
    streakDays: 0,
    lastActiveAt: new Date(),
    createdAt: new Date('2024-09-01'),
    purchasedItems: [] as string[],
    equippedAvatar: null,
    equippedFrame: null,
  })),
];

export const getStudentsByGrade = (grade: number): Student[] => {
  return mockStudents.filter(s => s.grade === grade);
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(s => s.id === id);
};
