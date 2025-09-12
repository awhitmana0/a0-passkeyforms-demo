# Login with Autopasskey Option - Standalone

This is a self-contained version of the login-with-autopasskey-option theme extracted from the main Auth0 ACUL React boilerplate project.

## Features

- Custom login screen with autopasskey support using Auth0 ACUL JS
- WebAuthn conditional UI integration for seamless passkey experience
- Support for passkey-only mode (ext-passkeyonly parameter)
- Google OAuth integration
- React-based UI components with TypeScript support
- Vite build system for development and production
- Custom CSS styling with Poppins font

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm or yarn

### Installation

```bash
npm install
```

### Development

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

### Building

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint:format` - Check code formatting

## Usage

This theme is designed to work with Auth0's Authentication Challenge Universal Login (ACUL) system. It specifically handles login-id screens with enhanced passkey capabilities.

### Key Features

- **Conditional WebAuthn UI**: Automatically shows subtle passkey popup when user clicks email field
- **Passkey-Only Mode**: When `ext-passkeyonly=true` parameter is present, shows streamlined passkey-only interface
- **Social Login**: Integrated Google OAuth login option
- **Responsive Design**: Mobile-friendly responsive layout
- **Theme Integration**: Full Auth0 branding theme support

### Parameters

- `ext-passkeyonly=true` - Activates passkey-only mode, hiding email/password options

## Project Structure

```
src/
├── components/                # React components
│   └── CustomLoginIdScreen.tsx
├── shared/                   # Shared components
│   └── components/
├── styles/                   # CSS files
├── utils/                    # Utility functions
│   ├── theme/               # Theme engine and flatteners
│   └── helpers/             # URL utilities
├── App.tsx                  # Main app component
└── main.tsx                 # Entry point
```

## Dependencies

- `@auth0/auth0-acul-js` - Auth0 ACUL JavaScript SDK
- `react` & `react-dom` - React framework
- `vite` - Build tool and dev server
- `typescript` - Type checking

## WebAuthn Integration

This theme includes advanced WebAuthn integration:

- **Conditional UI**: Uses `navigator.credentials.get()` with `mediation: 'conditional'` for subtle passkey prompts
- **Automatic Detection**: Detects passkey-only mode from Auth0 parameters
- **Fallback Handling**: Graceful fallback when WebAuthn is not available
- **Cross-browser Support**: Works across modern browsers with WebAuthn support