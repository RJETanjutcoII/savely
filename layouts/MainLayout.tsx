// layouts/MainLayout.tsx (Server Component)
import React from "react";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = data?.username ?? null;
  }

  return (
    <main>
      <Header userEmail={user?.email ?? null} username={username} />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
