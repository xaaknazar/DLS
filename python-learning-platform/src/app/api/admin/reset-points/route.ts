import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function POST() {
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return NextResponse.json({ error: 'Redis not configured' }, { status: 400 });
    }

    const client = new Redis(redisUrl);

    // Get current users
    const usersData = await client.get('dls:users');
    if (!usersData) {
      await client.quit();
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    const users = JSON.parse(usersData);

    // Reset points for all students
    let resetCount = 0;
    const updatedUsers = users.map((user: any) => {
      if (user.role === 'student') {
        resetCount++;
        return {
          ...user,
          points: 0,
          completedProblems: [],
          achievements: [],
          streakDays: 0,
        };
      }
      return user;
    });

    await client.set('dls:users', JSON.stringify(updatedUsers));
    await client.quit();

    return NextResponse.json({
      success: true,
      message: `Баллы сброшены у ${resetCount} учеников`,
      resetCount,
    });
  } catch (error: any) {
    console.error('Reset points error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
