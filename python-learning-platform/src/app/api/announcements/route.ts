import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement } from '@/lib/db';
import { Announcement } from '@/types';

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    return NextResponse.json({ error: 'Failed to get announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, authorName, isImportant } = body;

    if (!title || !content || !authorId || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      authorId,
      authorName,
      isImportant: isImportant || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await createAnnouncement(announcement);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
