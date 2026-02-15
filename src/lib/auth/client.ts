import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const baseOrigin =
  typeof window !== "undefined"
    ? window.location.origin
    : import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${baseOrigin}/api/auth`,
  plugins: [organizationClient()],
});

export const { signIn, signOut, signUp, useSession, useActiveOrganization } =
  authClient;
