'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'teacher') {
      router.push('/student');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Sidebar />
      <main className="ml-64 flex-1">
        {children}
      </main>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}
