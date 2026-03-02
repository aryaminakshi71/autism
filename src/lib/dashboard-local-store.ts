export function loadEntityList<T>(storageKey: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed as T[];
  } catch {
    return fallback;
  }
}

export function saveEntityList<T>(storageKey: string, items: T[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage write failures and keep in-memory state functional.
  }
}
