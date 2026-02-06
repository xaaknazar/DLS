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

// ==================== CACHING ====================

// Cache for tokenized code (LRU-like, limited size)
const tokenCache = new Map<string, string[]>();
const TOKEN_CACHE_SIZE = 500;

// Cache for similarity comparisons
const similarityCache = new Map<string, number>();
const SIMILARITY_CACHE_SIZE = 2000;

function getCacheKey(code1: string, code2: string): string {
  // Use shorter hash-like key
  const hash1 = code1.length + '-' + code1.slice(0, 50);
  const hash2 = code2.length + '-' + code2.slice(0, 50);
  return hash1 < hash2 ? `${hash1}|${hash2}` : `${hash2}|${hash1}`;
}

function addToCache<T>(cache: Map<string, T>, key: string, value: T, maxSize: number): void {
  if (cache.size >= maxSize) {
    // Remove oldest entry (first key)
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, value);
}

// ==================== CODE TOKENIZATION ====================

/**
 * Tokenize Python code for comparison
 * Removes whitespace, comments, and normalizes variable names
 * Uses caching for performance
 */
function tokenizePythonCode(code: string): string[] {
  // Check cache first
  const cached = tokenCache.get(code);
  if (cached) return cached;

  // Remove comments
  let cleanCode = code
    .split('\n')
    .map(line => {
      const commentIndex = line.indexOf('#');
      return commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    })
    .join('\n');

  // Remove string literals (replace with placeholder) - handle multiline first
  cleanCode = cleanCode.replace(/"""[\s\S]*?"""/g, 'STR');
  cleanCode = cleanCode.replace(/'''[\s\S]*?'''/g, 'STR');
  cleanCode = cleanCode.replace(/"([^"\\]|\\.)*"/g, 'STR');
  cleanCode = cleanCode.replace(/'([^'\\]|\\.)*'/g, 'STR');

  // Normalize whitespace
  cleanCode = cleanCode.replace(/\s+/g, ' ').trim();

  // Extended Python keywords and builtins
  const keywords = [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
    'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'raise',
    'break', 'continue', 'pass', 'lambda', 'and', 'or', 'not', 'in', 'is',
    'True', 'False', 'None', 'print', 'input', 'range', 'len', 'int', 'str',
    'float', 'list', 'dict', 'set', 'tuple', 'open', 'read', 'write',
    'append', 'pop', 'split', 'join', 'strip', 'replace', 'find', 'count',
    'sum', 'max', 'min', 'abs', 'sorted', 'reversed', 'enumerate', 'zip',
    'map', 'filter', 'any', 'all', 'type', 'isinstance', 'hasattr', 'getattr',
  ];

  // Extended operators
  const operators = [
    '==', '!=', '<=', '>=', '<', '>', ':=', '->', '**=', '//=',
    '+=', '-=', '*=', '/=', '%=', '**', '//',
    '=', '+', '-', '*', '/', '%',
    '(', ')', '[', ']', '{', '}', ':', ',', '.', '@',
  ];

  // Tokenize with consistent variable naming
  const tokens: string[] = [];
  let remaining = cleanCode;
  let varCounter = 0;
  const varMap = new Map<string, string>();

  while (remaining.length > 0) {
    remaining = remaining.trimStart();
    if (!remaining) break;

    // Check for operators (longer ones first)
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
        // Normalize variable names consistently
        if (!varMap.has(word)) {
          varMap.set(word, `V${varCounter++}`);
        }
        tokens.push(varMap.get(word)!);
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

  // Cache the result
  addToCache(tokenCache, code, tokens, TOKEN_CACHE_SIZE);
  return tokens;
}

/**
 * Get structural fingerprint of code (control flow structure)
 * This helps detect copied code even with renamed variables
 */
