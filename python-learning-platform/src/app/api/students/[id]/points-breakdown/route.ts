import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getProblems, initializeDatabase } from '@/lib/db';
import { shopItems } from '@/data/shop';
import { achievements } from '@/data/achievements';
import { Student } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = user as Student;
    const problems = await getProblems();

    // 1. Calculate points from completed problems
    let problemPoints = 0;
    const problemBreakdown: { id: string; title: string; points: number }[] = [];

    for (const problemId of student.completedProblems || []) {
      const problem = problems.find(p => p.id === problemId);
      if (problem) {
        problemPoints += problem.points;
        problemBreakdown.push({
          id: problem.id,
          title: problem.title,
          points: problem.points,
        });
      }
    }

    // 2. Calculate points from achievements
    let achievementPoints = 0;
    const achievementBreakdown: { id: string; name: string; points: number }[] = [];

    for (const achievementId of student.achievements || []) {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        achievementPoints += achievement.points;
        achievementBreakdown.push({
          id: achievement.id,
          name: achievement.titleRu || achievement.title,
          points: achievement.points,
        });
      }
    }

    // 3. Calculate spent points from purchases
    let spentPoints = 0;
    const purchaseBreakdown: { id: string; name: string; price: number; category: string }[] = [];

    for (const itemId of student.purchasedItems || []) {
      const item = shopItems.find(i => i.id === itemId);
      if (item) {
        spentPoints += item.price;
        purchaseBreakdown.push({
          id: item.id,
          name: item.nameRu,
          price: item.price,
          category: item.category,
        });
      }
    }

    // 4. Calculate totals
    const totalEarned = problemPoints + achievementPoints;
    const shopBalance = Math.max(0, totalEarned - spentPoints);

    const breakdown = {
      studentId: student.id,
      studentName: student.name,

      // Summary
      summary: {
        totalEarned,
        problemPoints,
        achievementPoints,
        spentPoints,
        shopBalance,
        currentPoints: student.points,
        currentShopPoints: student.shopPoints,
      },

      // Detailed breakdowns
      problems: {
        count: problemBreakdown.length,
        totalPoints: problemPoints,
        items: problemBreakdown,
      },

      achievements: {
        count: achievementBreakdown.length,
        totalPoints: achievementPoints,
        items: achievementBreakdown,
      },

      purchases: {
        count: purchaseBreakdown.length,
        totalSpent: spentPoints,
        items: purchaseBreakdown,
      },

      // Verification
      verification: {
        pointsMatch: student.points === totalEarned,
        shopPointsMatch: student.shopPoints === shopBalance,
        expectedPoints: totalEarned,
        expectedShopPoints: shopBalance,
      },
    };

    // Detailed console logging
    console.log('\n========== POINTS BREAKDOWN ==========');
    console.log(`Student: ${student.name} (ID: ${student.id})`);
    console.log('');
    console.log('--- EARNED POINTS ---');
    console.log(`Problems solved: ${problemBreakdown.length}`);
    problemBreakdown.forEach(p => console.log(`  • ${p.title}: +${p.points}`));
    console.log(`Subtotal from problems: ${problemPoints}`);
    console.log('');
    console.log(`Achievements earned: ${achievementBreakdown.length}`);
    achievementBreakdown.forEach(a => console.log(`  • ${a.name}: +${a.points}`));
    console.log(`Subtotal from achievements: ${achievementPoints}`);
    console.log('');
    console.log(`TOTAL EARNED: ${totalEarned}`);
    console.log('');
    console.log('--- SPENT POINTS ---');
    console.log(`Items purchased: ${purchaseBreakdown.length}`);
    purchaseBreakdown.forEach(p => console.log(`  • ${p.name} (${p.category}): -${p.price}`));
    console.log(`TOTAL SPENT: ${spentPoints}`);
    console.log('');
    console.log('--- BALANCE ---');
    console.log(`Rating Points (points): ${student.points} (expected: ${totalEarned}) ${student.points === totalEarned ? '✓' : '✗ MISMATCH!'}`);
    console.log(`Shop Balance (shopPoints): ${student.shopPoints} (expected: ${shopBalance}) ${student.shopPoints === shopBalance ? '✓' : '✗ MISMATCH!'}`);
    console.log(`Formula: shopPoints = earned(${totalEarned}) - spent(${spentPoints}) = ${shopBalance}`);
    console.log('=======================================\n');

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error('Points breakdown error:', error);
    return NextResponse.json({ error: 'Failed to get points breakdown' }, { status: 500 });
  }
}
