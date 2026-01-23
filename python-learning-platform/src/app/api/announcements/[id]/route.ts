import { NextRequest, NextResponse } from 'next/server';
import { getAnnouncementById, updateAnnouncement, deleteAnnouncement } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    return NextResponse.json({ error: 'Failed to get announcement' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateAnnouncement(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteAnnouncement(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
