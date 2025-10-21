import { PrismaClient } from "@prisma/client";
import { serverEnv } from "@/lib/env/server";

export const db = globalThis.prisma || new PrismaClient();

if (serverEnv.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
