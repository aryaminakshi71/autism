/**
 * Billing Router (Stripe)
 *
 * Real Stripe Checkout + Billing Portal via the Stripe REST API.
 * Set STRIPE_SECRET_KEY in the environment.
 */

import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { orgAuthed } from "../procedures";

const PLANS = {
  starter: { name: "Solo", amount: 2900, currency: "usd" },
  growth: { name: "Clinic", amount: 3900, currency: "usd" },
  pro: { name: "Growth", amount: 4900, currency: "usd" },
} as const;

function secretKey(context: any): string {
  const key =
    context?.env?.STRIPE_SECRET_KEY ??
    (typeof process !== "undefined"
      ? process.env.STRIPE_SECRET_KEY
      : undefined);
  if (!key) {
    throw new ORPCError("SERVICE_UNAVAILABLE", {
      message: "Stripe not configured (STRIPE_SECRET_KEY missing)",
    });
  }
  return key;
}

async function stripePost(
  path: string,
  body: Record<string, string>,
  secret: string,
) {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  const data = (await res.json()) as any;
  if (!res.ok) {
    throw new ORPCError("BAD_REQUEST", {
      message: data?.error?.message || "Stripe request failed",
    });
  }
  return data;
}

export const billingRouter = {
  plans: orgAuthed
    .route({
      method: "GET",
      path: "/billing/plans",
      summary: "List subscription plans",
      tags: ["Billing"],
    })
    .output(z.any())
    .handler(async () => ({
      plans: Object.entries(PLANS).map(([id, p]) => ({
        id,
        name: p.name,
        amount: p.amount,
        currency: p.currency,
        interval: "month",
      })),
    })),

  checkout: orgAuthed
    .route({
      method: "POST",
      path: "/billing/checkout",
      summary: "Create a Stripe Checkout session",
      tags: ["Billing"],
    })
    .input(
      z.object({
        plan: z.enum(["starter", "growth", "pro"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
        customerEmail: z.string().email().optional(),
      }),
    )
    .output(z.object({ url: z.string(), id: z.string() }))
    .handler(async ({ context, input }) => {
      const secret = secretKey(context);
      const plan = PLANS[input.plan];
      const body: Record<string, string> = {
        mode: "subscription",
        "line_items[0][price_data][currency]": plan.currency,
        "line_items[0][price_data][product_data][name]": plan.name,
        "line_items[0][price_data][unit_amount]": String(plan.amount),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][quantity]": "1",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      };
      if (input.customerEmail) body.customer_email = input.customerEmail;
      const session = await stripePost("/v1/checkout/sessions", body, secret);
      return { url: session.url, id: session.id };
    }),

  portal: orgAuthed
    .route({
      method: "POST",
      path: "/billing/portal",
      summary: "Create a Stripe Billing Portal session",
      tags: ["Billing"],
    })
    .input(
      z.object({
        customerId: z.string(),
        returnUrl: z.string().url(),
      }),
    )
    .output(z.object({ url: z.string() }))
    .handler(async ({ context, input }) => {
      const secret = secretKey(context);
      const session = await stripePost(
        "/v1/billing_portal/sessions",
        { customer: input.customerId, return_url: input.returnUrl },
        secret,
      );
      return { url: session.url };
    }),
};
