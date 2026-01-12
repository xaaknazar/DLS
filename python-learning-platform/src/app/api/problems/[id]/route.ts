import { NextRequest, NextResponse } from 'next/server';
import { getProblemById, updateProblem, deleteProblem, initializeDatabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const problem = await getProblemById(id);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Get problem error:', error);
    return NextResponse.json({ error: 'Failed to get problem' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const updates = await request.json();

    const problem = await updateProblem(id, updates);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Update problem error:', error);
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const deleted = await deleteProblem(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete problem error:', error);
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}
