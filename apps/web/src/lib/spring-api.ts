import { createSpringApiClient } from "@fitness/shared";
import { createClient } from "./supabase";

export function getSpringApi() {
  const supabase = createClient();
  return createSpringApiClient(
    supabase,
    process.env.NEXT_PUBLIC_SPRING_API_URL
  );
}
