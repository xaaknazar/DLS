import { NextRequest, NextResponse } from 'next/server';
import { getTopicById, updateTopic, deleteTopic, initializeDatabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const topic = await getTopicById(id);

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Get topic error:', error);
    return NextResponse.json({ error: 'Failed to get topic' }, { status: 500 });
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

    const topic = await updateTopic(id, updates);

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Update topic error:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;

    const deleted = await deleteTopic(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete topic error:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}
