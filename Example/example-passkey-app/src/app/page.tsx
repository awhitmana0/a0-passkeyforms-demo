'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import PasskeyManager from '@/components/PasskeyManager';

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error.message}</div>;

  return (
    <div className="container">
      <h1>Simple Passkey Demo</h1>
      <p style={{ marginBottom: '2rem', color: '#6c757d' }}>
        This demo shows how to integrate Auth0 passkey enrollment and revocation in a simple Next.js app.
      </p>

      {user ? (
        <>
          <div className="card">
            <h2>Welcome back!</h2>
            <div className="user-info">
              <div className="avatar">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  user.name?.[0] || user.email?.[0] || 'U'
                )}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{user.name || 'User'}</h3>
                <p style={{ margin: 0, color: '#6c757d' }}>{user.email}</p>
              </div>
            </div>
            <a href="/api/auth/logout" className="button button-danger">
              Logout
            </a>
          </div>

          <PasskeyManager />
        </>
      ) : (
        <div className="card">
          <h2>Get Started</h2>
          <p style={{ marginBottom: '2rem' }}>
            Sign in to your account to manage your passkeys. You can enroll new passkeys and revoke existing ones.
          </p>
          
          <div style={{ marginBottom: '1rem' }}>
            <a href="/api/auth/login" className="button">
              Login with Auth0
            </a>
          </div>
          
          <div>
            <a 
              href="/api/auth/login?acr_values=passkey_enroll" 
              className="button"
              style={{ backgroundColor: '#28a745' }}
            >
              Login & Enroll Passkey
            </a>
          </div>
          
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
            The second button will prompt you to log in and immediately enroll a passkey if one isn't already available.
          </p>
        </div>
      )}

      <div className="card" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
        <h3 style={{ marginBottom: '1rem' }}>How it works:</h3>
        <ol style={{ paddingLeft: '1.5rem', color: '#495057' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Login:</strong> Authenticate with your Auth0 account using username/password or social login
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Enroll Passkey:</strong> Use the "Add New Passkey" button or login URL with `acr_values=passkey_enroll`
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Manage:</strong> View all your enrolled passkeys and revoke any you no longer need
          </li>
          <li>
            <strong>Use:</strong> Next time you login, you can use your enrolled passkey for passwordless authentication
          </li>
        </ol>
      </div>
    </div>
  );
}