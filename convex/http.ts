import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

const http = httpRouter();

// Polar.sh webhook handler with signature verification
http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Read raw body for signature verification
    const rawBody = await request.arrayBuffer();
    const headers = Object.fromEntries(request.headers);
    try {
      const secret = process.env.POLAR_WEBHOOK_SECRET || "";
      if (!secret) {
        console.warn("POLAR_WEBHOOK_SECRET is not set");
      }

      // Validate signature using Polar SDK (Standard Webhooks)
      const event = validateEvent(Buffer.from(rawBody), headers as any, secret);

      console.log("Polar webhook received:", event.type);

      // Extract subscription/customer
      const data: any = (event as any).data ?? (event as any).payload ?? {};
      const subscription = data;
      const customerEmail =
        subscription?.customer?.email ||
        subscription?.customer?.attributes?.email ||
        data?.customer?.email ||
        null;

      // Grant access on active/uncanceled, or updated→active
      if (
        event.type === "subscription.active" ||
        event.type === "subscription.uncanceled" ||
        (event.type === "subscription.updated" && subscription?.status === "active")
      ) {
        if (customerEmail) {
          await ctx.runMutation(api.users.updateUserSubscription, {
            email: customerEmail,
            paid: true,
            subscriptionId: subscription?.id ?? undefined,
          });
        }
      }

      // Revoke only when subscription is revoked
      if (event.type === "subscription.revoked") {
        if (customerEmail) {
          await ctx.runMutation(api.users.updateUserSubscription, {
            email: customerEmail,
            paid: false,
          });
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      if (error instanceof WebhookVerificationError) {
        console.error("Polar webhook verification failed:", error?.message);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;