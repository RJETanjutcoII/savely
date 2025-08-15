import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/server"; // <-- use your existing server helper

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "400", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Savely",
  description: "Find the best local deals in the Philippines with Savely — discount coupons, easy purchases, and a rewards system in one smart marketplace.",
  icons: {
    icon: "/public/logo.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // SSR: detect logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, points")
      .eq("id", user.id)
      .single();
    username = data?.username ?? null;
  }

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider initialUser={user} initialUsername={username}>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
