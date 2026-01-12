// User types
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: number; // 7, 8, 9, or 10 for students
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  grade: number;
  completedProblems: string[];
  points: number;
  achievements: string[];
  streakDays: number;
  lastActiveAt: Date;
}

export interface Teacher extends User {
  role: 'teacher';
  classes: number[]; // grades they teach
}

// Topic types
export interface Topic {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  order: number;
  icon: string;
  color: string;
  documentation: string; // Markdown content
  grade: number;
  problemIds: string[];
}

// Problem types
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface Problem {
  id: string;
  topicId: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  difficulty: Difficulty;
  points: number;
  order: number;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
  grade: number;
}

// Submission types
export type SubmissionStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error';

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime: number;
  error?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  studentId: string;
  code: string;
  status: SubmissionStatus;
  testResults: TestResult[];
  passedTests: number;
  totalTests: number;
  executionTime: number;
  submittedAt: Date;
}

// Progress types
export interface StudentProgress {
  topicId: string;
  completedProblems: number;
  totalProblems: number;
  points: number;
  lastSubmission?: Date;
}

export interface StudentStats {
  totalSolved: number;
  totalPoints: number;
  streak: number;
  progressByTopic: StudentProgress[];
  recentSubmissions: Submission[];
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  icon: string;
  color: string;
  requirement: {
    type: 'problems_solved' | 'points_earned' | 'streak' | 'topic_completed' | 'difficulty';
    value: number;
    topicId?: string;
    difficulty?: Difficulty;
  };
  points: number;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  student: Student;
  points: number;
  problemsSolved: number;
}
