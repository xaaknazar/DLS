import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Student, Submission, Problem } from '@/types';
import { mockStudents } from '@/data/students';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Students data
  students: Student[];
  getStudentsByGrade: (grade: number) => Student[];
  updateStudentProgress: (studentId: string, problemId: string, points: number) => void;

  // Submissions
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
  getSubmissionsByStudent: (studentId: string) => Submission[];
  getSubmissionsByProblem: (problemId: string) => Submission[];

  // UI State
  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        // Teacher login
        if (email === 'teacher@school.edu' && password === 'teacher123') {
          set({
            user: {
              id: 'teacher-1',
              name: 'Учитель Информатики',
              email: 'teacher@school.edu',
              role: 'teacher',
              createdAt: new Date(),
            },
            isAuthenticated: true,
          });
          return true;
        }

        // Student login (format: student{grade}_{num}@school.edu)
        const studentMatch = email.match(/student(\d+)_(\d+)@school\.edu/);
        if (studentMatch && password === 'student123') {
          const grade = parseInt(studentMatch[1]);
          const num = parseInt(studentMatch[2]);
          const student = mockStudents.find(
            s => s.grade === grade && s.id === `student-${grade}-${num}`
          );
          if (student) {
            set({
              user: student,
              isAuthenticated: true,
            });
            return true;
          }
        }

        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Students
      students: mockStudents,

      getStudentsByGrade: (grade: number) => {
        return get().students.filter(s => s.grade === grade);
      },

      updateStudentProgress: (studentId: string, problemId: string, points: number) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  completedProblems: s.completedProblems.includes(problemId)
                    ? s.completedProblems
                    : [...s.completedProblems, problemId],
                  points: s.completedProblems.includes(problemId)
                    ? s.points
                    : s.points + points,
                  lastActiveAt: new Date(),
                }
              : s
          ),
        }));
      },

      // Submissions
      submissions: [],

      addSubmission: (submission: Submission) => {
        set((state) => ({
          submissions: [submission, ...state.submissions],
        }));
      },

      getSubmissionsByStudent: (studentId: string) => {
        return get().submissions.filter(s => s.studentId === studentId);
      },

      getSubmissionsByProblem: (problemId: string) => {
        return get().submissions.filter(s => s.problemId === problemId);
      },

      // UI
      selectedGrade: 7,
      setSelectedGrade: (grade: number) => set({ selectedGrade: grade }),
    }),
    {
      name: 'python-learning-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        students: state.students,
        submissions: state.submissions,
      }),
    }
  )
);
