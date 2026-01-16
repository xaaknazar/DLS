import { NextRequest, NextResponse } from 'next/server';
import { getStudents, createUser, getUserByEmail, initializeDatabase } from '@/lib/db';
import { Student } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    let students = await getStudents();

    if (grade) {
      students = students.filter(s => s.grade === parseInt(grade));
    }

    // Remove passwords from response
    const safeStudents = students.map(({ password, ...s }) => s);

    return NextResponse.json(safeStudents);
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Failed to get students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const data = await request.json();
    const { name, email, password, grade } = data;

    // Validate required fields
    if (!name || !email || !password || !grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Create new student
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name,
      email,
      password,
      role: 'student',
      grade: parseInt(grade),
      completedProblems: [],
      points: 0,
      achievements: [],
      streakDays: 0,
      lastActiveAt: new Date(),
      createdAt: new Date(),
      purchasedItems: [],
      equippedAvatar: null,
      equippedFrame: null,
    };

    const created = await createUser(newStudent);
    const { password: _, ...safeUser } = created;

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
