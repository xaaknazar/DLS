import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, initializeDatabase } from '@/lib/db';
import { Student } from '@/types';
import { getShopItemById } from '@/data/shop';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const { itemId, action } = await request.json();

    const user = await getUserById(id);

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = user as Student;
    const item = getShopItemById(itemId);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Initialize arrays if they don't exist
    const purchasedItems = student.purchasedItems || [];
    let equippedAvatar = student.equippedAvatar || null;
    let equippedFrame = student.equippedFrame || null;

    if (action === 'purchase') {
      // Check if already owned
      if (purchasedItems.includes(itemId)) {
        return NextResponse.json({ error: 'Already owned' }, { status: 400 });
      }

      // Check if can afford
      if (student.points < item.price) {
        return NextResponse.json({ error: 'Not enough points' }, { status: 400 });
      }

      // Purchase the item
      const updatedStudent = await updateUser(id, {
        points: student.points - item.price,
        purchasedItems: [...purchasedItems, itemId],
      });

      if (!updatedStudent) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
      }

      const { password, ...safeUser } = updatedStudent;
      return NextResponse.json(safeUser);
    }

    if (action === 'equip') {
      // Check if owned
      if (!purchasedItems.includes(itemId)) {
        return NextResponse.json({ error: 'Item not owned' }, { status: 400 });
      }

      // Equip the item based on category
      const updates: Partial<Student> = {};

      if (item.category === 'avatar') {
        updates.equippedAvatar = itemId;
      } else if (item.category === 'frame') {
        updates.equippedFrame = itemId;
      }

      const updatedStudent = await updateUser(id, updates);

      if (!updatedStudent) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
      }

      const { password, ...safeUser } = updatedStudent;
      return NextResponse.json(safeUser);
    }

    if (action === 'unequip') {
      const updates: Partial<Student> = {};

      if (item.category === 'avatar') {
        updates.equippedAvatar = null;
      } else if (item.category === 'frame') {
        updates.equippedFrame = null;
      }

      const updatedStudent = await updateUser(id, updates);

      if (!updatedStudent) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
      }

      const { password, ...safeUser } = updatedStudent;
      return NextResponse.json(safeUser);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Shop error:', error);
    return NextResponse.json({ error: 'Shop operation failed' }, { status: 500 });
  }
}
