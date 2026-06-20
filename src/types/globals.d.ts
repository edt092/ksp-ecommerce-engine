import 'react';

// Allow CSS custom properties (--variable) in inline style objects
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

// Analytics globals injected by Google Tag Manager
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// CSS file imports (side-effect and module)
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

export {};
