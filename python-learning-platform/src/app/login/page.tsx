'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { GraduationCap, User, Key, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      toast.success('Добро пожаловать!');
      const user = useStore.getState().user;
      if (user?.role === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    } else {
      setError('Неверный email или пароль');
      toast.error('Ошибка входа');
    }

    setIsLoading(false);
  };

  const fillTeacherCredentials = () => {
    setEmail('teacher@school.edu');
    setPassword('teacher123');
  };

  const fillStudentCredentials = () => {
    setEmail('student7_1@school.edu');
    setPassword('student123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-xl font-bold text-white">Divergents Leadership School</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Добро пожаловать!</h2>
          <p className="text-gray-400">Войдите в свой аккаунт</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" style={{ marginTop: '12px' }} />
            <Input
              label="Email"
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" style={{ marginTop: '12px' }} />
            <Input
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm mb-4">Демо-доступ:</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={fillTeacherCredentials}>
              Учитель
            </Button>
            <Button variant="outline" size="sm" onClick={fillStudentCredentials}>
              Ученик
            </Button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-4">
            Учитель: teacher@school.edu / teacher123<br />
            Ученик: student{'{7-10}'}_{'{1-20}'}@school.edu / student123
          </p>
        </div>
      </div>
    </div>
  );
}
