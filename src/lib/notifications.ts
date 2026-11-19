export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;

    if (!vapidKey) {
      console.warn("VAPID key not configured");
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        vapidKey,
      ) as unknown as BufferSource,
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    console.log("Push subscription successful");
    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      console.log("Push unsubscription successful");
    }
  } catch (error) {
    console.error("Push unsubscription failed:", error);
  }
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export function showLocalNotification(
  title: string,
  options?: NotificationOptions,
): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    ...options,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

export function scheduleNotification(
  title: string,
  delay: number,
  options?: NotificationOptions,
): ReturnType<typeof setTimeout> {
  const timeoutId = setTimeout(() => {
    showLocalNotification(title, options);
  }, delay);

  return timeoutId;
}

export function cancelScheduledNotification(
  timeoutId: ReturnType<typeof setTimeout>,
): void {
  clearTimeout(timeoutId);
}

interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export async function sendTestNotification(
  payload: NotificationPayload,
): Promise<void> {
  if (Notification.permission !== "granted") {
    await requestNotificationPermission();
  }

  showLocalNotification(payload.title, {
    body: payload.body,
    icon: payload.icon ?? "/icons/icon-192.png",
    badge: payload.badge ?? "/icons/icon-72.png",
    tag: payload.tag,
    data: payload.data,
    actions: payload.actions,
  } as NotificationOptions);
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export function isNotificationSupported(): boolean {
  return "Notification" in window;
}
