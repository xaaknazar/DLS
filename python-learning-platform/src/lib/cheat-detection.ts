/**
 * Cheat Detection Service
 * Analyzes submissions for plagiarism and AI-generated code
 */

import {
  CheatFlag,
  CheatFlagType,
  CheatSeverity,
  SimilarityMatch,
  Submission,
  SubmissionMetadata,
  SubmissionWithCheatData,
  StudentCheatReport,
  CheatDetectionSummary,
  Problem,
  Student,
  SolutionUniqueness,
} from '@/types';

// ==================== SOLUTION UNIQUENESS ====================

/**
 * Determine expected solution uniqueness for a problem
 * If not set on the problem, auto-detect based on solution characteristics
 */
export function getExpectedUniqueness(problem: Problem): SolutionUniqueness {
  // Use explicit setting if available
  if (problem.expectedUniqueness) {
    return problem.expectedUniqueness;
  }

  // Auto-detect based on solution characteristics
  const solution = problem.solution;
  const lines = solution.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  const codeLength = solution.replace(/\s+/g, '').length;

  // Very short solutions (< 50 chars or < 3 lines) are likely trivial
  if (codeLength < 50 || lines.length < 3) {
    return 'low';
  }

  // Short solutions (< 100 chars or < 5 lines) have medium uniqueness
  if (codeLength < 100 || lines.length < 5) {
    return 'medium';
  }

  // Check for task complexity indicators
  const hasLoops = /\b(for|while)\b/.test(solution);
  const hasFunctions = /\bdef\s+\w+/.test(solution);
  const hasConditions = /\bif\b/.test(solution);
  const hasDataStructures = /\b(list|dict|set)\s*\(/.test(solution) || /\[.+\]/.test(solution);

  // Count complexity indicators
  const complexityScore = [hasLoops, hasFunctions, hasConditions, hasDataStructures]
    .filter(Boolean).length;

  if (complexityScore >= 3) {
    return 'high';
  } else if (complexityScore >= 1) {
    return 'medium';
  }

  return 'medium';
}

/**
 * Get similarity thresholds based on expected uniqueness
 */
export function getSimilarityThresholds(uniqueness: SolutionUniqueness): {
  criticalThreshold: number;
  highThreshold: number;
  scoreMultiplier: number;
} {
  switch (uniqueness) {
    case 'low':
      // For trivial tasks, only flag exact copies
      return {
        criticalThreshold: 98,  // Almost exact copy
        highThreshold: 95,      // Very high similarity
        scoreMultiplier: 0.3,   // Reduce cheat score impact
      };
    case 'medium':
      return {
        criticalThreshold: 92,
        highThreshold: 80,
        scoreMultiplier: 0.7,
      };
    case 'high':
    default:
      return {
        criticalThreshold: 90,
        highThreshold: 75,
        scoreMultiplier: 1.0,
      };
  }
}

// ==================== CODE TOKENIZATION ====================

/**
 * Tokenize Python code for comparison
 * Removes whitespace, comments, and normalizes variable names
 */
function tokenizePythonCode(code: string): string[] {
  // Remove comments
  let cleanCode = code
    .split('\n')
    .map(line => {
      const commentIndex = line.indexOf('#');
      return commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    })
    .join('\n');

  // Remove string literals (replace with placeholder)
  cleanCode = cleanCode.replace(/"([^"\\]|\\.)*"/g, 'STR');
  cleanCode = cleanCode.replace(/'([^'\\]|\\.)*'/g, 'STR');
  cleanCode = cleanCode.replace(/"""[\s\S]*?"""/g, 'STR');
  cleanCode = cleanCode.replace(/'''[\s\S]*?'''/g, 'STR');

  // Normalize whitespace
  cleanCode = cleanCode.replace(/\s+/g, ' ').trim();

  // Python keywords and operators to keep
  const keywords = [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
    'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'raise',
    'break', 'continue', 'pass', 'lambda', 'and', 'or', 'not', 'in', 'is',
    'True', 'False', 'None', 'print', 'input', 'range', 'len', 'int', 'str',
    'float', 'list', 'dict', 'set', 'tuple', 'open', 'read', 'write',
  ];

  const operators = [
    '==', '!=', '<=', '>=', '<', '>', '=', '+', '-', '*', '/', '//', '%', '**',
    '+=', '-=', '*=', '/=', '(', ')', '[', ']', '{', '}', ':', ',', '.',
  ];

  // Tokenize
  const tokens: string[] = [];
  let remaining = cleanCode;

  while (remaining.length > 0) {
    remaining = remaining.trimStart();
    if (!remaining) break;

    // Check for operators
    let matched = false;
    for (const op of operators) {
      if (remaining.startsWith(op)) {
        tokens.push(op);
        remaining = remaining.slice(op.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Check for keywords and identifiers
    const wordMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (wordMatch) {
      const word = wordMatch[1];
      if (keywords.includes(word)) {
        tokens.push(word);
      } else {
        // Normalize variable names to VAR
        tokens.push('VAR');
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    // Check for numbers
    const numMatch = remaining.match(/^(\d+\.?\d*)/);
    if (numMatch) {
      tokens.push('NUM');
      remaining = remaining.slice(numMatch[1].length);
      continue;
    }

    // Skip unknown character
    remaining = remaining.slice(1);
  }

  return tokens;
}

/**
 * Calculate Jaccard similarity between two token arrays
 */
function jaccardSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 && tokens2.length === 0) return 1;
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Use n-grams for better comparison (trigrams)
  const ngrams1 = getNgrams(tokens1, 3);
  const ngrams2 = getNgrams(tokens2, 3);

  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);

  let intersection = 0;
  for (const ngram of set1) {
    if (set2.has(ngram)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : (intersection / union) * 100;
}

function getNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join('|'));
  }
  return ngrams;
}

