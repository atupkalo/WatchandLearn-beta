import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase server environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { supabaseUrl, supabaseKey };
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-");
}

function hasSupabaseAuthCookies(cookieStore: CookieStore) {
  return cookieStore.getAll().some(({ name }) => isSupabaseAuthCookie(name));
}

function isInvalidRefreshTokenError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("Invalid Refresh Token") ||
    error.message.includes("Refresh Token Not Found")
  );
}

function clearSupabaseAuthCookies(cookieStore: CookieStore) {
  cookieStore.getAll().forEach(({ name }) => {
    if (!isSupabaseAuthCookie(name)) {
      return;
    }

    cookieStore.set(name, "", {
      maxAge: 0,
      path: "/",
    });
  });
}

export const createClient = (cookieStore: CookieStore) => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // This can happen in a Server Component. Middleware will refresh the session.
        }
      },
    },
  });
};

export async function getUserOrNull(cookieStore: CookieStore): Promise<User | null> {
  if (!hasSupabaseAuthCookies(cookieStore)) {
    return null;
  }

  const supabase = createClient(cookieStore);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user ?? null;
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      clearSupabaseAuthCookies(cookieStore);
      return null;
    }

    throw error;
  }
}
