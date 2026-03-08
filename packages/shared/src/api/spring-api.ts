import axios, { type AxiosInstance } from "axios";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSpringApiClient(
  supabase: SupabaseClient,
  baseURL?: string
): AxiosInstance {
  const url =
    baseURL ??
    (typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SPRING_API_URL ??
        process.env.EXPO_PUBLIC_SPRING_API_URL ??
        "http://localhost:8080"
      : "http://localhost:8080");

  const instance = axios.create({ baseURL: url });

  instance.interceptors.request.use(async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  });

  return instance;
}
