import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Validate MLS token with the provider
async function validateMLSToken(token: string, provider: string): Promise<boolean> {
  try {
    const response = await fetch(process.env.MLS_API_URL + '?$top=1', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating MLS token:', error);
    return false;
  }
}

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

    // If user has MLS connection, validate the token
    if (user.mlsConnected && user.mlsToken) {
      const isValid = await validateMLSToken(user.mlsToken, user.mlsProvider);
      if (!isValid) {
        // Token is invalid, update user's MLS connection status
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              mlsConnected: false,
              mlsToken: null,
              mlsProvider: null,
              mlsConnectedAt: null,
              mlsAutoSync: false,
              mlsNotifications: false
            }
          }
        );
        return NextResponse.json({
          mlsConnected: false,
          autoSync: false,
          notifications: false,
          lastSync: null,
          error: 'MLS token is invalid'
        });
      }
    }

    return NextResponse.json({
      mlsConnected: user.mlsConnected || false,
      autoSync: user.mlsAutoSync || false,
      notifications: user.mlsNotifications || false,
      lastSync: user.mlsLastSync || null,
      provider: user.mlsProvider || null
    });
  } catch (error) {
    console.error('Error fetching MLS settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MLS settings' },
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

    if (typeof updates.autoSync === 'boolean') {
      updateData.mlsAutoSync = updates.autoSync;
      if (updates.autoSync) {
        updateData.mlsLastSync = new Date();
      }
    }

    if (typeof updates.notifications === 'boolean') {
      updateData.mlsNotifications = updates.notifications;
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

    return NextResponse.json({ message: 'MLS settings updated successfully' });
  } catch (error) {
    console.error('Error updating MLS settings:', error);
    return NextResponse.json(
      { error: 'Failed to update MLS settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userId = request.headers.get('x-user-id');
    const { mlsToken, mlsProvider } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    if (!mlsToken || !mlsProvider) {
      return NextResponse.json({ error: 'MLS token and provider are required' }, { status: 400 });
    }

    // Validate the MLS token
    const isValid = await validateMLSToken(mlsToken, mlsProvider);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MLS token' },
        { status: 400 }
      );
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          mlsConnected: true,
          mlsToken,
          mlsProvider,
          mlsConnectedAt: new Date(),
          mlsLastSync: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'MLS connection established successfully' });
  } catch (error) {
    console.error('Error connecting MLS:', error);
    return NextResponse.json(
      { error: 'Failed to connect MLS' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          mlsConnected: false,
          mlsToken: null,
          mlsProvider: null,
          mlsConnectedAt: null,
          mlsAutoSync: false,
          mlsNotifications: false,
          mlsLastSync: null
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'MLS connection removed successfully' });
  } catch (error) {
    console.error('Error removing MLS connection:', error);
    return NextResponse.json(
      { error: 'Failed to remove MLS connection' },
      { status: 500 }
    );
  }
} 