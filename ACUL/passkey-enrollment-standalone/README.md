# Passkey Enrollment Theme - Standalone

This is a self-contained version of the passkey-enrollment-theme extracted from the main Auth0 ACUL React boilerplate project.

## Features

- Passkey enrollment functionality using Auth0 ACUL JS
- React-based UI components
- TypeScript support
- Vite build system
- CSS styling for theme customization

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

The application will be available at `http://localhost:3000`.

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

This theme is designed to work with Auth0's Authentication Challenge Universal Login (ACUL) system. It specifically handles passkey enrollment screens.

## Project Structure

```
src/
├── components/          # React components
├── shared/             # Shared components
├── styles/             # CSS files
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Dependencies

- `@auth0/auth0-acul-js` - Auth0 ACUL JavaScript SDK
- `react` & `react-dom` - React framework
- `vite` - Build tool and dev server
- `typescript` - Type checking