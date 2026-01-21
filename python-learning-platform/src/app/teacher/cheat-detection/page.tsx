'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronRight,
  Clock,
  Keyboard,
  Copy,
  ExternalLink,
  Bot,
  Code,
  MessageSquare,
  Sparkles,
  Wand2,
  FileCode,
  User,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  AIDetectionResult,
  BehaviorAnalysisResult,
  DetailedSubmissionAnalysis,
} from '@/lib/cheat-detection';

// Student summary type from API
interface StudentCheatSummary {
  id: string;
  name: string;
  grade: number;
  solvedProblems: number;
  flaggedSubmissions: number;
  averageCheatScore: number;
  maxCheatScore: number;
  highSeverityCount: number;
}

// Severity color helper
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  }
};

// Score color helper
const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-red-400';
  if (score >= 40) return 'text-yellow-400';
  if (score >= 20) return 'text-orange-400';
  return 'text-green-400';
};

// Behavior indicator component
function BehaviorIndicator({
  label,
  value,
  suspicious,
  severity,
  icon: Icon,
  description
}: {
  label: string;
  value: string | number | null;
  suspicious: boolean;
  severity: string;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className={`p-3 rounded-lg border ${suspicious ? getSeverityColor(severity) : 'bg-gray-800/50 border-gray-700'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${suspicious ? '' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">{label}</span>
        {suspicious && (
          <AlertTriangle className="w-3 h-3 ml-auto" />
        )}
      </div>
      <p className="text-lg font-bold">{value ?? '—'}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}

// AI Category component
function AICategory({
  label,
  detected,
  patterns,
  score,
  icon: Icon
}: {
  label: string;
  detected: boolean;
  patterns: string[];
  score: number;
  icon: React.ElementType;
}) {
  if (!detected) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="ml-auto text-green-400 text-sm">Чисто</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-red-400" />
        <span className="font-medium text-red-400">{label}</span>
        <span className="ml-auto text-red-400 text-sm font-bold">+{score}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {patterns.map((pattern, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
            {pattern}
          </span>
        ))}
      </div>
    </div>
  );
}

// Detailed submission view component
function SubmissionDetail({ analysis }: { analysis: DetailedSubmissionAnalysis }) {
  const [showCode, setShowCode] = useState(false);
  const { behaviorAnalysis, aiAnalysis, similarityAnalysis } = analysis;

  return (
    <div className="space-y-6 p-4 bg-gray-900/50 rounded-lg">
      {/* Header with scores */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white">{analysis.problemTitleRu}</h4>
          <p className="text-sm text-gray-400">
            Сложность: {analysis.difficulty === 'easy' ? 'Легко' : analysis.difficulty === 'medium' ? 'Средне' : 'Сложно'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400">Поведение</p>
            <p className={`text-xl font-bold ${getScoreColor(analysis.behaviorScore)}`}>
              {analysis.behaviorScore}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400">ИИ</p>
            <p className={`text-xl font-bold ${getScoreColor(analysis.aiScore)}`}>
              {analysis.aiScore}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400">Сходство</p>
            <p className={`text-xl font-bold ${getScoreColor(analysis.similarityScore)}`}>
              {analysis.similarityScore}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400">Общий</p>
            <p className={`text-xl font-bold ${getScoreColor(analysis.overallCheatScore)}`}>
              {analysis.overallCheatScore}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Behavior Analysis */}
      <div>
        <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Анализ поведения
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <BehaviorIndicator
            label="Время решения"
            value={behaviorAnalysis.timing.timeSpent ? `${behaviorAnalysis.timing.timeSpent}с` : null}
            suspicious={behaviorAnalysis.timing.suspicious}
            severity={behaviorAnalysis.timing.severity}
            icon={Clock}
            description={behaviorAnalysis.timing.descriptionRu}
          />
          <BehaviorIndicator
            label="Нажатия клавиш"
            value={behaviorAnalysis.keystrokes.count}
            suspicious={behaviorAnalysis.keystrokes.suspicious}
            severity={behaviorAnalysis.keystrokes.severity}
            icon={Keyboard}
            description={behaviorAnalysis.keystrokes.descriptionRu}
          />
          <BehaviorIndicator
            label="События вставки"
            value={behaviorAnalysis.pasteEvents.count}
            suspicious={behaviorAnalysis.pasteEvents.suspicious}
            severity={behaviorAnalysis.pasteEvents.severity}
            icon={Copy}
            description={behaviorAnalysis.pasteEvents.descriptionRu}
          />
          <BehaviorIndicator
            label="Смена вкладок"
            value={behaviorAnalysis.tabSwitches.count}
            suspicious={behaviorAnalysis.tabSwitches.suspicious}
            severity={behaviorAnalysis.tabSwitches.severity}
            icon={ExternalLink}
            description={behaviorAnalysis.tabSwitches.descriptionRu}
          />
        </div>
      </div>

      {/* 2. AI Detection */}
      <div>
        <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          Обнаружение признаков ИИ
          {aiAnalysis.isLikelyAI && (
            <Badge variant="danger">Вероятно ИИ</Badge>
          )}
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AICategory
            label="List/Dict Comprehensions"
            detected={aiAnalysis.categories.comprehensions.detected}
            patterns={aiAnalysis.categories.comprehensions.patterns}
            score={aiAnalysis.categories.comprehensions.score}
            icon={Code}
          />
          <AICategory
            label="Type Hints (аннотации типов)"
            detected={aiAnalysis.categories.typeHints.detected}
            patterns={aiAnalysis.categories.typeHints.patterns}
            score={aiAnalysis.categories.typeHints.score}
            icon={FileCode}
          />
          <AICategory
            label="Декораторы (@)"
            detected={aiAnalysis.categories.decorators.detected}
            patterns={aiAnalysis.categories.decorators.patterns}
            score={aiAnalysis.categories.decorators.score}
            icon={Wand2}
          />
          <AICategory
            label="Идеальное форматирование"
            detected={aiAnalysis.categories.formatting.detected}
            patterns={aiAnalysis.categories.formatting.patterns}
            score={aiAnalysis.categories.formatting.score}
            icon={Sparkles}
          />
          <AICategory
            label="Английские комментарии"
            detected={aiAnalysis.categories.englishComments.detected}
            patterns={aiAnalysis.categories.englishComments.patterns}
            score={aiAnalysis.categories.englishComments.score}
            icon={MessageSquare}
          />
          <AICategory
            label="Конструкции не по теме"
            detected={aiAnalysis.categories.advancedConstructs.detected}
            patterns={aiAnalysis.categories.advancedConstructs.patterns}
            score={aiAnalysis.categories.advancedConstructs.score}
            icon={AlertTriangle}
          />
        </div>
      </div>

      {/* 3. Code Similarity */}
      <div>
        <h5 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          Сходство кода с другими учениками
        </h5>
        {similarityAnalysis.hasSimilarSubmissions ? (
          <div className="space-y-2">
            {similarityAnalysis.similarStudents.map((similar, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  similar.similarity >= 90 ? 'bg-red-500/10 border-red-500/30' :
                  similar.similarity >= 80 ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{similar.studentName}</span>
                </div>
                <span className={`font-bold ${
                  similar.similarity >= 90 ? 'text-red-400' :
                  similar.similarity >= 80 ? 'text-orange-400' : 'text-yellow-400'
                }`}>
                  {similar.similarity}% сходство
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Похожих решений не найдено</span>
          </div>
        )}
      </div>

      {/* Code preview toggle */}
      <div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showCode ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {showCode ? 'Скрыть код' : 'Показать код'}
        </button>
        {showCode && (
          <pre className="mt-3 bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-64 overflow-y-auto border border-gray-700">
            {analysis.code}
          </pre>
        )}
      </div>
    </div>
  );
}

export default function CheatDetectionPage() {
  const [students, setStudents] = useState<StudentCheatSummary[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<{
    student: { id: string; name: string; grade: number };
    submissions: DetailedSubmissionAnalysis[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  // Fetch students list
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const gradeParam = selectedGrade ? `&grade=${selectedGrade}` : '';
        const res = await fetch(`/api/cheat-detection?action=students${gradeParam}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [selectedGrade]);

  // Fetch student details when selected
  useEffect(() => {
    if (!selectedStudent) {
      setStudentDetails(null);
      return;
    }

    async function fetchDetails() {
      setDetailsLoading(true);
      try {
        const res = await fetch(`/api/cheat-detection?action=student-details&studentId=${selectedStudent}`);
        if (res.ok) {
          const data = await res.json();
          setStudentDetails(data);
        }
      } catch (error) {
        console.error('Failed to fetch student details:', error);
      } finally {
        setDetailsLoading(false);
      }
    }
    fetchDetails();
  }, [selectedStudent]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Обнаружение читерства" subtitle="Анализ подозрительной активности" />
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Обнаружение читерства"
        subtitle="Анализ подозрительной активности учеников"
      />

      <div className="p-8">
        {/* Back button when viewing student details */}
        {selectedStudent && (
          <button
            onClick={() => {
              setSelectedStudent(null);
              setExpandedSubmission(null);
            }}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку учеников
          </button>
        )}

        {/* Student list view */}
        {!selectedStudent && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-sm">Класс:</span>
              <select
                value={selectedGrade || ''}
                onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все классы</option>
                {[7, 8, 9, 10].map(grade => (
                  <option key={grade} value={grade}>{grade} класс</option>
                ))}
              </select>
              <span className="text-gray-500 text-sm ml-4">
                Всего учеников: {students.length}
              </span>
            </div>

            {/* Students grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(student => (
                <Card
                  key={student.id}
                  className="p-4 cursor-pointer hover:border-blue-500/50 transition-colors"
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{student.name}</h3>
                      <p className="text-gray-500 text-sm">{student.grade} класс</p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(student.maxCheatScore)}`}>
                      {student.maxCheatScore}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{student.solvedProblems} решено</span>
                    </div>
                    {student.flaggedSubmissions > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{student.flaggedSubmissions} подозр.</span>
                      </div>
                    )}
                    {student.highSeverityCount > 0 && (
                      <div className="flex items-center gap-1 text-red-400">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{student.highSeverityCount} серьёз.</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {students.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                Ученики не найдены
              </div>
            )}
          </>
        )}

        {/* Student details view */}
        {selectedStudent && (
          <div>
            {detailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : studentDetails ? (
              <div className="space-y-6">
                {/* Student header */}
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{studentDetails.student.name}</h2>
                      <p className="text-gray-400">{studentDetails.student.grade} класс</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-gray-400 text-sm">Решённых задач</p>
                      <p className="text-3xl font-bold text-white">{studentDetails.submissions.length}</p>
                    </div>
                  </div>
                </Card>

                {/* Submissions list */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Решённые задачи
                  </h3>
                  {studentDetails.submissions.length > 0 ? (
                    studentDetails.submissions.map(analysis => (
                      <Card key={analysis.submissionId} className="overflow-hidden">
                        <button
                          onClick={() => setExpandedSubmission(
                            expandedSubmission === analysis.submissionId ? null : analysis.submissionId
                          )}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              analysis.overallCheatScore >= 70 ? 'bg-red-500/20' :
                              analysis.overallCheatScore >= 40 ? 'bg-yellow-500/20' :
                              analysis.overallCheatScore >= 20 ? 'bg-orange-500/20' :
                              'bg-green-500/20'
                            }`}>
                              <span className={`text-xl font-bold ${getScoreColor(analysis.overallCheatScore)}`}>
                                {analysis.overallCheatScore}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">{analysis.problemTitleRu}</p>
                              <p className="text-gray-500 text-sm">
                                {analysis.difficulty === 'easy' ? 'Легко' :
                                 analysis.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex gap-4 text-sm">
                              <div className="text-center">
                                <p className="text-gray-500">Поведение</p>
                                <p className={`font-bold ${getScoreColor(analysis.behaviorScore)}`}>
                                  {analysis.behaviorScore}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500">ИИ</p>
                                <p className={`font-bold ${getScoreColor(analysis.aiScore)}`}>
                                  {analysis.aiScore}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-500">Сходство</p>
                                <p className={`font-bold ${getScoreColor(analysis.similarityScore)}`}>
                                  {analysis.similarityScore}
                                </p>
                              </div>
                            </div>
                            {expandedSubmission === analysis.submissionId ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        {expandedSubmission === analysis.submissionId && (
                          <div className="border-t border-gray-700">
                            <SubmissionDetail analysis={analysis} />
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center text-gray-500">
                      У этого ученика нет решённых задач
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card className="p-8 text-center text-gray-500">
                Не удалось загрузить данные ученика
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
