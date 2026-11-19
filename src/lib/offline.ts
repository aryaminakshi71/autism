interface OfflineAction {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

const OFFLINE_ACTIONS_KEY = "offline_actions";
const MAX_OFFLINE_ACTIONS = 100;

export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}

export function setupOfflineDetection(
  onOnline?: () => void,
  onOffline?: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => {
    console.log("Back online - syncing offline actions");
    onOnline?.();
    syncOfflineData();
  };

  const handleOffline = () => {
    console.log("Offline mode activated");
    onOffline?.();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

export function queueOfflineAction(
  action: Omit<OfflineAction, "id" | "timestamp" | "retryCount">,
): void {
  if (isOnline()) return;

  const actions = getOfflineActions();

  if (actions.length >= MAX_OFFLINE_ACTIONS) {
    console.warn("Max offline actions reached, dropping oldest");
    actions.shift();
  }

  const newAction: OfflineAction = {
    ...action,
    id: generateId(),
    timestamp: Date.now(),
    retryCount: 0,
  };

  actions.push(newAction);
  localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));

  console.log("Action queued for sync:", action.type);
}

export function getOfflineActions(): OfflineAction[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(OFFLINE_ACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function removeOfflineAction(id: string): void {
  const actions = getOfflineActions();
  const filtered = actions.filter((a) => a.id !== id);
  localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(filtered));
}

export function clearOfflineActions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_ACTIONS_KEY);
}

async function syncOfflineData(): Promise<void> {
  if (!isOnline()) return;

  const actions = getOfflineActions();
  if (actions.length === 0) return;

  console.log(`Syncing ${actions.length} offline actions...`);

  const successfulIds: string[] = [];
  const failedActions: OfflineAction[] = [];

  for (const action of actions) {
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });

      if (response.ok) {
        successfulIds.push(action.id);
      } else {
        action.retryCount++;
        if (action.retryCount < 3) {
          failedActions.push(action);
        }
      }
    } catch {
      action.retryCount++;
      if (action.retryCount < 3) {
        failedActions.push(action);
      }
    }
  }

  const remainingActions = actions.filter(
    (a) =>
      !successfulIds.includes(a.id) && failedActions.find((f) => f.id === a.id),
  );

  localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(remainingActions));

  if (successfulIds.length > 0) {
    console.log(`Successfully synced ${successfulIds.length} actions`);
  }

  if (remainingActions.length > 0) {
    console.warn(`${remainingActions.length} actions failed to sync`);
  }
}

export function retryFailedActions(): void {
  syncOfflineData();
}

export function getSyncStatus(): {
  pending: number;
  lastSync: number | null;
  isOnline: boolean;
} {
  const actions = getOfflineActions();
  const pending = actions.filter((a) => a.retryCount < 3).length;

  const lastSync =
    actions.length > 0 ? Math.max(...actions.map((a) => a.timestamp)) : null;

  return {
    pending,
    lastSync,
    isOnline: isOnline(),
  };
}

export function setupBackgroundSync(tag: string = "default"): void {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((registration) => {
      const sync = (
        registration as ServiceWorkerRegistration & {
          sync?: { register: (tag: string) => Promise<void> };
        }
      ).sync;
      if (!sync) return;
      sync
        .register(`sync-${tag}`)
        .then(() => {
          console.log("Background sync registered");
        })
        .catch((err: unknown) => {
          console.warn("Background sync registration failed:", err);
        });
    });
  }
}

export function useOfflineStatus(): {
  isOnline: boolean;
  pendingActions: number;
  lastSync: number | null;
} {
  const [status, setStatus] = React.useState({
    isOnline: true,
    pendingActions: 0,
    lastSync: null as number | null,
  });

  React.useEffect(() => {
    const cleanup = setupOfflineDetection(
      () => setStatus((s) => ({ ...s, isOnline: true })),
      () => setStatus((s) => ({ ...s, isOnline: false })),
    );

    const updateStatus = () => {
      const { pending, lastSync, isOnline } = getSyncStatus();
      setStatus({ pendingActions: pending, lastSync, isOnline });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  return status;
}

import React from "react";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
