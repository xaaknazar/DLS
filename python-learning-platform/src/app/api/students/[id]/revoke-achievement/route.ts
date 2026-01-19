import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, initializeDatabase } from '@/lib/db';
import { Student } from '@/types';
import { achievements } from '@/data/achievements';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const { achievementId } = await request.json();

    if (!achievementId) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = user as Student;

    // Check if achievement is in the list
    if (!student.achievements.includes(achievementId)) {
      return NextResponse.json({ error: 'Achievement not found in student achievements' }, { status: 400 });
    }

    // Find achievement to get its points
    const achievement = achievements.find(a => a.id === achievementId);
    const pointsToDeduct = achievement?.points || 0;

    // Remove achievement from list
    const newAchievements = student.achievements.filter(a => a !== achievementId);

    // Deduct points from both points and shopPoints
    const newPoints = Math.max(0, student.points - pointsToDeduct);
    const newShopPoints = Math.max(0, (student.shopPoints || 0) - pointsToDeduct);

    const updated = await updateUser(id, {
      achievements: newAchievements,
      points: newPoints,
      shopPoints: newShopPoints,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }

    const { password, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      student: safeUser,
      deductedPoints: pointsToDeduct,
    });
  } catch (error) {
    console.error('Revoke achievement error:', error);
    return NextResponse.json({ error: 'Failed to revoke achievement' }, { status: 500 });
  }
}
