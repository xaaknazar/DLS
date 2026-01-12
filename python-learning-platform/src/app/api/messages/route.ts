import { NextRequest, NextResponse } from 'next/server';
import { getMessagesBetweenUsers, getUnreadMessagesForUser, createMessage, markMessagesAsRead, getConversationsForTeacher, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const withUserId = searchParams.get('withUserId');
    const unread = searchParams.get('unread');
    const conversations = searchParams.get('conversations');

    if (conversations && userId) {
      // Get all conversations for teacher
      const convs = await getConversationsForTeacher(userId);
      return NextResponse.json(convs);
    }

    if (userId && withUserId) {
      const messages = await getMessagesBetweenUsers(userId, withUserId);
      return NextResponse.json(messages);
    }

    if (userId && unread === 'true') {
      const messages = await getUnreadMessagesForUser(userId);
      return NextResponse.json(messages);
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const message = await request.json();

    const newMessage = await createMessage({
      ...message,
      id: message.id || `msg-${Date.now()}`,
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await initializeDatabase();
    const { userId, fromUserId } = await request.json();

    await markMessagesAsRead(userId, fromUserId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark messages read error:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
}
