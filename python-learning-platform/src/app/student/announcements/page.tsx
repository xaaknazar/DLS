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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Объявления</h1>
            <p className="text-gray-400 text-sm">Важная информация от учителя</p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg text-sm">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-white font-medium">{announcements.length}</span>
            <span className="text-gray-400">всего</span>
          </div>
          {importantAnnouncements.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">{importantAnnouncements.length}</span>
              <span className="text-gray-400">важных</span>
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
        <div className="bg-gray-800/30 rounded-2xl p-10 text-center border border-gray-700/50">
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Нет объявлений</h3>
          <p className="text-gray-400 text-sm">
            Пока нет новых объявлений от учителя
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Important Announcements */}
          {importantAnnouncements.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Pin className="w-4 h-4" />
                <h2 className="font-semibold">Важные</h2>
              </div>
              {importantAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent rounded-xl border border-red-500/30 transition-all duration-300 hover:border-red-500/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500"></div>

                  <div className="p-4 pl-5">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        Важно
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2">
                      {announcement.title}
                    </h3>

                    {/* Content */}
                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed mb-3">
                      {announcement.content}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] font-medium">
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
            <div className="space-y-3">
              {importantAnnouncements.length > 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                  <Bell className="w-4 h-4" />
                  <h2 className="font-semibold">Все объявления</h2>
                </div>
              )}
              {regularAnnouncements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="bg-gray-800/40 rounded-xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-white">
                        {announcement.title}
                      </h3>
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed mb-3">
                      {announcement.content}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-300 text-[10px] font-medium">
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
