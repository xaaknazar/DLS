'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Announcement } from '@/types';
import { Bell, AlertTriangle, Calendar, User, Megaphone, Clock, Pin } from 'lucide-react';

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
    const now = new Date();
    const announcementDate = new Date(date);
    const diffTime = now.getTime() - announcementDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Только что';
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return announcementDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: announcementDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const importantAnnouncements = announcements.filter(a => a.isImportant);
  const regularAnnouncements = announcements.filter(a => !a.isImportant);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Объявления</h1>
            <p className="text-gray-400">Важная информация и новости от учителя</p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative flex gap-6 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-white font-medium">{announcements.length}</span>
            <span className="text-gray-400 text-sm">всего</span>
          </div>
          {importantAnnouncements.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">{importantAnnouncements.length}</span>
              <span className="text-gray-400 text-sm">важных</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
            <p className="text-gray-400">Загрузка объявлений...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-800/30 rounded-3xl p-16 text-center border border-gray-700/50">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Нет объявлений</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Пока нет новых объявлений от учителя. Когда появятся важные новости — они отобразятся здесь.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Important Announcements */}
          {importantAnnouncements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <Pin className="w-5 h-5" />
                <h2 className="font-semibold">Важные объявления</h2>
              </div>
              {importantAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent rounded-2xl border border-red-500/30 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500"></div>

                  <div className="p-6 pl-8">
                    {/* Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                        <AlertTriangle className="w-4 h-4" />
                        Важно
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {announcement.title}
                    </h3>

                    {/* Content */}
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">
                      {announcement.content}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {announcement.authorName.charAt(0)}
                        </span>
                      </div>
                      {announcement.authorName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <div className="space-y-4">
              {importantAnnouncements.length > 0 && (
                <div className="flex items-center gap-2 text-gray-400 mt-8">
                  <Bell className="w-5 h-5" />
                  <h2 className="font-semibold">Все объявления</h2>
                </div>
              )}
              {regularAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="bg-gray-800/40 rounded-2xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600/50 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        {announcement.title}
                      </h3>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="text-gray-400 whitespace-pre-wrap leading-relaxed mb-4">
                      {announcement.content}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs font-medium">
                          {announcement.authorName.charAt(0)}
                        </span>
                      </div>
                      {announcement.authorName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
