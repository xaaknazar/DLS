'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  FileWarning,
  Eye,
  ChevronDown,
  ChevronRight,
  Copy,
  Zap,
  Bot,
  MessageSquare,
  Clock,
  X,
} from 'lucide-react';
import {
  CheatDetectionSummary,
  SimilarityMatch,
  CheatFlagType,
  SubmissionWithCheatData,
} from '@/types';

// Flag type icons and colors
const FLAG_CONFIG: Record<CheatFlagType, { icon: React.ElementType; color: string; label: string }> = {
  code_similarity: { icon: Copy, color: 'text-red-400', label: 'Сходство кода' },
  fast_solution: { icon: Zap, color: 'text-yellow-400', label: 'Быстрое решение' },
  copy_paste: { icon: Copy, color: 'text-orange-400', label: 'Copy-paste' },
  advanced_code: { icon: Bot, color: 'text-purple-400', label: 'Продвинутый код' },
  style_mismatch: { icon: AlertTriangle, color: 'text-pink-400', label: 'Смена стиля' },
  ai_patterns: { icon: Bot, color: 'text-blue-400', label: 'Признаки ИИ' },
  english_comments: { icon: MessageSquare, color: 'text-cyan-400', label: 'Англ. комментарии' },
  perfect_format: { icon: FileWarning, color: 'text-green-400', label: 'Идеальный формат' },
};

interface EnrichedSubmission extends SubmissionWithCheatData {
  studentName: string;
  studentGrade: number;
  problemTitle: string;
  problemDifficulty: string;
}

interface ComparisonData {
  submission1: { id: string; studentId: string; code: string };
  submission2: { id: string; studentId: string; code: string };
  similarityScore: number;
  matchedTokens: number;
  totalTokens: number;
}

