import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { serverEnv } from "@/lib/env/server";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing headers", { status: 400 });
  }

  const payload = await req.json();
  const wh = new Webhook(serverEnv.CLERK_WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    await db.user.upsert({
      where: { clerkUserId: id },
      create: {
        clerkUserId: id,
        email: email_addresses[0]?.email_address!,
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
      },
      update: {
        email: email_addresses[0]?.email_address!,
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
      },
    });
  }

  if (evt.type === "user.deleted") {
    await db.user.delete({ where: { clerkUserId: evt.data.id! } });
  }

  return new Response("OK", { status: 200 });
}
