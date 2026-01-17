'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Announcement } from '@/types';
import { Bell, AlertTriangle, Calendar, User } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadAnnouncements();
  }, [isAuthenticated, router]);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Объявления</h1>
          <p className="text-gray-400">Важная информация от учителя</p>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Нет объявлений</h3>
          <p className="text-gray-400">Пока нет новых объявлений от учителя</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-gray-800/50 rounded-2xl p-6 border transition-all duration-200 hover:bg-gray-800/70 ${
                announcement.isImportant
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-gray-700/50'
              }`}
            >
              {/* Importance Badge */}
              {announcement.isImportant && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    Важное
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl font-semibold text-white mb-3">
                {announcement.title}
              </h2>

              {/* Content */}
              <div className="text-gray-300 whitespace-pre-wrap mb-4">
                {announcement.content}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {announcement.authorName}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(announcement.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
