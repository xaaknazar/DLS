import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Student, Submission, Problem, Topic } from '@/types';
import { mockStudents } from '@/data/students';
import { topics as initialTopics } from '@/data/topics';
import { problems as initialProblems } from '@/data/problems';

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
  resetStudentProgress: (studentId: string) => void;

  // Topics & Problems (editable)
  topics: Topic[];
  problems: Problem[];
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  addTopic: (topic: Topic) => void;
  deleteTopic: (topicId: string) => void;
  updateProblem: (problemId: string, updates: Partial<Problem>) => void;
  addProblem: (problem: Problem) => void;
  deleteProblem: (problemId: string) => void;

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
          const student = get().students.find(
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
        set((state) => {
          const updatedStudents = state.students.map((s) =>
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
          );

          // Also update user if it's the logged in student
          const updatedUser = state.user?.id === studentId
            ? updatedStudents.find(s => s.id === studentId)
            : state.user;

          return {
            students: updatedStudents,
            user: updatedUser || state.user,
          };
        });
      },

      resetStudentProgress: (studentId: string) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, completedProblems: [], points: 0 }
              : s
          ),
        }));
      },

      // Topics & Problems
      topics: initialTopics,
      problems: initialProblems,

      updateTopic: (topicId: string, updates: Partial<Topic>) => {
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId ? { ...t, ...updates } : t
          ),
        }));
      },

      addTopic: (topic: Topic) => {
        set((state) => ({
          topics: [...state.topics, topic],
        }));
      },

      deleteTopic: (topicId: string) => {
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== topicId),
          problems: state.problems.filter((p) => p.topicId !== topicId),
        }));
      },

      updateProblem: (problemId: string, updates: Partial<Problem>) => {
        set((state) => ({
          problems: state.problems.map((p) =>
            p.id === problemId ? { ...p, ...updates } : p
          ),
        }));
      },

      addProblem: (problem: Problem) => {
        set((state) => ({
          problems: [...state.problems, problem],
        }));
      },

      deleteProblem: (problemId: string) => {
        set((state) => ({
          problems: state.problems.filter((p) => p.id !== problemId),
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
      name: 'dls-it-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        students: state.students,
        submissions: state.submissions,
        topics: state.topics,
        problems: state.problems,
      }),
    }
  )
);

// Helper functions that use store data
export const getTopicsByGrade = (grade: number): Topic[] => {
  return useStore.getState().topics.filter(topic => topic.grade === grade).sort((a, b) => a.order - b.order);
};

export const getTopicById = (id: string): Topic | undefined => {
  return useStore.getState().topics.find(topic => topic.id === id);
};

export const getProblemsByTopic = (topicId: string): Problem[] => {
  return useStore.getState().problems.filter(p => p.topicId === topicId).sort((a, b) => a.order - b.order);
};

export const getProblemById = (id: string): Problem | undefined => {
  return useStore.getState().problems.find(p => p.id === id);
};

export const getProblemsByGrade = (grade: number): Problem[] => {
  return useStore.getState().problems.filter(p => p.grade === grade);
};
