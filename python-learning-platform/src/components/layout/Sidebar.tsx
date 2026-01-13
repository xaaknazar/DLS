'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Student } from '@/types';
import { getShopItemById } from '@/data/shop';
import {
  Home,
  BookOpen,
  Code,
  Trophy,
  Award,
  Users,
  UserCog,
  BarChart3,
  LogOut,
  GraduationCap,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';

const studentNavItems = [
  { href: '/student', label: 'Главная', icon: Home },
  { href: '/student/topics', label: 'Темы', icon: BookOpen },
  { href: '/student/problems', label: 'Задачи', icon: Code },
  { href: '/student/leaderboard', label: 'Рейтинг', icon: Trophy },
  { href: '/student/achievements', label: 'Достижения', icon: Award },
  { href: '/student/shop', label: 'Магазин', icon: ShoppingBag },
  { href: '/student/chat', label: 'Чат с учителем', icon: MessageCircle },
];

const teacherNavItems = [
  { href: '/teacher', label: 'Обзор', icon: Home },
  { href: '/teacher/students', label: 'Ученики', icon: Users },
  { href: '/teacher/students/manage', label: 'Управление', icon: UserCog },
  { href: '/teacher/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/teacher/content', label: 'Контент', icon: BookOpen },
  { href: '/teacher/chat', label: 'Сообщения', icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useStore();

  if (!user) return null;

  const navItems = user.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href={user.role === 'teacher' ? '/teacher' : '/student'}>
          <div>
            <h1 className="font-bold text-white">Divergents Leadership School</h1>
            <p className="text-xs text-gray-500">Informatics</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // For home pages (/student, /teacher), only exact match
          // For other pages, also match subpaths
          const isHome = item.href === '/student' || item.href === '/teacher';
          const isActive = isHome
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          {(() => {
            if (user.role === 'student') {
              const student = user as Student;
              const avatarItem = student.equippedAvatar ? getShopItemById(student.equippedAvatar) : null;
              const frameItem = student.equippedFrame ? getShopItemById(student.equippedFrame) : null;

              return (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                  ${avatarItem ? `bg-gradient-to-br ${avatarItem.gradient}` : 'bg-gradient-to-br from-green-500 to-emerald-600'}
                  ${frameItem?.borderColor || ''}
                `}>
                  {avatarItem?.emoji || <span className="text-white font-bold">{user.name.charAt(0)}</span>}
                </div>
              );
            }
            return (
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            );
          })()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {user.role === 'teacher' ? 'Учитель' : `${(user as Student).grade} класс`}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </aside>
  );
}
