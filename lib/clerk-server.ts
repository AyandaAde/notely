import { Clerk } from "@clerk/backend";

export const runtime = "edge";
export const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});
