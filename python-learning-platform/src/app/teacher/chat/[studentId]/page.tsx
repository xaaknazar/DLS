'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Send, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

export default function TeacherChatWithStudentPage() {
  const params = useParams();
  const studentId = params.studentId as string;

  const { user, messages, loadMessages, sendMessage, markAsRead, students, loadStudents } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const student = students.find((s) => s.id === studentId);

  useEffect(() => {
    const load = async () => {
      await loadStudents();
      if (user?.id && studentId) {
        await loadMessages(user.id, studentId);
        await markAsRead(user.id, studentId);
      }
      setIsLoading(false);
    };
    load();
  }, [user?.id, studentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!user?.id || !studentId) return;
    const interval = setInterval(() => {
      loadMessages(user.id, studentId);
      markAsRead(user.id, studentId);
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id, studentId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id) return;

    setIsSending(true);
    try {
      await sendMessage(user.id, studentId, newMessage.trim());
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title={student?.name || 'Чат с учеником'}
        subtitle={student ? `${student.grade} класс` : ''}
      />

      <div className="flex-1 p-6 flex flex-col max-w-4xl mx-auto w-full">
        {/* Back button */}
        <Link href="/teacher/chat" className="mb-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            К списку диалогов
          </Button>
        </Link>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                <p>Нет сообщений</p>
                <p className="text-sm mt-1">Ученик ещё не написал вам</p>
              </div>
            ) : (
              messages.map((message) => {
                const isFromTeacher = message.fromUserId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isFromTeacher ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isFromTeacher
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-800 text-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isFromTeacher ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите ответ..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
                className="self-end"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
