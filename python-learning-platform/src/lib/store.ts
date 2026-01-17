import { create } from 'zustand';
import { Student, Teacher, Topic, Problem, Submission, Message } from '@/types';
import { achievements } from '@/data/achievements';

// API helper functions
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

interface AppState {
  // Auth
  user: (Student | Teacher) | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Students data
  students: Student[];
  loadStudents: () => Promise<void>;
  updateStudentPoints: (studentId: string, delta: number) => Promise<void>;

  // Topics & Problems
  topics: Topic[];
  problems: Problem[];
  loadTopics: (grade?: number) => Promise<void>;
  loadProblems: (grade?: number, topicId?: string) => Promise<void>;
  createTopic: (topic: Partial<Topic>) => Promise<Topic>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  createProblem: (problem: Partial<Problem>) => Promise<Problem>;
  updateProblem: (id: string, updates: Partial<Problem>) => Promise<void>;
  deleteProblem: (id: string) => Promise<void>;

  // Submissions
  submissions: Submission[];
  loadSubmissions: (studentId?: string, problemId?: string) => Promise<void>;
  createSubmission: (submission: Partial<Submission>) => Promise<Submission>;

  // Messages
  messages: Message[];
  conversations: { studentId: string; unreadCount: number; lastMessage: Message | null }[];
  loadMessages: (userId: string, withUserId: string) => Promise<void>;
  loadConversations: (teacherId: string) => Promise<void>;
  sendMessage: (fromUserId: string, toUserId: string, content: string) => Promise<void>;
  markAsRead: (userId: string, fromUserId: string) => Promise<void>;

