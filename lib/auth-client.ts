"use client";
import { createAuthClient } from "better-auth/react";

  plugins: [
    // emailPasswordClient() is often needed if not using "magic-link" only. 
    // But verify if better-auth core includes it? 
    // Actually, createAuthClient usually includes core features. 
    // BUT the typed client needs to know.
    // Let's add it if available. If import fails, we revert.
  ],
});

