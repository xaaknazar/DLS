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

      // Check if can afford - use shopPoints for purchases (не рейтинговые баллы!)
      const currentShopPoints = student.shopPoints ?? student.points ?? 0;
      if (currentShopPoints < item.price) {
        return NextResponse.json({ error: 'Not enough points' }, { status: 400 });
      }

      // Purchase the item - deduct ONLY shopPoints (not rating points!)
      const newShopPoints = currentShopPoints - item.price;
      const newPurchasedItems = [...purchasedItems, itemId];

      console.log(`[Shop] Student ${student.name} buying ${item.nameRu} for ${item.price} points. Shop Balance: ${currentShopPoints} -> ${newShopPoints}. Rating points unchanged: ${student.points}`);

      const updatedStudent = await updateUser(id, {
        shopPoints: newShopPoints,
        purchasedItems: newPurchasedItems,
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

    // Teacher actions: give/remove items without affecting points
    if (action === 'give') {
      // Give item to student (teacher action, no points deducted)
      if (purchasedItems.includes(itemId)) {
        return NextResponse.json({ error: 'Already owned' }, { status: 400 });
      }

      const updatedStudent = await updateUser(id, {
        purchasedItems: [...purchasedItems, itemId],
      });

      if (!updatedStudent) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
      }

      const { password, ...safeUser } = updatedStudent;
      return NextResponse.json(safeUser);
    }

    if (action === 'remove') {
      // Remove item from student (teacher action)
      if (!purchasedItems.includes(itemId)) {
        return NextResponse.json({ error: 'Item not owned' }, { status: 400 });
      }

      // Remove from purchased items
      const newPurchasedItems = purchasedItems.filter((i: string) => i !== itemId);

      // Unequip if it was equipped
      const updates: Partial<Student> = {
        purchasedItems: newPurchasedItems,
      };

      if (student.equippedAvatar === itemId) {
        updates.equippedAvatar = null;
      }
      if (student.equippedFrame === itemId) {
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
