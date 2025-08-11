"use client";

import React from "react";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

type AuthCtx = { user: User | null; username: string | null };
const AuthContext = React.createContext<AuthCtx>({ user: null, username: null });

export function useAuth() {
  return React.useContext(AuthContext);
}

export default function AuthProvider({
  children,
  initialUser,
  initialUsername,
}: {
  children: React.ReactNode;
  initialUser: User | null;
  initialUsername: string | null;
}) {
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [username, setUsername] = React.useState<string | null>(initialUsername);

  React.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
        setUsername(data?.username ?? null);
      } else {
        setUsername(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, username }}>
      {children}
    </AuthContext.Provider>
  );
}
