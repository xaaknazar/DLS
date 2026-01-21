// User types
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed password
  role: UserRole;
  grade?: number; // 7, 8, 9, or 10 for students
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  grade: number;
  completedProblems: string[];
  points: number;           // Рейтинговые баллы (не уменьшаются при покупках)
  shopPoints: number;       // Баллы магазина (тратятся при покупках)
  achievements: string[];
  streakDays: number;
  lastActiveAt: Date;
  // Shop items
  purchasedItems: string[];
  equippedAvatar: string | null;
  equippedFrame: string | null;
  // Rank tracking
  previousRank?: number;    // Предыдущая позиция в рейтинге (для отображения изменений)
  rankUpdatedAt?: Date;     // Когда последний раз обновлялся рейтинг
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
  grades: number[]; // Now supports multiple grades
  problemIds: string[];
  isLocked?: boolean; // If true, students cannot solve problems in this topic
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

// Expected solution uniqueness level for cheat detection
// 'low' - Simple task, all correct solutions will be very similar (e.g., "Hello World")
// 'medium' - Moderate variations expected (default)
// 'high' - Many different approaches possible
export type SolutionUniqueness = 'low' | 'medium' | 'high';

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
  grades: number[]; // Now supports multiple grades
  expectedUniqueness?: SolutionUniqueness; // For cheat detection - if not set, auto-detected from solution length
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
  metadata?: SubmissionMetadata; // Behavior tracking for cheat detection
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

// Chat/Message types
export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  studentId: string;
  teacherId: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isImportant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== CHEAT DETECTION TYPES ====================

// Types of suspicious activity flags
export type CheatFlagType =
  | 'code_similarity'      // Code is very similar to another student's
  | 'fast_solution'        // Solved too quickly for difficulty level
  | 'copy_paste'           // Detected copy-paste behavior
  | 'advanced_code'        // Uses constructs not yet taught
  | 'style_mismatch'       // Sudden change in coding style
  | 'ai_patterns'          // Patterns suggesting AI-generated code
  | 'english_comments'     // English comments when learning in Russian
  | 'perfect_format';      // Suspiciously perfect formatting

// Severity levels for flags
export type CheatSeverity = 'low' | 'medium' | 'high' | 'critical';

// A single cheat flag on a submission
export interface CheatFlag {
  type: CheatFlagType;
  severity: CheatSeverity;
  description: string;
  descriptionRu: string;
  confidence: number; // 0-100 percentage
  details?: {
    similarStudentId?: string;
    similarSubmissionId?: string;
    similarityScore?: number;
    expectedTime?: number;
    actualTime?: number;
    flaggedPatterns?: string[];
  };
}

// Metadata collected during code submission
export interface SubmissionMetadata {
  // Timing data
  startedAt?: Date;           // When student started working on problem
  timeSpentSeconds?: number;  // Time spent before submission
  keystrokeCount?: number;    // Number of keystrokes (if tracked)
  pasteCount?: number;        // Number of paste events

  // Code changes tracking
  codeSnapshots?: {
    timestamp: Date;
    code: string;
  }[];

  // Browser/environment info
  userAgent?: string;
  tabSwitchCount?: number;    // Times switched away from tab
}

// Extended submission with cheat detection data
export interface SubmissionWithCheatData extends Submission {
  metadata?: SubmissionMetadata;
  cheatFlags?: CheatFlag[];
  cheatScore?: number;        // Overall suspicion score 0-100
  reviewedByTeacher?: boolean;
  reviewedAt?: Date;
  reviewNotes?: string;
}

// Code similarity match between two submissions
export interface SimilarityMatch {
  submissionId1: string;
  submissionId2: string;
  studentId1: string;
  studentId2: string;
  problemId: string;
  similarityScore: number;    // 0-100 percentage
  matchedTokens: number;
  totalTokens: number;
  flaggedAt: Date;
}

// Aggregated cheat report for a student
export interface StudentCheatReport {
  studentId: string;
  studentName: string;
  grade: number;
  totalFlags: number;
  flagsByType: Record<CheatFlagType, number>;
  averageCheatScore: number;
  highSeverityCount: number;
  recentFlags: {
    submissionId: string;
    problemId: string;
    problemTitle: string;
    flags: CheatFlag[];
    submittedAt: Date;
  }[];
  similarityMatches: SimilarityMatch[];
}

// Dashboard summary for teacher
export interface CheatDetectionSummary {
  totalSuspiciousSubmissions: number;
  totalHighSeverity: number;
  studentsWithFlags: number;
  topFlaggedStudents: {
    studentId: string;
    studentName: string;
    grade: number;
    flagCount: number;
    averageScore: number;
  }[];
  recentSimilarityMatches: SimilarityMatch[];
  flagDistribution: Record<CheatFlagType, number>;
}
