import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: { name: string | null } | null;
  loading: boolean;
  init: () => () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const clearAuthTokensFromUrl = () => {
  if (typeof window === "undefined") return;

  const hasTokenHash =
    window.location.hash.includes("access_token=") ||
    window.location.hash.includes("refresh_token=") ||
    window.location.hash.includes("provider_token=");
  const params = new URLSearchParams(window.location.search);
  const hasAuthCode = params.has("code");

  if (hasTokenHash || hasAuthCode) {
    const nextPath = ["/", "/login", "/signup"].includes(window.location.pathname)
      ? "/dashboard"
      : window.location.pathname;
    window.history.replaceState(null, document.title, nextPath);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  init: () => {
    // 1. Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        clearAuthTokensFromUrl();
        // defer to avoid deadlock with Supabase auth client
        setTimeout(async () => {
          const u = session.user;
          const meta = (u.user_metadata ?? {}) as Record<string, any>;
          const derivedName =
            meta.name ||
            meta.full_name ||
            meta.display_name ||
            (u.email ? u.email.split("@")[0] : null);
          const derivedAvatar = meta.avatar_url || meta.picture || null;

          // On sign-in (including Google OAuth), make sure a profile row exists
          // and is populated with the latest display name / avatar from the provider.
          if (event === "SIGNED_IN") {
            await supabase
              .from("profiles")
              .upsert(
                { id: u.id, name: derivedName, avatar_url: derivedAvatar },
                { onConflict: "id", ignoreDuplicates: false },
              );
          }

          const { data } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", u.id)
            .maybeSingle();
          set({ profile: data ?? { name: derivedName } });
        }, 0);
      } else {
        set({ profile: null });
      }
    });
    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
      if (session?.user) clearAuthTokensFromUrl();
    });
    return () => sub.subscription.unsubscribe();
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },
  signUp: async (email, password, name) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl, data: { name } },
    });
    return { error: error?.message ?? null };
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },
}));
