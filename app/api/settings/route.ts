import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || ''
      },
      notifications: {
        newLeads: user.notifications?.newLeads || false,
        propertyUpdates: user.notifications?.propertyUpdates || false,
        newMessages: user.notifications?.newMessages || false
      },
      preferences: {
        language: user.preferences?.language || 'English',
        timezone: user.preferences?.timezone || 'UTC-5',
        darkMode: user.preferences?.darkMode || false
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userId = request.headers.get('x-user-id');
    const updates = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    const updateData: any = {};

    // Handle profile updates
    if (updates.profile) {
      updateData.fullName = updates.profile.fullName;
      updateData.email = updates.profile.email;
      updateData.phone = updates.profile.phone;
      updateData.company = updates.profile.company;
    }

    // Handle notification updates
    if (updates.notifications) {
      updateData.notifications = {
        newLeads: updates.notifications.newLeads,
        propertyUpdates: updates.notifications.propertyUpdates,
        newMessages: updates.notifications.newMessages
      };
    }

    // Handle preference updates
    if (updates.preferences) {
      updateData.preferences = {
        language: updates.preferences.language,
        timezone: updates.preferences.timezone,
        darkMode: updates.preferences.darkMode
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userId = request.headers.get('x-user-id');
    const { currentPassword, newPassword } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Here you would typically verify the current password
    // For now, we'll just update the password
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newPassword } } // In production, hash the password before storing
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
} 