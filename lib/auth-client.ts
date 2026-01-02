"use client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL removed to default to current origin (relative path)
});
