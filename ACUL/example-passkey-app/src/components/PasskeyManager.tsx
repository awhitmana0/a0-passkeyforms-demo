'use client';

import { useState, useEffect } from 'react';

type Authenticator = {
  id: string;
  type: string;
  authenticator_type?: string;
  name?: string;
  created_at: string;
  last_auth?: string;
  last_auth_at?: string;
  confirmed?: boolean;
  credential_device_type?: string;
  credential_backed_up?: boolean;
  user_agent?: string;
};

export default function PasskeyManager() {
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const fetchAuthenticators = async () => {
    try {
      const response = await fetch('/api/authenticators');
      if (response.ok) {
        const data = await response.json();
        setAuthenticators(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch authenticators:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeAuthenticator = async (id: string) => {
    setRevoking(id);
    try {
      const response = await fetch(`/api/authenticators/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAuthenticators(prev => prev.filter(auth => auth.id !== id));
        alert('Passkey revoked successfully!');
      } else {
        alert('Failed to revoke passkey');
      }
    } catch (error) {
      console.error('Failed to revoke authenticator:', error);
      alert('Failed to revoke passkey');
    } finally {
      setRevoking(null);
    }
  };

  const enrollPasskey = async () => {
    setEnrolling(true);
    
    try {
      // Redirect to Auth0 with passkey enrollment
      const baseUrl = window.location.origin;
      const returnTo = encodeURIComponent(`${baseUrl}/`);
      const authUrl = `/api/auth/login?acr_values=passkey_enroll&returnTo=${returnTo}`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating passkey enrollment:', error);
      alert('Failed to initiate passkey enrollment');
      setEnrolling(false);
    }
  };

  const getAuthenticatorDisplayName = (authenticator: Authenticator): string => {
    const type = authenticator.authenticator_type || authenticator.type;
    
    switch (type) {
      case 'webauthn-platform':
        return 'Platform Authenticator (TouchID/FaceID/Windows Hello)';
      case 'webauthn-roaming':
        return 'Security Key (FIDO2/Hardware Key)';
      case 'passkey':
        if (authenticator.credential_device_type === 'single_device') {
          return 'Platform Passkey (TouchID/FaceID/Windows Hello)';
        }
        return 'Passkey';
      default:
        return `Passkey (${type})`;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchAuthenticators();
  }, []);

  return (
    <div className="card">
      <h2>Passkey Management</h2>
      <p style={{ marginBottom: '2rem', color: '#6c757d' }}>
        Manage your enrolled passkeys and security keys. You can revoke any passkey you no longer want to use.
      </p>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading passkeys...</span>
        </div>
      )}

      {!loading && authenticators.length === 0 && (
        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
          No passkeys are currently enrolled. Click "Add New Passkey" to enroll your first passkey.
        </p>
      )}

      {!loading && authenticators.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Passkeys:</h3>
          {authenticators.map((auth) => (
            <div key={auth.id} className="authenticator-item">
              <div className="authenticator-info">
                <h3>{getAuthenticatorDisplayName(auth)}</h3>
                <p>Created: {formatDate(auth.created_at)}</p>
                {(auth.last_auth_at || auth.last_auth) && (
                  <p>Last used: {formatDate(auth.last_auth_at || auth.last_auth!)}</p>
                )}
                {auth.user_agent && (
                  <p style={{ fontSize: '0.75rem' }}>Device: {auth.user_agent}</p>
                )}
              </div>
              <button
                className="button button-danger"
                onClick={() => revokeAuthenticator(auth.id)}
                disabled={revoking === auth.id}
              >
                {revoking === auth.id ? (
                  <span className="loading">
                    <div className="spinner"></div>
                    Revoking...
                  </span>
                ) : (
                  'Revoke'
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <button
          className="button"
          onClick={enrollPasskey}
          disabled={enrolling}
        >
          {enrolling ? (
            <span className="loading">
              <div className="spinner"></div>
              Enrolling...
            </span>
          ) : (
            'Add New Passkey'
          )}
        </button>
      )}

      <button
        className="button"
        onClick={fetchAuthenticators}
        disabled={loading}
        style={{ marginLeft: '0.5rem' }}
      >
        {loading ? (
          <span className="loading">
            <div className="spinner"></div>
            Refreshing...
          </span>
        ) : (
          'Refresh List'
        )}
      </button>
    </div>
  );
}