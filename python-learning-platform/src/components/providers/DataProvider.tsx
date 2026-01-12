'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const { refreshUser, loadTopics, loadProblems, isAuthenticated, user } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // First, try to restore session
      await refreshUser();

      // Load topics and problems
      await loadTopics();
      await loadProblems();

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
