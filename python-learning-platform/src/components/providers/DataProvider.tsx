'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { refreshUser, loadTopics, loadProblems, loadStudents, isAuthenticated, user } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Initialize database first
      try {
        await fetch('/api/init');
      } catch (e) {
        console.log('Init error:', e);
      }

      // First, try to restore session
      await refreshUser();

      // Load topics, problems, and students
      await loadTopics();
      await loadProblems();
      await loadStudents();

      setIsInitialized(true);
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
