import { sendEmail, sendSms } from "./providers";

type Env = Record<string, string | undefined>;

export async function notifyClinicalReview(
  env: Env,
  recipient: { email?: string; phone?: string },
  sessionId: string,
) {
  const subject = "Session note ready for review";
  const body = `Session ${sessionId} is ready for clinical review.`;
  const tasks: Promise<unknown>[] = [];
  if (recipient.email)
    tasks.push(
      sendEmail(env, { to: recipient.email, subject, html: `<p>${body}</p>` }),
    );
  if (recipient.phone) tasks.push(sendSms(env, { to: recipient.phone, body }));
  return Promise.allSettled(tasks);
}