/**
 * Calculate Levenshtein distance for additional comparison
 */
function levenshteinSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0 && len2 === 0) return 100;
  if (len1 === 0 || len2 === 0) return 0;

  // Limit for performance
  if (len1 > 1000 || len2 > 1000) {
    // Use substring comparison for very long strings
    const minLen = Math.min(len1, len2, 1000);
    return levenshteinSimilarity(str1.slice(0, minLen), str2.slice(0, minLen));
  }

  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return ((maxLen - distance) / maxLen) * 100;
}

// ==================== SIMILARITY DETECTION ====================

/**
 * Compare two submissions and return similarity score
 */
export function compareSubmissions(code1: string, code2: string): {
  similarityScore: number;
  matchedTokens: number;
  totalTokens: number;
} {
  const tokens1 = tokenizePythonCode(code1);
  const tokens2 = tokenizePythonCode(code2);

  const jaccardScore = jaccardSimilarity(tokens1, tokens2);

  // Also check raw code similarity (catches direct copy-paste)
  const normalizedCode1 = code1.replace(/\s+/g, ' ').trim().toLowerCase();
  const normalizedCode2 = code2.replace(/\s+/g, ' ').trim().toLowerCase();
  const rawSimilarity = levenshteinSimilarity(normalizedCode1, normalizedCode2);

  // Combined score (weighted average)
  const similarityScore = Math.max(jaccardScore, rawSimilarity * 0.9);

  const totalTokens = Math.max(tokens1.length, tokens2.length);
  const matchedTokens = Math.round((similarityScore / 100) * totalTokens);

  return {
    similarityScore: Math.round(similarityScore * 10) / 10,
    matchedTokens,
    totalTokens,
  };
}

/**
 * Find all similar submissions for a problem
 * Uses dynamic thresholds based on problem uniqueness
 */