  // UI State
  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { user } = await apiCall<{ user: Student | Teacher }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Always trust server data
      set({ user, isAuthenticated: true, isLoading: false });
      // Store in localStorage for persistence
      localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      sessionStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    sessionStorage.removeItem('user');
    // Don't remove localStorage - keep progress saved
  },

  refreshUser: async () => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);

        if (user.role === 'teacher') {
          set({ user, isAuthenticated: true });
          return;
        }

        // For students, always get fresh data from server
        let freshUser: Student;

        try {
          freshUser = await apiCall<Student>(`/api/students/${user.id}`);
        } catch {
          // Server error - use stored session data
          set({ user, isAuthenticated: true });
          return;
        }

        // Always trust server data - update local storage with server data
        set({ user: freshUser, isAuthenticated: true });
        localStorage.setItem(`user_${user.id}`, JSON.stringify(freshUser));
        sessionStorage.setItem('user', JSON.stringify(freshUser));
      } catch {
        // If error, use stored data
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      }
    }
  },

  // Students
  students: [],
  loadStudents: async () => {
    const students = await apiCall<Student[]>('/api/students');
    set({ students });
  },

  updateStudentPoints: async (studentId: string, delta: number) => {
    const student = await apiCall<Student>(`/api/students/${studentId}/points`, {
      method: 'POST',
      body: JSON.stringify({ delta }),
    });
    set((state) => ({
      students: state.students.map((s) => (s.id === studentId ? student : s)),
      user: state.user?.id === studentId ? student : state.user,
    }));
  },

  // Topics & Problems
  topics: [],
  problems: [],

  loadTopics: async (grade?: number) => {
    const url = grade ? `/api/topics?grade=${grade}` : '/api/topics';
    const topics = await apiCall<Topic[]>(url);
    set({ topics });
  },

  loadProblems: async (grade?: number, topicId?: string) => {
    let url = '/api/problems';
    if (topicId) {
      url = `/api/problems?topicId=${topicId}`;
    } else if (grade) {
      url = `/api/problems?grade=${grade}`;
    }
    const problems = await apiCall<Problem[]>(url);
    set({ problems });
  },

  createTopic: async (topic: Partial<Topic>) => {
    const newTopic = await apiCall<Topic>('/api/topics', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
    set((state) => ({ topics: [...state.topics, newTopic] }));
    return newTopic;
  },

  updateTopic: async (id: string, updates: Partial<Topic>) => {
    const topic = await apiCall<Topic>(`/api/topics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? topic : t)),
    }));
  },

  deleteTopic: async (id: string) => {
    await apiCall(`/api/topics/${id}`, { method: 'DELETE' });
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
      problems: state.problems.filter((p) => p.topicId !== id),
    }));
  },

  createProblem: async (problem: Partial<Problem>) => {
    const newProblem = await apiCall<Problem>('/api/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
    set((state) => ({ problems: [...state.problems, newProblem] }));
    return newProblem;
  },

  updateProblem: async (id: string, updates: Partial<Problem>) => {
    const problem = await apiCall<Problem>(`/api/problems/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    set((state) => ({
      problems: state.problems.map((p) => (p.id === id ? problem : p)),
    }));
  },

  deleteProblem: async (id: string) => {
    await apiCall(`/api/problems/${id}`, { method: 'DELETE' });
    set((state) => ({
      problems: state.problems.filter((p) => p.id !== id),
    }));
  },

  // Submissions
  submissions: [],

  loadSubmissions: async (studentId?: string, problemId?: string) => {
    let url = '/api/submissions';
    if (studentId) {
      url = `/api/submissions?studentId=${studentId}`;
    } else if (problemId) {
      url = `/api/submissions?problemId=${problemId}`;
    }
    const submissions = await apiCall<Submission[]>(url);
    set({ submissions });
  },

  createSubmission: async (submission: Partial<Submission>) => {
    const newSubmission = await apiCall<Submission>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
    set((state) => ({ submissions: [newSubmission, ...state.submissions] }));

    // If passed, update student's completed problems in local state and check achievements
    if (submission.status === 'passed' && submission.studentId) {
      const { user, problems } = get();
      if (user && user.id === submission.studentId && 'completedProblems' in user) {
        // Get problem to add its points
        const problem = problems.find(p => p.id === submission.problemId);
        const problemPoints = problem?.points || 0;

        const newCompletedProblems = user.completedProblems.includes(submission.problemId!)
          ? user.completedProblems
          : [...user.completedProblems, submission.problemId!];

        const wasNewProblem = !user.completedProblems.includes(submission.problemId!);
        const newPoints = wasNewProblem ? user.points + problemPoints : user.points;

        // Check and award achievements
        const currentAchievements = [...user.achievements];
        let bonusPoints = 0;

        for (const achievement of achievements) {
          if (currentAchievements.includes(achievement.id)) continue;

          let earned = false;
          switch (achievement.requirement.type) {
            case 'problems_solved':
              earned = newCompletedProblems.length >= achievement.requirement.value;
              break;
            case 'points_earned':
              earned = newPoints >= achievement.requirement.value;
              break;
            case 'streak':
              earned = user.streakDays >= achievement.requirement.value;
              break;
            case 'difficulty':
              if (achievement.requirement.difficulty) {
                const hardProblems = problems.filter(p =>
                  p.difficulty === achievement.requirement.difficulty &&
                  newCompletedProblems.includes(p.id)
                );
                earned = hardProblems.length >= achievement.requirement.value;
              }
              break;
            case 'topic_completed':
              // Check if any topic is fully completed
              const { topics } = get();
              for (const topic of topics) {
                const topicProblems = problems.filter(p => p.topicId === topic.id);
                const completedInTopic = topicProblems.filter(p => newCompletedProblems.includes(p.id));
                if (topicProblems.length > 0 && completedInTopic.length === topicProblems.length) {
                  earned = true;
                  break;
                }
              }
              break;
          }

          if (earned) {
            currentAchievements.push(achievement.id);
            bonusPoints += achievement.points;
          }
        }

        const updatedUser = {
          ...user,
          completedProblems: newCompletedProblems,
          points: newPoints + bonusPoints,
          achievements: currentAchievements,
        };
        set({ user: updatedUser as Student });
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser));

        // Also update on server
        try {
          await apiCall(`/api/students/${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              points: newPoints + bonusPoints,
              completedProblems: newCompletedProblems,
              achievements: currentAchievements,
            }),
          });
        } catch (e) {
          console.error('Failed to save progress to server:', e);
        }
      }
    }

    return newSubmission;
  },

  // Messages
  messages: [],
  conversations: [],

  loadMessages: async (userId: string, withUserId: string) => {
    const messages = await apiCall<Message[]>(`/api/messages?userId=${userId}&withUserId=${withUserId}`);
    set({ messages });
  },

  loadConversations: async (teacherId: string) => {
    const conversations = await apiCall<{ studentId: string; unreadCount: number; lastMessage: Message | null }[]>(
      `/api/messages?conversations=true&userId=${teacherId}`
    );
    set({ conversations });
  },

  sendMessage: async (fromUserId: string, toUserId: string, content: string) => {
    const message = await apiCall<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId, content }),
    });
    set((state) => ({ messages: [...state.messages, message] }));
  },

  markAsRead: async (userId: string, fromUserId: string) => {
    await apiCall('/api/messages', {
      method: 'PATCH',
      body: JSON.stringify({ userId, fromUserId }),
    });
    set((state) => ({
      messages: state.messages.map((m) =>
        m.toUserId === userId && m.fromUserId === fromUserId ? { ...m, isRead: true } : m
      ),
    }));
  },

  // UI
  selectedGrade: 7,
  setSelectedGrade: (grade: number) => set({ selectedGrade: grade }),
}));

// Helper functions for accessing data (for components that need sync access)
export const getTopicsByGrade = (grade: number): Topic[] => {
  return useStore.getState().topics.filter((topic) => topic.grades.includes(grade)).sort((a, b) => a.order - b.order);
};

export const getTopicById = (id: string): Topic | undefined => {
  return useStore.getState().topics.find((topic) => topic.id === id);
};

export const getProblemsByTopic = (topicId: string): Problem[] => {
  return useStore.getState().problems.filter((p) => p.topicId === topicId).sort((a, b) => a.order - b.order);
};

export const getProblemById = (id: string): Problem | undefined => {
  return useStore.getState().problems.find((p) => p.id === id);
};

export const getProblemsByGrade = (grade: number): Problem[] => {
  return useStore.getState().problems.filter((p) => p.grades.includes(grade));
};
