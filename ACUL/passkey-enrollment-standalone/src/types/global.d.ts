declare global {
  interface Window {
    universal_login_context?: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_SCREEN_NAME?: string;
  readonly DEV?: boolean;
  readonly MODE?: string;
  readonly BASE_URL?: string;
  readonly PROD?: boolean;
  readonly SSR?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css" {
  const content: string;
  export default content;
}

export {};