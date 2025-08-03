import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Polar.sh webhook handler
http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    console.log("Polar webhook received:", body);

    try {
      // Handle subscription created/updated events
      if (body.type === "subscription.created" || body.type === "subscription.updated") {
        const subscription = body.data;
        const customerEmail = subscription.customer?.email;
        
        if (customerEmail && subscription.status === "active") {
          await ctx.runMutation(api.users.updateUserSubscription, {
            email: customerEmail,
            paid: true,
            subscriptionId: subscription.id,
          });
        }
      }

      // Handle subscription cancelled/expired events
      if (body.type === "subscription.cancelled" || body.type === "subscription.expired") {
        const subscription = body.data;
        const customerEmail = subscription.customer?.email;
        
        if (customerEmail) {
          await ctx.runMutation(api.users.updateUserSubscription, {
            email: customerEmail,
            paid: false,
          });
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;