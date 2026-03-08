"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAuthProvider } from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { useState, type ReactNode } from "react";

const supabase = createClient();
const AuthProvider = createAuthProvider(supabase);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
