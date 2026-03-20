"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAuthProvider } from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { useState, useEffect, type ReactNode } from "react";

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

  // Clear cached data only when the user actually changes (not on page refresh)
  useEffect(() => {
    let previousUserId: string | undefined;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUserId = session?.user?.id;
      // First call (page load): just record the user, don't clear
      // Subsequent calls: clear only if the user changed
      if (previousUserId !== undefined && previousUserId !== currentUserId) {
        queryClient.clear();
      }
      previousUserId = currentUserId;
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
