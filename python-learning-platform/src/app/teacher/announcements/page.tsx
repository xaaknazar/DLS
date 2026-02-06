'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Announcement } from '@/types';
import { Bell, Plus, Edit2, Trash2, AlertTriangle, Clock, Save, X, Megaphone, Pin, Send } from 'lucide-react';

export default function TeacherAnnouncementsPage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isImportant: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'teacher') {
      router.push('/student');
      return;
    }
    loadAnnouncements();
  }, [isAuthenticated, user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (editingId) {
        const response = await fetch(`/api/announcements/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updated = await response.json();
          setAnnouncements(prev =>
            prev.map(a => a.id === editingId ? updated : a)
          );
        }
      } else {
        const response = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            authorId: user.id,
            authorName: user.name,
          }),
        });
        if (response.ok) {
          const created = await response.json();
          setAnnouncements(prev => [created, ...prev]);
        }
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save announcement:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isImportant: announcement.isImportant,
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', isImportant: false });
    setEditingId(null);
    setShowForm(false);
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
    });
  };

  const importantCount = announcements.filter(a => a.isImportant).length;

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Megaphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Объявления</h1>
              <p className="text-gray-400">Создавайте объявления для учеников</p>
            </div>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              <Plus className="w-5 h-5" />
              Новое объявление
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="relative flex gap-6 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-white font-medium">{announcements.length}</span>
            <span className="text-gray-400 text-sm">всего</span>
          </div>
          {importantCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <Pin className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">{importantCount}</span>
              <span className="text-gray-400 text-sm">важных</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                {editingId ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Редактировать объявление' : 'Новое объявление'}
              </h2>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Введите заголовок объявления..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Содержание
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Введите текст объявления..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                required
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative w-12 h-7 rounded-full transition-colors ${formData.isImportant ? 'bg-red-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isImportant ? 'translate-x-6' : 'translate-x-1'}`}></div>
                <input
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData(prev => ({ ...prev, isImportant: e.target.checked }))}
                  className="sr-only"
                />
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${formData.isImportant ? 'text-red-400' : 'text-gray-500'}`} />
                <span className={`font-medium ${formData.isImportant ? 'text-white' : 'text-gray-400'}`}>
                  Отметить как важное
                </span>
              </div>
            </label>
          </div>

          <div className="p-6 border-t border-gray-700/50 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-amber-500/25"
            >
              <Send className="w-5 h-5" />
              {saving ? 'Публикация...' : (editingId ? 'Сохранить' : 'Опубликовать')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

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
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Создайте первое объявление, чтобы уведомить учеников о важной информации
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Создать объявление
          </button>
        </div>
      ) : (
        /* Announcements List */
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                announcement.isImportant
                  ? 'bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent border-red-500/30 hover:border-red-500/50'
                  : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50'
              }`}
            >
              {/* Accent Line for Important */}
              {announcement.isImportant && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500"></div>
              )}

              <div className={`p-6 ${announcement.isImportant ? 'pl-8' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Badge & Time */}
                    <div className="flex items-center gap-3 mb-3">
                      {announcement.isImportant && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Важно
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-white mb-3">
                      {announcement.title}
                    </h2>

                    {/* Content */}
                    <div className="text-gray-400 whitespace-pre-wrap leading-relaxed">
                      {announcement.content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