export function findSimilarSubmissions(
  submissions: Submission[],
  problems: Problem[],
  defaultThreshold: number = 70 // Default 70% similarity threshold
): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];
  const passedSubmissions = submissions.filter(s => s.status === 'passed');
  const problemMap = new Map(problems.map(p => [p.id, p]));

  // Group by problem
  const byProblem = new Map<string, Submission[]>();
  for (const sub of passedSubmissions) {
    const list = byProblem.get(sub.problemId) || [];
    list.push(sub);
    byProblem.set(sub.problemId, list);
  }

  // Compare within each problem
  for (const [problemId, problemSubmissions] of byProblem) {
    // Get problem-specific threshold
    const problem = problemMap.get(problemId);
    let threshold = defaultThreshold;

    if (problem) {
      const uniqueness = getExpectedUniqueness(problem);
      const thresholds = getSimilarityThresholds(uniqueness);
      // Use high threshold as minimum for flagging similarity
      threshold = thresholds.highThreshold;
    }

    // Only keep one submission per student (latest)
    const byStudent = new Map<string, Submission>();
    for (const sub of problemSubmissions) {
      const existing = byStudent.get(sub.studentId);
      if (!existing || new Date(sub.submittedAt) > new Date(existing.submittedAt)) {
        byStudent.set(sub.studentId, sub);
      }
    }

    const uniqueSubmissions = Array.from(byStudent.values());

    // Compare all pairs
    for (let i = 0; i < uniqueSubmissions.length; i++) {
      for (let j = i + 1; j < uniqueSubmissions.length; j++) {
        const sub1 = uniqueSubmissions[i];
        const sub2 = uniqueSubmissions[j];

        const comparison = compareSubmissions(sub1.code, sub2.code);

        if (comparison.similarityScore >= threshold) {
          matches.push({
            submissionId1: sub1.id,
            submissionId2: sub2.id,
            studentId1: sub1.studentId,
            studentId2: sub2.studentId,
            problemId,
            similarityScore: comparison.similarityScore,
            matchedTokens: comparison.matchedTokens,
            totalTokens: comparison.totalTokens,
            flaggedAt: new Date(),
          });
        }
      }
    }
  }

  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}

// ==================== AI DETECTION ====================

