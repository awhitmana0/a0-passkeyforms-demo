# Simple Passkey Demo

A minimal Auth0 integration demonstrating passkey enrollment and revocation functionality.

## Features

- **Simple Login/Logout** with Auth0
- **Passkey Enrollment** using `acr_values=passkey_enroll`
- **List Enrolled Passkeys** via Auth0 Management API
- **Revoke Passkeys** with one-click deletion
- **Clean, Simple UI** - no complex styling frameworks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in your Auth0 credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
```
AUTH0_SECRET='your-32-character-secret-key'
AUTH0_BASE_URL='http://localhost:3001'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'

# Management API (for passkey management)
AUTH0_MGMT_DOMAIN='your-tenant.auth0.com'
AUTH0_MGMT_CLIENT_ID='your-management-client-id'
AUTH0_MGMT_CLIENT_SECRET='your-management-client-secret'

# Public Configuration
NEXT_PUBLIC_AUTH0_DOMAIN='your-tenant.auth0.com'
NEXT_PUBLIC_AUTH0_CLIENT_ID='your-client-id'
```

### 3. Auth0 Setup Requirements

#### Application Configuration
- **Application Type:** Regular Web Application
- **Allowed Callback URLs:** `http://localhost:3001/api/auth/callback`
- **Allowed Logout URLs:** `http://localhost:3001`
- **Allowed Web Origins:** `http://localhost:3001`

#### Management API Application
Create a Machine-to-Machine application with these scopes:
- `read:users`
- `update:users` 
- `read:authenticators`
- `delete:authenticators`

#### Passkey Configuration
Ensure your Auth0 tenant has:
- **MFA enabled** in your tenant settings
- **WebAuthn** factor enabled
- **Adaptive MFA** or **Always** MFA policy configured

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3001`

## How It Works

### Authentication Flow
1. **Login:** Click "Login with Auth0" for standard authentication
2. **Passkey Enrollment:** Use "Login & Enroll Passkey" or the "Add New Passkey" button when logged in
3. **Management:** View and revoke enrolled passkeys in the dashboard

### API Endpoints

- `GET /api/authenticators` - List user's authenticators
- `DELETE /api/authenticators/[id]` - Revoke specific authenticator

### Key Components

#### PasskeyManager Component
```typescript
// Main component handling passkey list and management
src/components/PasskeyManager.tsx
```

Features:
- Fetches and displays enrolled passkeys
- Handles passkey revocation
- Initiates passkey enrollment flow
- Real-time loading states

#### Auth0 Management Integration
```typescript
// Management API client setup
src/lib/auth0-management.ts
```

Provides:
- Secure Management API client
- Proper scoping for authenticator operations

## Testing the Integration

### 1. Test Basic Login
- Click "Login with Auth0"
- Authenticate with username/password
- Verify you see the welcome screen

### 2. Test Passkey Enrollment
- Click "Add New Passkey" (or use direct login link)
- Follow browser prompts to create passkey
- Verify passkey appears in the list

### 3. Test Passkey Revocation
- Click "Revoke" next to any enrolled passkey
- Confirm passkey is removed from list
- Verify passkey no longer works for login

### 4. Test Passkey Login
- Logout and return to login screen
- Your browser should offer passkey option
- Test passwordless login flow

## Project Structure

```
example-passkey-app/
├── src/
│   ├── app/
│   │   ├── api/auth/[...auth0]/route.ts    # Auth0 handler
│   │   ├── api/authenticators/
│   │   │   ├── route.ts                    # List authenticators
│   │   │   └── [authenticatorId]/route.ts # Delete authenticator
│   │   ├── layout.tsx                      # Root layout with UserProvider
│   │   ├── page.tsx                        # Main page
│   │   └── globals.css                     # Simple styles
│   ├── components/
│   │   └── PasskeyManager.tsx              # Passkey management UI
│   └── lib/
│       ├── auth0.ts                        # Auth0 SDK config
│       └── auth0-management.ts             # Management API client
├── .env.local.example                      # Environment template
├── package.json
└── README.md
```

## Troubleshooting

### Common Issues

**"Not authenticated" errors:**
- Verify your session is active
- Check Auth0 configuration in `.env.local`

**"Failed to fetch authenticators":**
- Verify Management API credentials
- Ensure proper scopes are granted
- Check Management API application configuration

**Passkey enrollment not working:**
- Verify MFA is enabled in your tenant
- Ensure WebAuthn factor is enabled
- Check browser compatibility (Chrome/Safari/Edge)

**HTTPS requirements:**
- Passkeys require HTTPS in production
- Use `http://localhost` for local development only

### Debug Tips

1. **Check Browser Console:** Look for network errors and WebAuthn API calls
2. **Verify Scopes:** Ensure Management API has required permissions
3. **Test Auth0 Dashboard:** Use Auth0's dashboard to verify user authenticators
4. **Check Network Tab:** Inspect API calls to `/api/authenticators` endpoints

## Production Deployment

### Environment Variables
Update these for production:
- `AUTH0_BASE_URL` - Your production domain
- `AUTH0_SECRET` - Generate new 32-character secret
- All callback URLs in Auth0 dashboard

### Security Considerations
- Use HTTPS in production (required for passkeys)
- Rotate Management API credentials regularly
- Monitor authenticator usage and revocation patterns
- Implement proper error handling and logging

## Next Steps

This example provides the foundation for passkey integration. Consider adding:

- **Error handling** with user-friendly messages
- **Loading states** for better UX
- **Audit logging** for security compliance
- **Batch operations** for multiple passkey management
- **User preferences** for passkey naming and organization

For more advanced features, refer to the full implementation in the main project directory.