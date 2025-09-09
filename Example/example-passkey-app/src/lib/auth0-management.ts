import { ManagementClient } from 'auth0';

let managementClient: ManagementClient | null = null;

export async function getManagementClient(): Promise<ManagementClient> {
  if (!managementClient) {
    managementClient = new ManagementClient({
      domain: process.env.AUTH0_MGMT_DOMAIN!,
      clientId: process.env.AUTH0_MGMT_CLIENT_ID!,
      clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET!,
      scope: 'read:users update:users read:authenticators delete:authenticators',
    });
  }
  return managementClient;
}