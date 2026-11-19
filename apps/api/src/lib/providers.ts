type ProviderEnv = Record<string, string | undefined>;

function requireEnv(env: ProviderEnv, names: string[]) {
  const missing = names.filter((name) => !env[name]);
  if (missing.length)
    throw new Error(`Provider is not configured: ${missing.join(", ")}`);
}

export async function sendEmail(
  env: ProviderEnv,
  message: { to: string; subject: string; html: string },
) {
  requireEnv(env, ["RESEND_API_KEY", "EMAIL_FROM"]);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, ...message }),
  });
  if (!response.ok) throw new Error("Email delivery failed");
  return response.json();
}

export async function sendSms(
  env: ProviderEnv,
  message: { to: string; body: string },
) {
  requireEnv(env, [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_FROM_NUMBER",
  ]);
  const credentials = btoa(
    `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
  );
  const body = new URLSearchParams({
    To: message.to,
    From: env.TWILIO_FROM_NUMBER!,
    Body: message.body,
  });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );
  if (!response.ok) throw new Error("SMS delivery failed");
  return response.json();
}
