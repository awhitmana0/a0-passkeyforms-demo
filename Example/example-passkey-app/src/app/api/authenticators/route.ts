import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getManagementClient } from '@/lib/auth0-management';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const managementClient = await getManagementClient();
    
    const authenticators = await managementClient.getUserAuthenticators({
      user_id: session.user.sub,
    });

    return NextResponse.json(authenticators || []);
  } catch (error) {
    console.error('Error fetching authenticators:', error);
    return NextResponse.json({ error: 'Failed to fetch authenticators' }, { status: 500 });
  }
}