'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getShopItemById } from '@/data/shop';
import { MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

export default function TeacherChatPage() {
  const { user, conversations, loadConversations, students, loadStudents } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await loadStudents();
      if (user?.id) {
        await loadConversations(user.id);
      }
      setIsLoading(false);
    };
    load();
  }, [user?.id]);

  // Poll for new conversations every 10 seconds
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      loadConversations(user.id);
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const getStudent = (studentId: string) => {
    return students.find((s) => s.id === studentId);
  };

  const getStudentName = (studentId: string) => {
    const student = getStudent(studentId);
    return student?.name || 'Ученик';
  };

  const getStudentGrade = (studentId: string) => {
    const student = getStudent(studentId);
    return student?.grade || 0;
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Сообщения"
        subtitle={`${conversations.length} диалогов${totalUnread > 0 ? `, ${totalUnread} непрочитанных` : ''}`}
      />

      <div className="p-6 max-w-4xl mx-auto">
        <Card className="divide-y divide-gray-700">
          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Нет сообщений</p>
              <p className="text-sm mt-1">Ученики ещё не написали вам</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <Link
                key={conv.studentId}
                href={`/teacher/chat/${conv.studentId}`}
                className="block"
              >
                <div className="p-4 hover:bg-gray-800/50 transition-colors flex items-center gap-4">
                  {(() => {
                    const student = getStudent(conv.studentId);
                    const avatarItem = student?.equippedAvatar ? getShopItemById(student.equippedAvatar) : null;
                    const frameItem = student?.equippedFrame ? getShopItemById(student.equippedFrame) : null;

                    if (avatarItem) {
                      return (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden
                          bg-gradient-to-br ${avatarItem.gradient || 'from-gray-600 to-gray-700'}
                          ${frameItem?.borderColor || ''}
                        `}>
                          {avatarItem.image ? (
                            <img src={avatarItem.image} alt={avatarItem.nameRu} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-xl">{avatarItem.emoji}</span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getStudentName(conv.studentId).charAt(0)}
                      </div>
                    );
                  })()}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium truncate">
                        {getStudentName(conv.studentId)}
                      </h3>
                      <Badge variant="default" size="sm">
                        {getStudentGrade(conv.studentId)} класс
                      </Badge>
                      {conv.unreadCount > 0 && (
                        <Badge variant="success" size="sm">
                          {conv.unreadCount} новых
                        </Badge>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-gray-400 text-sm truncate mt-1">
                        {conv.lastMessage.fromUserId === user?.id ? 'Вы: ' : ''}
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    {conv.lastMessage && (
                      <p className="text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </p>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-500 mt-2 ml-auto" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
