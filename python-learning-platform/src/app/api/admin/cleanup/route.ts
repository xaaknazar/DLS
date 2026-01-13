import { NextResponse } from 'next/server';
import { getUsers, initializeDatabase } from '@/lib/db';
import Redis from 'ioredis';

export async function POST() {
  try {
    await initializeDatabase();

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

    // Filter out students with names starting with "Ученик"
    const filteredUsers = users.filter((user: any) => {
      if (user.role === 'teacher') return true;
      return !user.name.startsWith('Ученик');
    });

    const removedCount = users.length - filteredUsers.length;

    // Save filtered users back
    await client.set('dls:users', JSON.stringify(filteredUsers));
    await client.quit();

    return NextResponse.json({
      success: true,
      message: `Удалено ${removedCount} учеников с именем "Ученик..."`,
      remainingUsers: filteredUsers.length,
      removedCount,
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
