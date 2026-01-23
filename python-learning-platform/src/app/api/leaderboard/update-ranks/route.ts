import { NextResponse } from 'next/server';
import { updateRankSnapshots, getStudents } from '@/lib/db';

// POST - Обновить снимки рейтингов (вызывается при входе на страницу рейтинга)
// Использует force=false чтобы не перезаписывать позиции слишком часто
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { grade, force = false } = body;

    const result = await updateRankSnapshots(grade, force);

    return NextResponse.json({
      success: true,
      updated: result.updated,
    });
  } catch (error) {
    console.error('[API] Error updating rank snapshots:', error);
    return NextResponse.json(
      { error: 'Failed to update rank snapshots' },
      { status: 500 }
    );
  }
}

// GET - Получить текущие позиции с изменениями
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeParam = searchParams.get('grade');
    const grade = gradeParam && gradeParam !== 'all' ? parseInt(gradeParam) : undefined;

    const students = await getStudents();

    // Фильтруем по классу если указан
    const filteredStudents = grade
      ? students.filter(s => s.grade === grade)
      : students;

    // Сортируем по баллам
    const sortedStudents = [...filteredStudents].sort((a, b) => b.points - a.points);

    // Создаём список с рейтингами и изменениями
    const leaderboard = sortedStudents.map((student, index) => {
      const currentRank = index + 1;
      const previousRank = student.previousRank ?? null;

      // Изменение позиции: положительное = поднялся, отрицательное = опустился
      // previousRank - currentRank: если был 17 и стал 15, то 17-15=+2 (поднялся)
      const change = previousRank !== null ? previousRank - currentRank : null;

      return {
        id: student.id,
        name: student.name,
        grade: student.grade,
        points: student.points,
        completedProblems: student.completedProblems.length,
        streakDays: student.streakDays,
        currentRank,
        previousRank,
        change,
        equippedAvatar: student.equippedAvatar,
        equippedFrame: student.equippedFrame,
      };
    });

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('[API] Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