// Patterns that suggest AI-generated code
const AI_PATTERNS = {
  // Perfect docstrings and comments
  perfectDocstring: /^def\s+\w+\([^)]*\):\s*\n\s*"""[\s\S]+?"""/m,
  typeHints: /def\s+\w+\([^)]*:\s*(int|str|float|bool|list|dict)/,

  // Advanced constructs students unlikely know
  listComprehension: /\[.+\s+for\s+.+\s+in\s+.+\]/,
  dictComprehension: /\{.+:\s*.+\s+for\s+.+\s+in\s+.+\}/,
  setComprehension: /\{.+\s+for\s+.+\s+in\s+.+\}/,
  generatorExpression: /\(.+\s+for\s+.+\s+in\s+.+\)/,
  lambdaFunction: /lambda\s+\w+\s*:/,
  walrusOperator: /:=/,
  fString: /f["'][^"']*\{[^}]+\}[^"']*["']/,

  // Professional patterns
  errorHandling: /try:\s*[\s\S]+?except\s+\w+(\s+as\s+\w+)?:/,
  withStatement: /with\s+open\(/,
  decorators: /@\w+/,

  // English comments
  englishComments: /#\s*[A-Za-z]{3,}\s+[A-Za-z]{3,}/,
};

// Expected knowledge by topic (what students should/shouldn't know)
const TOPIC_KNOWLEDGE: Record<string, { allowed: string[]; suspicious: string[] }> = {
  'variables': {
    allowed: ['print', 'input', '=', '+', '-', '*', '/'],
    suspicious: ['def', 'class', 'for', 'while', 'if', 'list', 'dict'],
  },
  'conditions': {
    allowed: ['print', 'input', 'if', 'elif', 'else', '==', '!=', '<', '>', 'and', 'or', 'not'],
    suspicious: ['def', 'class', 'for', 'while', 'list', 'dict', 'lambda'],
  },
  'loops': {
    allowed: ['print', 'input', 'if', 'elif', 'else', 'for', 'while', 'range', 'break', 'continue'],
    suspicious: ['def', 'class', 'lambda', 'dict', 'set'],
  },
  'functions': {
    allowed: ['def', 'return', 'print', 'input', 'if', 'for', 'while'],
    suspicious: ['class', 'lambda', 'yield', 'async', 'await'],
  },
};

/**
 * Detect AI-generated code patterns
 */
export function detectAIPatterns(code: string, topicId?: string): {
  isLikelyAI: boolean;
  confidence: number;
  patterns: string[];
} {
  const patterns: string[] = [];
  let score = 0;

  // Check for AI patterns
  if (AI_PATTERNS.perfectDocstring.test(code)) {
    patterns.push('Perfect docstring');
    score += 20;
  }
  if (AI_PATTERNS.typeHints.test(code)) {
    patterns.push('Type hints');
    score += 15;
  }
  if (AI_PATTERNS.listComprehension.test(code)) {
    patterns.push('List comprehension');
    score += 10;
  }
  if (AI_PATTERNS.lambdaFunction.test(code)) {
    patterns.push('Lambda function');
    score += 15;
  }
  if (AI_PATTERNS.walrusOperator.test(code)) {
    patterns.push('Walrus operator (:=)');
    score += 25;
  }
  if (AI_PATTERNS.errorHandling.test(code)) {
    patterns.push('Try/except blocks');
    score += 10;
  }
  if (AI_PATTERNS.decorators.test(code)) {
    patterns.push('Decorators');
    score += 20;
  }

  // Check for English comments
  const comments = code.match(/#.*/g) || [];
  const englishComments = comments.filter(c => /[A-Za-z]{4,}/.test(c) && !/[а-яА-ЯёЁ]/.test(c));
  if (englishComments.length > 0) {
    patterns.push('English comments');
    score += 15;
  }

  // Check topic-specific knowledge
  if (topicId) {
    const knowledge = TOPIC_KNOWLEDGE[topicId];
    if (knowledge) {
      for (const suspicious of knowledge.suspicious) {
        const regex = new RegExp(`\\b${suspicious}\\b`);
        if (regex.test(code)) {
          patterns.push(`Uses "${suspicious}" (not yet taught)`);
          score += 15;
        }
      }
    }
  }

  // Perfect formatting check
  const lines = code.split('\n');
  const hasConsistentIndent = lines.every(line =>
    line.trim() === '' || /^(\s{4})*\S/.test(line) || /^\S/.test(line)
  );
  if (hasConsistentIndent && lines.length > 5) {
    // Check if indentation is suspiciously perfect (4-space indent consistently)
    const indentedLines = lines.filter(l => l.startsWith('    '));
    if (indentedLines.length > 3 && indentedLines.every(l => /^\s{4}(?!\s{1,3}\S)/.test(l))) {
      patterns.push('Suspiciously perfect formatting');
      score += 10;
    }
  }

  return {
    isLikelyAI: score >= 40,
    confidence: Math.min(score, 100),
    patterns,
  };
}

// ==================== TIMING ANALYSIS ====================

// Expected time ranges in seconds for each difficulty
const EXPECTED_TIME: Record<string, { min: number; expected: number; max: number }> = {
  'easy': { min: 60, expected: 180, max: 600 },      // 1-10 min
  'medium': { min: 180, expected: 480, max: 1200 },  // 3-20 min
  'hard': { min: 300, expected: 900, max: 2400 },    // 5-40 min
};

/**
 * Analyze if solution was too fast
 */
export function analyzeSubmissionTime(
  timeSpentSeconds: number,
  difficulty: 'easy' | 'medium' | 'hard',
  codeLength: number
): {
  isSuspicious: boolean;
  severity: CheatSeverity;
  expectedMin: number;
  expectedMax: number;
} {
  const expected = EXPECTED_TIME[difficulty];

  // Adjust for code length (shorter code might be legitimate quick solution)
  const lengthFactor = Math.max(0.5, Math.min(1.5, codeLength / 200));
  const adjustedMin = expected.min * lengthFactor;

  const isSuspicious = timeSpentSeconds < adjustedMin;

  let severity: CheatSeverity = 'low';
  if (timeSpentSeconds < adjustedMin * 0.5) {
    severity = 'high';
  } else if (timeSpentSeconds < adjustedMin * 0.75) {
    severity = 'medium';
  }

  return {
    isSuspicious,
    severity,
    expectedMin: Math.round(adjustedMin),
    expectedMax: expected.max,
  };
}

// ==================== MAIN ANALYSIS FUNCTION ====================

/**
 * Analyze a submission for all types of cheating
 */
export function analyzeSubmission(
  submission: Submission,
  metadata: SubmissionMetadata | undefined,
  problem: Problem,
  allSubmissionsForProblem: Submission[]
): SubmissionWithCheatData {
  const flags: CheatFlag[] = [];
  let totalScore = 0;

  // Get expected uniqueness and thresholds for this problem
  const uniqueness = getExpectedUniqueness(problem);
  const thresholds = getSimilarityThresholds(uniqueness);

  // 1. Check similarity with other submissions
  const otherSubmissions = allSubmissionsForProblem.filter(
    s => s.studentId !== submission.studentId && s.status === 'passed'
  );

  for (const other of otherSubmissions) {
    const comparison = compareSubmissions(submission.code, other.code);

    // Use dynamic thresholds based on problem uniqueness
    if (comparison.similarityScore >= thresholds.criticalThreshold) {
      // For low uniqueness tasks, even critical similarity is lower severity
      const severity: CheatSeverity = uniqueness === 'low' ? 'medium' : 'critical';
      flags.push({
        type: 'code_similarity',
        severity,
        description: `Code is ${comparison.similarityScore}% similar to another student`,
        descriptionRu: `Код на ${comparison.similarityScore}% похож на код другого студента`,
        confidence: comparison.similarityScore,
        details: {
          similarStudentId: other.studentId,
          similarSubmissionId: other.id,
          similarityScore: comparison.similarityScore,
        },
      });
      totalScore += 40 * thresholds.scoreMultiplier;
    } else if (comparison.similarityScore >= thresholds.highThreshold) {
      // For low uniqueness tasks, skip high similarity flags entirely
      if (uniqueness === 'low') {
        continue;
      }
      const severity: CheatSeverity = uniqueness === 'medium' ? 'medium' : 'high';
      flags.push({
        type: 'code_similarity',
        severity,
        description: `Code is ${comparison.similarityScore}% similar to another student`,
        descriptionRu: `Код на ${comparison.similarityScore}% похож на код другого студента`,
        confidence: comparison.similarityScore,
        details: {
          similarStudentId: other.studentId,
          similarSubmissionId: other.id,
          similarityScore: comparison.similarityScore,
        },
      });
      totalScore += 25 * thresholds.scoreMultiplier;
    }
  }

  // 2. Check AI patterns
  const aiAnalysis = detectAIPatterns(submission.code, problem.topicId);
  if (aiAnalysis.isLikelyAI) {
    flags.push({
      type: 'ai_patterns',
      severity: aiAnalysis.confidence >= 60 ? 'high' : 'medium',
      description: `Detected patterns suggesting AI-generated code`,
      descriptionRu: `Обнаружены паттерны, указывающие на код, сгенерированный ИИ`,
      confidence: aiAnalysis.confidence,
      details: {
        flaggedPatterns: aiAnalysis.patterns,
      },
    });
    totalScore += aiAnalysis.confidence * 0.4;
  }

  // 3. Check timing (if metadata available)
  if (metadata?.timeSpentSeconds) {
    const timeAnalysis = analyzeSubmissionTime(
      metadata.timeSpentSeconds,
      problem.difficulty,
      submission.code.length
    );

    if (timeAnalysis.isSuspicious) {
      flags.push({
        type: 'fast_solution',
        severity: timeAnalysis.severity,
        description: `Solved in ${metadata.timeSpentSeconds}s, expected minimum ${timeAnalysis.expectedMin}s`,
        descriptionRu: `Решено за ${metadata.timeSpentSeconds}с, ожидаемый минимум ${timeAnalysis.expectedMin}с`,
        confidence: 80,
        details: {
          expectedTime: timeAnalysis.expectedMin,
          actualTime: metadata.timeSpentSeconds,
        },
      });
      totalScore += timeAnalysis.severity === 'high' ? 20 : 10;
    }
  }

  // 4. Check copy-paste behavior
  if (metadata?.pasteCount && metadata.pasteCount > 0) {
    const codeLines = submission.code.split('\n').length;
    const pasteRatio = metadata.pasteCount / codeLines;

    if (metadata.keystrokeCount && metadata.keystrokeCount < submission.code.length * 0.3) {
      flags.push({
        type: 'copy_paste',
        severity: 'high',
        description: `Low keystroke count suggests copy-paste`,
        descriptionRu: `Низкое количество нажатий клавиш указывает на копирование`,
        confidence: 85,
      });
      totalScore += 25;
    } else if (pasteRatio > 0.5) {
      flags.push({
        type: 'copy_paste',
        severity: 'medium',
        description: `High paste event ratio detected`,
        descriptionRu: `Обнаружено много событий вставки`,
        confidence: 70,
      });
      totalScore += 15;
    }
  }

  // 5. Check for English comments in Russian learning context
  const comments = submission.code.match(/#.*/g) || [];
  const englishComments = comments.filter(c => {
    const text = c.slice(1).trim();
    return text.length > 5 && /^[A-Za-z\s]+$/.test(text);
  });

  if (englishComments.length >= 2) {
    flags.push({
      type: 'english_comments',
      severity: 'low',
      description: `${englishComments.length} English comments detected`,
      descriptionRu: `Обнаружено ${englishComments.length} комментариев на английском`,
      confidence: 60,
    });
    totalScore += 10;
  }

  const cheatScore = Math.min(Math.round(totalScore), 100);

  return {
    ...submission,
    metadata,
    cheatFlags: flags,
    cheatScore,
    reviewedByTeacher: false,
  };
}

// ==================== REPORTING ====================

/**
 * Generate a cheat report for a specific student
 */
export function generateStudentReport(
  student: Student,
  submissions: SubmissionWithCheatData[],
  problems: Problem[],
  allSimilarityMatches: SimilarityMatch[]
): StudentCheatReport {
  const studentSubmissions = submissions.filter(s => s.studentId === student.id);
  const flaggedSubmissions = studentSubmissions.filter(s => (s.cheatFlags?.length || 0) > 0);

  const flagsByType: Record<CheatFlagType, number> = {
    code_similarity: 0,
    fast_solution: 0,
    copy_paste: 0,
    advanced_code: 0,
    style_mismatch: 0,
    ai_patterns: 0,
    english_comments: 0,
    perfect_format: 0,
  };

  let totalFlags = 0;
  let highSeverityCount = 0;
  let totalCheatScore = 0;

  for (const sub of flaggedSubmissions) {
    for (const flag of sub.cheatFlags || []) {
      flagsByType[flag.type]++;
      totalFlags++;
      if (flag.severity === 'high' || flag.severity === 'critical') {
        highSeverityCount++;
      }
    }
    totalCheatScore += sub.cheatScore || 0;
  }

  const problemMap = new Map(problems.map(p => [p.id, p]));

  const recentFlags = flaggedSubmissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 10)
    .map(sub => ({
      submissionId: sub.id,
      problemId: sub.problemId,
      problemTitle: problemMap.get(sub.problemId)?.titleRu || sub.problemId,
      flags: sub.cheatFlags || [],
      submittedAt: sub.submittedAt,
    }));

  const studentMatches = allSimilarityMatches.filter(
    m => m.studentId1 === student.id || m.studentId2 === student.id
  );

  return {
    studentId: student.id,
    studentName: student.name,
    grade: student.grade,
    totalFlags,
    flagsByType,
    averageCheatScore: flaggedSubmissions.length > 0
      ? Math.round(totalCheatScore / flaggedSubmissions.length)
      : 0,
    highSeverityCount,
    recentFlags,
    similarityMatches: studentMatches,
  };
}

/**
 * Generate summary for teacher dashboard
 */
export function generateCheatSummary(
  submissions: SubmissionWithCheatData[],
  students: Student[],
  similarityMatches: SimilarityMatch[]
): CheatDetectionSummary {
  const flaggedSubmissions = submissions.filter(s => (s.cheatFlags?.length || 0) > 0);
  const highSeveritySubmissions = flaggedSubmissions.filter(s =>
    s.cheatFlags?.some(f => f.severity === 'high' || f.severity === 'critical')
  );

  const studentFlagCounts = new Map<string, { count: number; totalScore: number }>();

  for (const sub of flaggedSubmissions) {
    const current = studentFlagCounts.get(sub.studentId) || { count: 0, totalScore: 0 };
    current.count += sub.cheatFlags?.length || 0;
    current.totalScore += sub.cheatScore || 0;
    studentFlagCounts.set(sub.studentId, current);
  }

  const studentMap = new Map(students.map(s => [s.id, s]));

  const topFlaggedStudents = Array.from(studentFlagCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([studentId, data]) => {
      const student = studentMap.get(studentId);
      return {
        studentId,
        studentName: student?.name || 'Unknown',
        grade: student?.grade || 0,
        flagCount: data.count,
        averageScore: Math.round(data.totalScore / data.count),
      };
    });

  const flagDistribution: Record<CheatFlagType, number> = {
    code_similarity: 0,
    fast_solution: 0,
    copy_paste: 0,
    advanced_code: 0,
    style_mismatch: 0,
    ai_patterns: 0,
    english_comments: 0,
    perfect_format: 0,
  };

  for (const sub of flaggedSubmissions) {
    for (const flag of sub.cheatFlags || []) {
      flagDistribution[flag.type]++;
    }
  }

  return {
    totalSuspiciousSubmissions: flaggedSubmissions.length,
    totalHighSeverity: highSeveritySubmissions.length,
    studentsWithFlags: studentFlagCounts.size,
    topFlaggedStudents,
    recentSimilarityMatches: similarityMatches.slice(0, 20),
    flagDistribution,
  };
}
