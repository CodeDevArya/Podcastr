// ===== reference links =====
// https://www.convex.dev/templates (open the link and choose for clerk than you will get the github link mentioned below)
// https://github.dev/webdevcody/thumbnail-critique/blob/6637671d72513cfe13d00cb7a2990b23801eb327/convex/schema.ts

import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

// const handleClerkWebhook = httpAction(async (ctx, request) => {
//   const event = await validateRequest(request);
//   console.log("Event",event);
//   if (!event) {
//     return new Response("Invalid request", { status: 400 });
//   }
//   switch (event.type) {
//     case "user.created":
//       console.log(event.data);
//       await ctx.runMutation(internal.users.createUser, {
//         clerkId: event.data.id,
//         email: event.data.email_addresses[0].email_address,
//         imageUrl: event.data.image_url,
//         name: event.data.first_name!,
//       });
//       break;
//     case "user.updated":
//       console.log(event.data);
//       await ctx.runMutation(internal.users.updateUser, {
//         clerkId: event.data.id,
//         imageUrl: event.data.image_url,
//         email: event.data.email_addresses[0].email_address,
//       });
//       break;
//     case "user.deleted":
//       console.log(event.data);
//       await ctx.runMutation(internal.users.deleteUser, {
//         clerkId: event.data.id as string,
//       });
//       break;
//   }
//   return new Response(null, {
//     status: 200,
//   });
// });

const handleClerkWebhook = httpAction(async (ctx, request) => {
  try {
    const event = await validateRequest(request);
    if (!event) {
      console.error("Invalid event received");
      return new Response("Invalid request", { status: 400 });
    }

    // Handle events here...
    switch (event.type) {
      case "user.created":
        // Log the event data for debugging
        console.log("User Created Event Data:", event.data);
        await ctx.runMutation(internal.users.createUser, {
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url,
          name: event.data.first_name!,
        });
        break;
      case "user.updated":
        console.log(event.data);
        await ctx.runMutation(internal.users.updateUser, {
          clerkId: event.data.id,
          imageUrl: event.data.image_url,
          email: event.data.email_addresses[0].email_address,
        });
        break;
      case "user.deleted":
        console.log(event.data);
        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: event.data.id as string,
        });
        break;
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing request", { status: 500 });
  }
});

const http = httpRouter();

http.route({
  // path: "/clerk",
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as unknown as WebhookEvent;
};

export default http;
