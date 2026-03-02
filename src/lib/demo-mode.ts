export type DemoUserProfile = {
  name?: string;
  email?: string;
};

export function isDemoModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem("demo_mode") === "true" ||
    window.localStorage.getItem("isDemo") === "true"
  );
}

export function readDemoUserProfile(): DemoUserProfile {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
    };
  } catch {
    return {};
  }
}

export function writeDemoUserProfile(profile: DemoUserProfile): void {
  if (typeof window === "undefined") return;

  let existing: Record<string, unknown> = {};
  try {
    const raw = window.localStorage.getItem("user");
    if (raw) existing = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    existing = {};
  }

  const name = (profile.name ?? "").trim();
  const [firstName = "", ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const nextUser: Record<string, unknown> = {
    ...existing,
    ...(profile.email ? { email: profile.email } : {}),
    ...(name ? { name } : {}),
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
  };

  window.localStorage.setItem("user", JSON.stringify(nextUser));
}