function getStructuralFingerprint(code: string): string {
  const lines = code.split('\n');
  const structure: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Get indentation level
    const indent = line.match(/^(\s*)/)?.[1].length || 0;
    const indentLevel = Math.floor(indent / 4);

    // Identify structure type
    if (/^def\s+/.test(trimmed)) structure.push(`${indentLevel}D`);
    else if (/^class\s+/.test(trimmed)) structure.push(`${indentLevel}C`);
    else if (/^if\s+/.test(trimmed)) structure.push(`${indentLevel}I`);
    else if (/^elif\s+/.test(trimmed)) structure.push(`${indentLevel}E`);
    else if (/^else\s*:/.test(trimmed)) structure.push(`${indentLevel}L`);
    else if (/^for\s+/.test(trimmed)) structure.push(`${indentLevel}F`);
    else if (/^while\s+/.test(trimmed)) structure.push(`${indentLevel}W`);
    else if (/^try\s*:/.test(trimmed)) structure.push(`${indentLevel}T`);
    else if (/^except/.test(trimmed)) structure.push(`${indentLevel}X`);
    else if (/^return\b/.test(trimmed)) structure.push(`${indentLevel}R`);
    else if (/^print\s*\(/.test(trimmed)) structure.push(`${indentLevel}P`);
    else if (/=/.test(trimmed) && !/[<>=!]=/.test(trimmed)) structure.push(`${indentLevel}A`);
    else structure.push(`${indentLevel}S`);
  }

  return structure.join('');
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
 * Uses caching, early exit, and structural comparison for better accuracy
 */
export function compareSubmissions(code1: string, code2: string): {
  similarityScore: number;
  matchedTokens: number;
  totalTokens: number;
} {
  // Check cache first
  const cacheKey = getCacheKey(code1, code2);
  const cachedScore = similarityCache.get(cacheKey);

  if (cachedScore !== undefined) {
    const tokens1 = tokenizePythonCode(code1);
    const tokens2 = tokenizePythonCode(code2);
    const totalTokens = Math.max(tokens1.length, tokens2.length);
    return {
      similarityScore: cachedScore,
      matchedTokens: Math.round((cachedScore / 100) * totalTokens),
      totalTokens,
    };
  }

  // Early exit: if code lengths differ significantly, similarity is low
  const lenRatio = Math.min(code1.length, code2.length) / Math.max(code1.length, code2.length);
  if (lenRatio < 0.3) {
    addToCache(similarityCache, cacheKey, 0, SIMILARITY_CACHE_SIZE);
    return { similarityScore: 0, matchedTokens: 0, totalTokens: Math.max(code1.length, code2.length) / 10 };
  }

  const tokens1 = tokenizePythonCode(code1);
  const tokens2 = tokenizePythonCode(code2);

  // Early exit: if token counts differ significantly
  const tokenRatio = Math.min(tokens1.length, tokens2.length) / Math.max(tokens1.length, tokens2.length);
  if (tokenRatio < 0.4) {
    const totalTokens = Math.max(tokens1.length, tokens2.length);
    addToCache(similarityCache, cacheKey, 20, SIMILARITY_CACHE_SIZE);
    return { similarityScore: 20, matchedTokens: 0, totalTokens };
  }

  const jaccardScore = jaccardSimilarity(tokens1, tokens2);

  // Get structural fingerprints - this catches copied code with renamed variables
  const struct1 = getStructuralFingerprint(code1);
  const struct2 = getStructuralFingerprint(code2);
  const structuralSimilarity = struct1 === struct2 ? 100 :
    (struct1.length > 0 && struct2.length > 0) ?
      levenshteinSimilarity(struct1, struct2) : 0;

  // Only calculate raw Levenshtein if Jaccard is promising (> 50%)
  let rawSimilarity = 0;
  if (jaccardScore > 50) {
    const normalizedCode1 = code1.replace(/\s+/g, ' ').trim().toLowerCase();
    const normalizedCode2 = code2.replace(/\s+/g, ' ').trim().toLowerCase();
    rawSimilarity = levenshteinSimilarity(normalizedCode1, normalizedCode2);
  }

  // Combined score: token similarity (50%), structural (30%), raw (20%)
  // If structural similarity is very high (>90%), boost the score
  let combinedScore = jaccardScore * 0.5 + structuralSimilarity * 0.3 + rawSimilarity * 0.2;

  // If structure is identical and token similarity is high, it's likely copying
  if (structuralSimilarity > 95 && jaccardScore > 70) {
    combinedScore = Math.max(combinedScore, (jaccardScore + structuralSimilarity) / 2);
  }

  // Take max of combined and individual high scores
  const similarityScore = Math.max(combinedScore, jaccardScore, rawSimilarity * 0.9);

  const totalTokens = Math.max(tokens1.length, tokens2.length);
  const matchedTokens = Math.round((similarityScore / 100) * totalTokens);

  const finalScore = Math.round(similarityScore * 10) / 10;

  // Cache the result
  addToCache(similarityCache, cacheKey, finalScore, SIMILARITY_CACHE_SIZE);

  return {
    similarityScore: finalScore,
    matchedTokens,
    totalTokens,
  };
}

/**
 * Find all similar submissions for a problem
 * Uses dynamic thresholds based on problem uniqueness
 * Skips problems with skipCheatDetection enabled
 * Skips submissions that are defended by students
 * @param defendedStudentProblems - Map of studentId -> Set of defended problemIds
 */
export function findSimilarSubmissions(
  submissions: Submission[],
  problems: Problem[],
  defaultThreshold: number = 70, // Default 70% similarity threshold
  defendedStudentProblems?: Map<string, Set<string>>
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

    // Skip problems that are excluded from cheat detection
    if (problem?.skipCheatDetection) {
      continue;
    }

    let threshold = defaultThreshold;

    if (problem) {
      const uniqueness = getExpectedUniqueness(problem);
      const thresholds = getSimilarityThresholds(uniqueness);
      // Use high threshold as minimum for flagging similarity
      threshold = thresholds.highThreshold;
    }

    // Only keep one submission per student (latest)
    // Skip submissions from students who defended this problem
    const byStudent = new Map<string, Submission>();
    for (const sub of problemSubmissions) {
      // Skip if this student defended this problem
      if (defendedStudentProblems?.get(sub.studentId)?.has(problemId)) {
        continue;
      }

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

// Detailed AI pattern categories for reporting
export interface AIPatternDetail {
  category: 'comprehension' | 'type_hints' | 'decorators' | 'formatting' | 'english_comments' | 'advanced_constructs';
  pattern: string;
  description: string;
  descriptionRu: string;
  weight: number;
}

// Patterns that suggest AI-generated code
const AI_PATTERNS = {
  // Perfect docstrings and comments
  perfectDocstring: /^def\s+\w+\([^)]*\):\s*\n\s*"""[\s\S]+?"""/m,
  typeHints: /def\s+\w+\([^)]*:\s*(int|str|float|bool|list|dict|List|Dict|Optional|Union)/,
  returnTypeHint: /->\s*(int|str|float|bool|list|dict|List|Dict|None|Optional)/,

  // Comprehensions - AI loves these
  listComprehension: /\[.+\s+for\s+.+\s+in\s+.+\]/,
  dictComprehension: /\{.+:\s*.+\s+for\s+.+\s+in\s+.+\}/,
  setComprehension: /\{.+\s+for\s+.+\s+in\s+.+\}/,
  generatorExpression: /\(.+\s+for\s+.+\s+in\s+.+\)/,
  nestedComprehension: /\[.+\[.+for.+\].+for.+\]/,

  // Advanced constructs
  lambdaFunction: /lambda\s+\w+\s*:/,
  walrusOperator: /:=/,
  fString: /f["'][^"']*\{[^}]+\}[^"']*["']/,
  multipleAssignment: /\w+\s*,\s*\w+\s*=.+,.+/,
  starOperator: /\*\w+|\*\*\w+/,

  // Professional patterns
  errorHandling: /try:\s*[\s\S]+?except\s+\w+(\s+as\s+\w+)?:/,
  withStatement: /with\s+open\(/,
  decorators: /@\w+/,
  classDefinition: /class\s+\w+.*:/,

  // English comments
  englishComments: /#\s*[A-Za-z]{3,}\s+[A-Za-z]{3,}/,
};

// Expected knowledge by topic (what students should/shouldn't know)
const TOPIC_KNOWLEDGE: Record<string, { allowed: string[]; suspicious: string[] }> = {
  'variables': {
    allowed: ['print', 'input', '=', '+', '-', '*', '/'],
    suspicious: ['def', 'class', 'for', 'while', 'if', 'list', 'dict', 'lambda', '[', ']'],
  },
  'conditions': {
    allowed: ['print', 'input', 'if', 'elif', 'else', '==', '!=', '<', '>', 'and', 'or', 'not'],
    suspicious: ['def', 'class', 'for', 'while', 'list', 'dict', 'lambda'],
  },
  'loops': {
    allowed: ['print', 'input', 'if', 'elif', 'else', 'for', 'while', 'range', 'break', 'continue'],
    suspicious: ['def', 'class', 'lambda', 'dict', 'set'],
  },
  'strings': {
    allowed: ['print', 'input', 'if', 'elif', 'else', 'for', 'while', 'len', '+', '*', '[', ']'],
    suspicious: ['def', 'class', 'lambda', 'dict', 'set', 'join', 'split'],
  },
  'lists': {
    allowed: ['print', 'input', 'if', 'for', 'while', 'len', 'list', 'append', 'pop', 'range'],
    suspicious: ['def', 'class', 'lambda', 'dict', 'set', 'comprehension'],
  },
  'functions': {
    allowed: ['def', 'return', 'print', 'input', 'if', 'for', 'while'],
    suspicious: ['class', 'lambda', 'yield', 'async', 'await', 'decorator'],
  },
};

/**
 * Detailed AI detection result
 */
export interface AIDetectionResult {
  isLikelyAI: boolean;
  confidence: number;
  patterns: string[];
  categories: {
    comprehensions: { detected: boolean; patterns: string[]; score: number };
    typeHints: { detected: boolean; patterns: string[]; score: number };
    decorators: { detected: boolean; patterns: string[]; score: number };
    formatting: { detected: boolean; patterns: string[]; score: number };
    englishComments: { detected: boolean; patterns: string[]; score: number };
    advancedConstructs: { detected: boolean; patterns: string[]; score: number };
  };
}

/**
 * Detect AI-generated code patterns with detailed categorization
 */
export function detectAIPatterns(code: string, topicId?: string): AIDetectionResult {
  const patterns: string[] = [];
  let score = 0;

  // Initialize categories
  const categories = {
    comprehensions: { detected: false, patterns: [] as string[], score: 0 },
    typeHints: { detected: false, patterns: [] as string[], score: 0 },
    decorators: { detected: false, patterns: [] as string[], score: 0 },
    formatting: { detected: false, patterns: [] as string[], score: 0 },
    englishComments: { detected: false, patterns: [] as string[], score: 0 },
    advancedConstructs: { detected: false, patterns: [] as string[], score: 0 },
  };

  // 1. Comprehensions (AI loves these)
  if (AI_PATTERNS.listComprehension.test(code)) {
    categories.comprehensions.detected = true;
    categories.comprehensions.patterns.push('List comprehension');
    categories.comprehensions.score += 20;
    patterns.push('List comprehension');
    score += 20;
  }
  if (AI_PATTERNS.dictComprehension.test(code)) {
    categories.comprehensions.detected = true;
    categories.comprehensions.patterns.push('Dict comprehension');
    categories.comprehensions.score += 25;
    patterns.push('Dict comprehension');
    score += 25;
  }
  if (AI_PATTERNS.setComprehension.test(code)) {
    categories.comprehensions.detected = true;
    categories.comprehensions.patterns.push('Set comprehension');
    categories.comprehensions.score += 25;
    patterns.push('Set comprehension');
    score += 25;
  }
  if (AI_PATTERNS.generatorExpression.test(code)) {
    categories.comprehensions.detected = true;
    categories.comprehensions.patterns.push('Generator expression');
    categories.comprehensions.score += 30;
    patterns.push('Generator expression');
    score += 30;
  }
  if (AI_PATTERNS.nestedComprehension.test(code)) {
    categories.comprehensions.detected = true;
    categories.comprehensions.patterns.push('Nested comprehension');
    categories.comprehensions.score += 35;
    patterns.push('Nested comprehension');
    score += 35;
  }

  // 2. Type hints (very common in AI code)
  if (AI_PATTERNS.typeHints.test(code)) {
    categories.typeHints.detected = true;
    categories.typeHints.patterns.push('Function type hints');
    categories.typeHints.score += 25;
    patterns.push('Type hints');
    score += 25;
  }
  if (AI_PATTERNS.returnTypeHint.test(code)) {
    categories.typeHints.detected = true;
    categories.typeHints.patterns.push('Return type annotation');
    categories.typeHints.score += 25;
    patterns.push('Return type annotation');
    score += 25;
  }

  // 3. Decorators
  if (AI_PATTERNS.decorators.test(code)) {
    categories.decorators.detected = true;
    categories.decorators.patterns.push('Decorators (@)');
    categories.decorators.score += 30;
    patterns.push('Decorators');
    score += 30;
  }

  // 4. Perfect formatting check
  const lines = code.split('\n');
  const hasConsistentIndent = lines.every(line =>
    line.trim() === '' || /^(\s{4})*\S/.test(line) || /^\S/.test(line)
  );
  if (hasConsistentIndent && lines.length > 5) {
    const indentedLines = lines.filter(l => l.startsWith('    '));
    if (indentedLines.length > 3 && indentedLines.every(l => /^\s{4}(?!\s{1,3}\S)/.test(l))) {
      categories.formatting.detected = true;
      categories.formatting.patterns.push('Perfect 4-space indentation');
      categories.formatting.score += 15;
      patterns.push('Perfect formatting');
      score += 15;
    }
  }

  // Check for perfect docstrings
  if (AI_PATTERNS.perfectDocstring.test(code)) {
    categories.formatting.detected = true;
    categories.formatting.patterns.push('Professional docstring');
    categories.formatting.score += 20;
    patterns.push('Professional docstring');
    score += 20;
  }

  // 5. English comments
  const comments = code.match(/#.*/g) || [];
  const englishComments = comments.filter(c => {
    const text = c.slice(1).trim();
    return text.length > 3 && /^[A-Za-z\s.,!?]+$/.test(text) && !/[а-яА-ЯёЁ]/.test(text);
  });
  if (englishComments.length > 0) {
    categories.englishComments.detected = true;
    categories.englishComments.patterns = englishComments.slice(0, 3);
    categories.englishComments.score += 20;
    patterns.push(`English comments (${englishComments.length})`);
    score += 20;
  }

  // 6. Advanced constructs
  if (AI_PATTERNS.lambdaFunction.test(code)) {
    categories.advancedConstructs.detected = true;
    categories.advancedConstructs.patterns.push('Lambda function');
    categories.advancedConstructs.score += 20;
    patterns.push('Lambda function');
    score += 20;
  }
  if (AI_PATTERNS.walrusOperator.test(code)) {
    categories.advancedConstructs.detected = true;
    categories.advancedConstructs.patterns.push('Walrus operator (:=)');
    categories.advancedConstructs.score += 35;
    patterns.push('Walrus operator');
    score += 35;
  }
  if (AI_PATTERNS.errorHandling.test(code)) {
    categories.advancedConstructs.detected = true;
    categories.advancedConstructs.patterns.push('Try/except blocks');
    categories.advancedConstructs.score += 15;
    patterns.push('Try/except');
    score += 15;
  }
  if (AI_PATTERNS.withStatement.test(code)) {
    categories.advancedConstructs.detected = true;
    categories.advancedConstructs.patterns.push('Context manager (with)');
    categories.advancedConstructs.score += 20;
    patterns.push('Context manager');
    score += 20;
  }

  // 7. Check topic-specific knowledge (constructs not yet taught)
  if (topicId) {
    const knowledge = TOPIC_KNOWLEDGE[topicId];
    if (knowledge) {
      for (const suspicious of knowledge.suspicious) {
        // Skip comprehension check if we already flagged it
        if (suspicious === 'comprehension' && categories.comprehensions.detected) continue;

        const regex = new RegExp(`\\b${suspicious}\\b`);
        if (regex.test(code)) {
          categories.advancedConstructs.detected = true;
          categories.advancedConstructs.patterns.push(`"${suspicious}" (не по теме)`);
          categories.advancedConstructs.score += 20;
          patterns.push(`Uses "${suspicious}" (not yet taught)`);
          score += 20;
        }
      }
    }
  }

  return {
    isLikelyAI: score >= 40,
    confidence: Math.min(score, 100),
    patterns,
    categories,
  };
}

// ==================== BEHAVIOR ANALYSIS ====================

// Expected time ranges in seconds for each difficulty
const EXPECTED_TIME: Record<string, { min: number; expected: number; max: number }> = {
  'easy': { min: 60, expected: 180, max: 600 },      // 1-10 min
  'medium': { min: 180, expected: 480, max: 1200 },  // 3-20 min
  'hard': { min: 300, expected: 900, max: 2400 },    // 5-40 min
};

/**
 * Detailed behavior analysis result
 */
export interface BehaviorAnalysisResult {
  overallScore: number; // 0-100, higher = more suspicious
  timing: {
    suspicious: boolean;
    severity: CheatSeverity;
    timeSpent: number | null;
    expectedMin: number;
    expectedMax: number;
    description: string;
    descriptionRu: string;
  };
  keystrokes: {
    suspicious: boolean;
    severity: CheatSeverity;
    count: number | null;
    expectedMin: number;
    ratio: number | null; // keystrokes per character
    description: string;
    descriptionRu: string;
  };
  pasteEvents: {
    suspicious: boolean;
    severity: CheatSeverity;
    count: number | null;
    description: string;
    descriptionRu: string;
  };
  tabSwitches: {
    suspicious: boolean;
    severity: CheatSeverity;
    count: number | null;
    description: string;
    descriptionRu: string;
  };
}

/**
 * Analyze student behavior during problem solving
 */
export function analyzeBehavior(
  metadata: SubmissionMetadata | undefined,
  code: string,
  difficulty: 'easy' | 'medium' | 'hard'
): BehaviorAnalysisResult {
  const codeLength = code.length;
  const expected = EXPECTED_TIME[difficulty];

  // Adjust expected time for code length
  const lengthFactor = Math.max(0.5, Math.min(1.5, codeLength / 200));
  const adjustedMin = expected.min * lengthFactor;

  let overallScore = 0;

  // 1. Timing analysis
  const timeSpent = metadata?.timeSpentSeconds ?? null;
  let timingSuspicious = false;
  let timingSeverity: CheatSeverity = 'low';
  let timingDescription = 'Нет данных о времени';
  let timingDescriptionRu = 'Нет данных о времени';

  if (timeSpent !== null) {
    if (timeSpent < adjustedMin * 0.5) {
      timingSuspicious = true;
      timingSeverity = 'high';
      timingDescription = `Solved in ${timeSpent}s, expected minimum ${Math.round(adjustedMin)}s`;
      timingDescriptionRu = `Решено за ${timeSpent}с — очень быстро! Ожидаемый минимум: ${Math.round(adjustedMin)}с`;
      overallScore += 30;
    } else if (timeSpent < adjustedMin * 0.75) {
      timingSuspicious = true;
      timingSeverity = 'medium';
      timingDescription = `Solved in ${timeSpent}s, expected minimum ${Math.round(adjustedMin)}s`;
      timingDescriptionRu = `Решено за ${timeSpent}с — быстрее ожидаемого (минимум ${Math.round(adjustedMin)}с)`;
      overallScore += 15;
    } else {
      timingDescription = `Solved in ${timeSpent}s (normal)`;
      timingDescriptionRu = `Решено за ${timeSpent}с — нормальное время`;
    }
  }

  // 2. Keystroke analysis
  const keystrokeCount = metadata?.keystrokeCount ?? null;
  const expectedMinKeystrokes = codeLength * 0.3; // At least 30% of code length
  let keystrokeSuspicious = false;
  let keystrokeSeverity: CheatSeverity = 'low';
  let keystrokeRatio: number | null = null;
  let keystrokeDescription = 'Нет данных о нажатиях';
  let keystrokeDescriptionRu = 'Нет данных о нажатиях клавиш';

  if (keystrokeCount !== null) {
    keystrokeRatio = keystrokeCount / codeLength;

    if (keystrokeCount < codeLength * 0.2) {
      keystrokeSuspicious = true;
      keystrokeSeverity = 'high';
      keystrokeDescription = `Only ${keystrokeCount} keystrokes for ${codeLength} chars (ratio: ${keystrokeRatio.toFixed(2)})`;
      keystrokeDescriptionRu = `Всего ${keystrokeCount} нажатий для ${codeLength} символов — очень мало!`;
      overallScore += 35;
    } else if (keystrokeCount < codeLength * 0.5) {
      keystrokeSuspicious = true;
      keystrokeSeverity = 'medium';
      keystrokeDescription = `${keystrokeCount} keystrokes for ${codeLength} chars (ratio: ${keystrokeRatio.toFixed(2)})`;
      keystrokeDescriptionRu = `${keystrokeCount} нажатий для ${codeLength} символов — подозрительно мало`;
      overallScore += 20;
    } else {
      keystrokeDescription = `${keystrokeCount} keystrokes for ${codeLength} chars (normal)`;
      keystrokeDescriptionRu = `${keystrokeCount} нажатий для ${codeLength} символов — нормально`;
    }
  }

  // 3. Paste events analysis
  const pasteCount = metadata?.pasteCount ?? null;
  let pasteSuspicious = false;
  let pasteSeverity: CheatSeverity = 'low';
  let pasteDescription = 'Нет данных о вставках';
  let pasteDescriptionRu = 'Нет данных о событиях вставки';

  if (pasteCount !== null) {
    if (pasteCount > 5) {
      pasteSuspicious = true;
      pasteSeverity = 'high';
      pasteDescription = `${pasteCount} paste events detected`;
      pasteDescriptionRu = `${pasteCount} событий вставки (Ctrl+V) — очень много!`;
      overallScore += 25;
    } else if (pasteCount > 2) {
      pasteSuspicious = true;
      pasteSeverity = 'medium';
      pasteDescription = `${pasteCount} paste events detected`;
      pasteDescriptionRu = `${pasteCount} событий вставки (Ctrl+V) — подозрительно`;
      overallScore += 15;
    } else if (pasteCount > 0) {
      pasteSuspicious = true;
      pasteSeverity = 'low';
      pasteDescription = `${pasteCount} paste event(s) detected`;
      pasteDescriptionRu = `${pasteCount} событие(й) вставки обнаружено`;
      overallScore += 5;
    } else {
      pasteDescription = 'No paste events';
      pasteDescriptionRu = 'Событий вставки не обнаружено';
    }
  }

  // 4. Tab switch analysis
  const tabSwitchCount = metadata?.tabSwitchCount ?? null;
  let tabSwitchSuspicious = false;
  let tabSwitchSeverity: CheatSeverity = 'low';
  let tabSwitchDescription = 'Нет данных о вкладках';
  let tabSwitchDescriptionRu = 'Нет данных о переключении вкладок';

  if (tabSwitchCount !== null) {
    if (tabSwitchCount > 10) {
      tabSwitchSuspicious = true;
      tabSwitchSeverity = 'high';
      tabSwitchDescription = `${tabSwitchCount} tab switches detected`;
      tabSwitchDescriptionRu = `${tabSwitchCount} переключений вкладок — очень много!`;
      overallScore += 20;
    } else if (tabSwitchCount > 5) {
      tabSwitchSuspicious = true;
      tabSwitchSeverity = 'medium';
      tabSwitchDescription = `${tabSwitchCount} tab switches detected`;
      tabSwitchDescriptionRu = `${tabSwitchCount} переключений вкладок — подозрительно`;
      overallScore += 10;
    } else if (tabSwitchCount > 0) {
      tabSwitchDescription = `${tabSwitchCount} tab switch(es) detected`;
      tabSwitchDescriptionRu = `${tabSwitchCount} переключение(й) вкладок`;
    } else {
      tabSwitchDescription = 'No tab switches';
      tabSwitchDescriptionRu = 'Переключений вкладок не было';
    }
  }

  return {
    overallScore: Math.min(overallScore, 100),
    timing: {
      suspicious: timingSuspicious,
      severity: timingSeverity,
      timeSpent,
      expectedMin: Math.round(adjustedMin),
      expectedMax: expected.max,
      description: timingDescription,
      descriptionRu: timingDescriptionRu,
    },
    keystrokes: {
      suspicious: keystrokeSuspicious,
      severity: keystrokeSeverity,
      count: keystrokeCount,
      expectedMin: Math.round(expectedMinKeystrokes),
      ratio: keystrokeRatio,
      description: keystrokeDescription,
      descriptionRu: keystrokeDescriptionRu,
    },
    pasteEvents: {
      suspicious: pasteSuspicious,
      severity: pasteSeverity,
      count: pasteCount,
      description: pasteDescription,
      descriptionRu: pasteDescriptionRu,
    },
    tabSwitches: {
      suspicious: tabSwitchSuspicious,
      severity: tabSwitchSeverity,
      count: tabSwitchCount,
      description: tabSwitchDescription,
      descriptionRu: tabSwitchDescriptionRu,
    },
  };
}

/**
 * Analyze if solution was too fast (legacy function for compatibility)
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
 * Returns submission without flags if problem has skipCheatDetection enabled
 * or if the problem is defended by the student (isDefended = true)
 */
export function analyzeSubmission(
  submission: Submission,
  metadata: SubmissionMetadata | undefined,
  problem: Problem,
  allSubmissionsForProblem: Submission[],
  isDefended: boolean = false
): SubmissionWithCheatData {
  // Skip cheat detection for excluded problems or defended submissions
  if (problem.skipCheatDetection || isDefended) {
    return {
      ...submission,
      metadata,
      cheatFlags: [],
      cheatScore: 0,
      reviewedByTeacher: isDefended, // Mark as reviewed if defended
    };
  }

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

// ==================== DETAILED SUBMISSION ANALYSIS ====================

/**
 * Detailed analysis result for a single submission
 * Includes all three categories: behavior, AI, and similarity
 */
export interface DetailedSubmissionAnalysis {
  submissionId: string;
  problemId: string;
  problemTitle: string;
  problemTitleRu: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  submittedAt: Date;
  status: string;

  // Overall scores
  overallCheatScore: number;
  behaviorScore: number;
  aiScore: number;
  similarityScore: number;

  // Detailed analysis
  behaviorAnalysis: BehaviorAnalysisResult;
  aiAnalysis: AIDetectionResult;
  similarityAnalysis: {
    hasSimilarSubmissions: boolean;
    highestSimilarity: number;
    similarStudents: {
      studentId: string;
      studentName: string;
      similarity: number;
    }[];
  };
}

/**
 * Generate detailed analysis for a submission
 * Returns empty analysis if problem has skipCheatDetection enabled
 * or if the problem is defended by the student
 */
export function analyzeSubmissionDetailed(
  submission: Submission,
  metadata: SubmissionMetadata | undefined,
  problem: Problem,
  allSubmissionsForProblem: Submission[],
  studentMap: Map<string, Student>,
  isDefended: boolean = false
): DetailedSubmissionAnalysis {
  // Skip cheat detection for excluded problems or defended submissions - return empty analysis
  if (problem.skipCheatDetection || isDefended) {
    return {
      submissionId: submission.id,
      problemId: problem.id,
      problemTitle: problem.title,
      problemTitleRu: problem.titleRu,
      difficulty: problem.difficulty,
      code: submission.code,
      submittedAt: submission.submittedAt,
      status: submission.status,
      overallCheatScore: 0,
      behaviorScore: 0,
      aiScore: 0,
      similarityScore: 0,
      behaviorAnalysis: {
        overallScore: 0,
        timing: { suspicious: false, severity: 'low', timeSpent: null, expectedMin: 0, expectedMax: 0, description: 'Проверка отключена', descriptionRu: 'Проверка отключена для этой задачи' },
        keystrokes: { suspicious: false, severity: 'low', count: null, expectedMin: 0, ratio: null, description: 'Проверка отключена', descriptionRu: 'Проверка отключена для этой задачи' },
        pasteEvents: { suspicious: false, severity: 'low', count: null, description: 'Проверка отключена', descriptionRu: 'Проверка отключена для этой задачи' },
        tabSwitches: { suspicious: false, severity: 'low', count: null, description: 'Проверка отключена', descriptionRu: 'Проверка отключена для этой задачи' },
      },
      aiAnalysis: {
        isLikelyAI: false,
        confidence: 0,
        patterns: [],
        categories: {
          comprehensions: { detected: false, patterns: [], score: 0 },
          typeHints: { detected: false, patterns: [], score: 0 },
          decorators: { detected: false, patterns: [], score: 0 },
          formatting: { detected: false, patterns: [], score: 0 },
          englishComments: { detected: false, patterns: [], score: 0 },
          advancedConstructs: { detected: false, patterns: [], score: 0 },
        },
      },
      similarityAnalysis: {
        hasSimilarSubmissions: false,
        highestSimilarity: 0,
        similarStudents: [],
      },
    };
  }

  // 1. Behavior analysis
  const behaviorAnalysis = analyzeBehavior(metadata, submission.code, problem.difficulty);

  // 2. AI detection
  const aiAnalysis = detectAIPatterns(submission.code, problem.topicId);

  // 3. Similarity analysis
  const otherSubmissions = allSubmissionsForProblem.filter(
    s => s.studentId !== submission.studentId && s.status === 'passed'
  );

  const uniqueness = getExpectedUniqueness(problem);
  const thresholds = getSimilarityThresholds(uniqueness);

  const similarStudents: { studentId: string; studentName: string; similarity: number }[] = [];
  let highestSimilarity = 0;

  for (const other of otherSubmissions) {
    const comparison = compareSubmissions(submission.code, other.code);
    if (comparison.similarityScore >= thresholds.highThreshold * 0.8) { // Show even slightly similar
      const student = studentMap.get(other.studentId);
      similarStudents.push({
        studentId: other.studentId,
        studentName: student?.name || 'Неизвестный',
        similarity: comparison.similarityScore,
      });
      if (comparison.similarityScore > highestSimilarity) {
        highestSimilarity = comparison.similarityScore;
      }
    }
  }

  // Sort by similarity descending
  similarStudents.sort((a, b) => b.similarity - a.similarity);

  // Calculate overall scores
  const behaviorScore = behaviorAnalysis.overallScore;
  const aiScore = aiAnalysis.confidence;
  const similarityScore = highestSimilarity > thresholds.highThreshold
    ? Math.round(highestSimilarity * thresholds.scoreMultiplier)
    : 0;

  // Combined score with weights: behavior 40%, AI 35%, similarity 25%
  const overallCheatScore = Math.min(100, Math.round(
    behaviorScore * 0.4 + aiScore * 0.35 + similarityScore * 0.25
  ));

  return {
    submissionId: submission.id,
    problemId: problem.id,
    problemTitle: problem.title,
    problemTitleRu: problem.titleRu,
    difficulty: problem.difficulty,
    code: submission.code,
    submittedAt: submission.submittedAt,
    status: submission.status,

    overallCheatScore,
    behaviorScore,
    aiScore,
    similarityScore,

    behaviorAnalysis,
    aiAnalysis,
    similarityAnalysis: {
      hasSimilarSubmissions: similarStudents.length > 0,
      highestSimilarity,
      similarStudents: similarStudents.slice(0, 5), // Top 5 similar
    },
  };
}

/**
 * Get all solved problems for a student with detailed analysis
 */
export function getStudentSubmissionsWithAnalysis(
  studentId: string,
  submissions: Submission[],
  problems: Problem[],
  students: Student[],
  metadata?: Map<string, SubmissionMetadata>
): DetailedSubmissionAnalysis[] {
  const studentMap = new Map(students.map(s => [s.id, s]));
  const problemMap = new Map(problems.map(p => [p.id, p]));

  // Get the student's defended problems
  const student = students.find(s => s.id === studentId);
  const defendedProblems = new Set(student?.defendedProblems || []);

  // Group submissions by problem for similarity comparison
  const submissionsByProblem = new Map<string, Submission[]>();
  for (const sub of submissions) {
    const list = submissionsByProblem.get(sub.problemId) || [];
    list.push(sub);
    submissionsByProblem.set(sub.problemId, list);
  }

  // Get student's passed submissions (one per problem, latest)
  const studentSubmissions = submissions.filter(
    s => s.studentId === studentId && s.status === 'passed'
  );

  // Keep only latest submission per problem
  const latestByProblem = new Map<string, Submission>();
  for (const sub of studentSubmissions) {
    const existing = latestByProblem.get(sub.problemId);
    if (!existing || new Date(sub.submittedAt) > new Date(existing.submittedAt)) {
      latestByProblem.set(sub.problemId, sub);
    }
  }

  // Analyze each submission
  const results: DetailedSubmissionAnalysis[] = [];

  for (const [problemId, submission] of latestByProblem) {
    const problem = problemMap.get(problemId);
    if (!problem) continue;

    const allProblemSubmissions = submissionsByProblem.get(problemId) || [];
    // Use metadata from submission itself, or from provided map as fallback
    const subMetadata = submission.metadata || metadata?.get(submission.id);
    // Check if this problem is defended by the student
    const isDefended = defendedProblems.has(problemId);

    const analysis = analyzeSubmissionDetailed(
      submission,
      subMetadata,
      problem,
      allProblemSubmissions,
      studentMap,
      isDefended
    );

    results.push(analysis);
  }

  // Sort by cheat score descending
  return results.sort((a, b) => b.overallCheatScore - a.overallCheatScore);
}
