import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, initializeDatabase, updateStreak } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const { email, password } = await request.json();

    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Если это студент - обновляем стрик при входе
    let finalUser = user;
    let newAchievements: string[] = [];

    if (user.role === 'student') {
      try {
        const streakResult = await updateStreak(user.id);
        finalUser = streakResult.student;
        newAchievements = streakResult.newAchievements;
        console.log(`[Login] Student ${user.name} logged in. Streak: ${streakResult.student.streakDays}, Updated: ${streakResult.streakUpdated}`);
      } catch (e) {
        console.error('[Login] Failed to update streak:', e);
        // Продолжаем с оригинальным пользователем
      }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = finalUser;

    return NextResponse.json({
      user: userWithoutPassword,
      newAchievements: newAchievements.length > 0 ? newAchievements : undefined
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
