import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getManagementClient } from '@/lib/auth0-management';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { authenticatorId: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const managementClient = await getManagementClient();
    
    await managementClient.deleteUserAuthenticator({
      user_id: session.user.sub,
      authenticator_id: params.authenticatorId,
    });

    return NextResponse.json({ id: params.authenticatorId });
  } catch (error) {
    console.error('Error deleting authenticator:', error);
    return NextResponse.json({ error: 'Failed to delete authenticator' }, { status: 500 });
  }
}