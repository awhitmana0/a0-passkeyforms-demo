import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';

export const metadata = {
  title: 'Simple Passkey Demo',
  description: 'Auth0 Passkey Enrollment and Revocation Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}