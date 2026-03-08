"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { SupabaseClient, Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, redirectTo?: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function createAuthProvider(supabase: SupabaseClient) {
  function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }, []);

    const signUp = useCallback(
      async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      },
      []
    );

    const signIn = useCallback(
      async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      []
    );

    const signOut = useCallback(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }, []);

    const resetPassword = useCallback(
      async (email: string, redirectTo?: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) throw error;
      },
      []
    );

    const updatePassword = useCallback(async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    }, []);

    return (
      <AuthContext.Provider
        value={{ user, session, loading, signUp, signIn, signOut, resetPassword, updatePassword }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return AuthProvider;
}

export { AuthContext };
