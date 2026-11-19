export type PendingClinicalEvent = {
  id: string;
  type: "trial" | "frequency" | "duration" | "abc";
  payload: Record<string, unknown>;
  createdAt: string;
};

const key = "care-offline-clinical-events";

export function queueClinicalEvent(
  event: Omit<PendingClinicalEvent, "id" | "createdAt">,
) {
  const events = readClinicalEvents();
  const next = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify([...events, next]));
  return next;
}

export function readClinicalEvents(): PendingClinicalEvent[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function removeClinicalEvents(ids: string[]) {
  const removable = new Set(ids);
  localStorage.setItem(
    key,
    JSON.stringify(
      readClinicalEvents().filter((event) => !removable.has(event.id)),
    ),
  );
}

export async function replayClinicalEvents(
  send: (event: PendingClinicalEvent) => Promise<void>,
) {
  const events = readClinicalEvents();
  const delivered: string[] = [];
  for (const event of events) {
    try {
      await send(event);
      delivered.push(event.id);
    } catch {
      break;
    }
  }
  if (delivered.length) removeClinicalEvents(delivered);
  return {
    delivered: delivered.length,
    remaining: events.length - delivered.length,
  };
}
