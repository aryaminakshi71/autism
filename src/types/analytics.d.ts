// Third-party analytics globals attached to window at runtime.
export {};

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: unknown) => void;
    };
  }
}
