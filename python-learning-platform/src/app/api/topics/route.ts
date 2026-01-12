import { NextRequest, NextResponse } from 'next/server';
import { getTopics, getTopicsByGrade, createTopic, initializeDatabase } from '@/lib/db';
import { Topic } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    let topics: Topic[];

    if (grade) {
      topics = await getTopicsByGrade(parseInt(grade));
    } else {
      topics = await getTopics();
    }

    return NextResponse.json(topics);
  } catch (error) {
    console.error('Get topics error:', error);
    return NextResponse.json({ error: 'Failed to get topics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const topic = await request.json();

    const newTopic = await createTopic({
      ...topic,
      id: topic.id || `topic-${Date.now()}`,
      problemIds: topic.problemIds || [],
    });

    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
