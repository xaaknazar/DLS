'use client';

import { TestResult } from '@/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestResultsProps {
  results: TestResult[];
  isRunning?: boolean;
}

export default function TestResults({ results, isRunning = false }: TestResultsProps) {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <h3 className="font-medium text-white">Результаты тестов</h3>
        {results.length > 0 && (
          <div
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              passedCount === totalCount
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            )}
          >
            {passedCount}/{totalCount} пройдено
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {isRunning ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-400">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>Выполняется...</span>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Запустите код, чтобы увидеть результаты
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={result.testCaseId}
              className={cn(
                'p-4 rounded-xl border',
                result.passed
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {result.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-medium text-white">Тест {index + 1}</span>
                <span className="text-xs text-gray-500">{result.executionTime}ms</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-16">Вход:</span>
                  <code className="text-gray-300 bg-gray-800 px-2 py-0.5 rounded font-mono">
                    {result.input || '(пусто)'}
                  </code>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-16">Ожид.:</span>
                  <code className="text-green-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
                    {result.expectedOutput}
                  </code>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-16">Получ.:</span>
                  <code
                    className={cn(
                      'bg-gray-800 px-2 py-0.5 rounded font-mono',
                      result.passed ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {result.actualOutput || '(пусто)'}
                  </code>
                </div>
                {result.error && (
                  <div className="mt-2 p-2 bg-red-500/10 rounded-lg">
                    <span className="text-red-400 text-xs font-mono">{result.error}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