export default function CheatDetectionPage() {
  const { students } = useStore();
  const [summary, setSummary] = useState<CheatDetectionSummary | null>(null);
  const [flaggedSubmissions, setFlaggedSubmissions] = useState<EnrichedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'flagged' | 'similarity'>('overview');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [comparisonModal, setComparisonModal] = useState<ComparisonData | null>(null);
  const [threshold, setThreshold] = useState(70);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const gradeParam = selectedGrade ? `&grade=${selectedGrade}` : '';
        const thresholdParam = `&threshold=${threshold}`;

        const [summaryRes, flaggedRes] = await Promise.all([
          fetch(`/api/cheat-detection?${gradeParam}${thresholdParam}`),
          fetch(`/api/cheat-detection?action=flagged${gradeParam}${thresholdParam}`),
        ]);

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }

        if (flaggedRes.ok) {
          const flaggedData = await flaggedRes.json();
          setFlaggedSubmissions(flaggedData.submissions || []);
        }
      } catch (error) {
        console.error('Failed to fetch cheat detection data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedGrade, threshold]);

  // Compare two submissions
  const compareSubmissions = async (match: SimilarityMatch) => {
    try {
      const res = await fetch('/api/cheat-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compare',
          submissionId1: match.submissionId1,
          submissionId2: match.submissionId2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComparisonModal(data);
      }
    } catch (error) {
      console.error('Failed to compare submissions:', error);
    }
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Неизвестный';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
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
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Порог сходства:</span>
            <input
              type="range"
              min="50"
              max="95"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-white text-sm font-medium">{threshold}%</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Подозрительных</p>
                <p className="text-2xl font-bold text-white">{summary?.totalSuspiciousSubmissions || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Высокая серьёзность</p>
                <p className="text-2xl font-bold text-white">{summary?.totalHighSeverity || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Учеников с флагами</p>
                <p className="text-2xl font-bold text-white">{summary?.studentsWithFlags || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Copy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Совпадений кода</p>
                <p className="text-2xl font-bold text-white">{summary?.recentSimilarityMatches?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800 pb-2">
          {[
            { id: 'overview', label: 'Обзор' },
            { id: 'flagged', label: 'Подозрительные' },
            { id: 'similarity', label: 'Сходство кода' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Flagged Students */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Топ подозрительных учеников</h3>
              {summary?.topFlaggedStudents && summary.topFlaggedStudents.length > 0 ? (
                <div className="space-y-3">
                  {summary.topFlaggedStudents.map((student, idx) => (
                    <div key={student.studentId} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-5">{idx + 1}.</span>
                        <div>
                          <p className="text-white font-medium">{student.studentName}</p>
                          <p className="text-gray-500 text-sm">{student.grade} класс</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-bold">{student.flagCount} флагов</p>
                        <p className="text-gray-500 text-sm">Ср. оценка: {student.averageScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Подозрительных учеников не обнаружено</p>
              )}
            </Card>

            {/* Flag Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Распределение флагов</h3>
              {summary?.flagDistribution && (
                <div className="space-y-3">
                  {Object.entries(summary.flagDistribution)
                    .filter(([_, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => {
                      const config = FLAG_CONFIG[type as CheatFlagType];
                      const Icon = config?.icon || AlertTriangle;
                      return (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${config?.color || 'text-gray-400'}`} />
                            <span className="text-gray-300">{config?.label || type}</span>
                          </div>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      );
                    })}
                  {Object.values(summary.flagDistribution).every(v => v === 0) && (
                    <p className="text-gray-500 text-center py-8">Флагов не обнаружено</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'flagged' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Подозрительные решения ({flaggedSubmissions.length})
            </h3>
            {flaggedSubmissions.length > 0 ? (
              <div className="space-y-3">
                {flaggedSubmissions.map(submission => (
                  <div key={submission.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedSubmission(
                        expandedSubmission === submission.id ? null : submission.id
                      )}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-white font-medium">{submission.studentName}</p>
                          <p className="text-gray-500 text-sm">{submission.studentGrade} класс</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-300">{submission.problemTitle}</p>
                          <div className="flex gap-2 mt-1">
                            {submission.cheatFlags?.slice(0, 3).map((flag, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-0.5 rounded border ${getSeverityColor(flag.severity)}`}
                              >
                                {FLAG_CONFIG[flag.type]?.label || flag.type}
                              </span>
                            ))}
                            {(submission.cheatFlags?.length || 0) > 3 && (
                              <span className="text-xs text-gray-500">
                                +{(submission.cheatFlags?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Оценка подозрительности</p>
                          <p className={`text-xl font-bold ${
                            (submission.cheatScore || 0) >= 70 ? 'text-red-400' :
                            (submission.cheatScore || 0) >= 40 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {submission.cheatScore || 0}%
                          </p>
                        </div>
                        {expandedSubmission === submission.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedSubmission === submission.id && (
                      <div className="p-4 border-t border-gray-700 space-y-4">
                        {/* Flags list */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Обнаруженные проблемы:</h4>
                          <div className="space-y-2">
                            {submission.cheatFlags?.map((flag, idx) => {
                              const config = FLAG_CONFIG[flag.type];
                              const Icon = config?.icon || AlertTriangle;
                              return (
                                <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(flag.severity)}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`w-4 h-4 ${config?.color}`} />
                                    <span className="font-medium">{config?.label}</span>
                                    <Badge variant={
                                      flag.severity === 'critical' ? 'red' :
                                      flag.severity === 'high' ? 'orange' :
                                      flag.severity === 'medium' ? 'yellow' : 'gray'
                                    }>
                                      {flag.confidence}% уверенность
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-300">{flag.descriptionRu}</p>
                                  {flag.details?.similarStudentId && (
                                    <p className="text-sm text-gray-400 mt-1">
                                      Похоже на решение: {getStudentName(flag.details.similarStudentId)}
                                    </p>
                                  )}
                                  {flag.details?.flaggedPatterns && (
                                    <p className="text-sm text-gray-400 mt-1">
                                      Паттерны: {flag.details.flaggedPatterns.join(', ')}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Code preview */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Код решения:</h4>
                          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-64 overflow-y-auto">
                            {submission.code}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Подозрительных решений не найдено</p>
            )}
          </Card>
        )}

        {activeTab === 'similarity' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Совпадения кода ({summary?.recentSimilarityMatches?.length || 0})
            </h3>
            {summary?.recentSimilarityMatches && summary.recentSimilarityMatches.length > 0 ? (
              <div className="space-y-3">
                {summary.recentSimilarityMatches.map((match, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-white font-medium">{getStudentName(match.studentId1)}</p>
                        <p className="text-gray-500 text-sm">Ученик 1</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-red-500/30 rounded" />
                        <span className={`text-lg font-bold ${
                          match.similarityScore >= 90 ? 'text-red-400' :
                          match.similarityScore >= 80 ? 'text-orange-400' : 'text-yellow-400'
                        }`}>
                          {match.similarityScore}%
                        </span>
                        <div className="w-16 h-1 bg-red-500/30 rounded" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{getStudentName(match.studentId2)}</p>
                        <p className="text-gray-500 text-sm">Ученик 2</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-400">
                        <p>Совпало токенов: {match.matchedTokens}/{match.totalTokens}</p>
                      </div>
                      <button
                        onClick={() => compareSubmissions(match)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Сравнить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Совпадений кода не найдено</p>
            )}
          </Card>
        )}
      </div>

      {/* Comparison Modal */}
      {comparisonModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-white">Сравнение кода</h3>
                <p className="text-sm text-gray-400">
                  Сходство: <span className={`font-bold ${
                    comparisonModal.similarityScore >= 90 ? 'text-red-400' :
                    comparisonModal.similarityScore >= 80 ? 'text-orange-400' : 'text-yellow-400'
                  }`}>{comparisonModal.similarityScore}%</span>
                </p>
              </div>
              <button
                onClick={() => setComparisonModal(null)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-700 max-h-[calc(90vh-80px)] overflow-hidden">
              <div className="p-4 overflow-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">Ученик:</span>
                  <span className="text-white font-medium">
                    {getStudentName(comparisonModal.submission1.studentId)}
                  </span>
                </div>
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {comparisonModal.submission1.code}
                </pre>
              </div>
              <div className="p-4 overflow-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">Ученик:</span>
                  <span className="text-white font-medium">
                    {getStudentName(comparisonModal.submission2.studentId)}
                  </span>
                </div>
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {comparisonModal.submission2.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
