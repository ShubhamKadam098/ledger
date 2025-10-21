import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "staging"]),
    BASE_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
