// app/account/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import MainLayout from "@/layouts/MainLayout";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, points")
    .eq("id", user.id)
    .single();

  return (
    <MainLayout>
    <section className="mt-20 mx-auto max-w-4xl px-6">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">
        My Account
      </h1>

      <div className="mt-6 bg-gray-50 rounded-lg p-6 shadow-md space-y-4 mb-20">
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Username:</span> {profile?.username ?? "Not set"}</p>
      </div>

      <div className="text-3xl mb-20">
        You have: <span className="font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text">{profile?.points}</span> points!
      </div>

      <form
        action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut(); // clears session cookies
          redirect("/");                 // go back home
        }}
      >
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-30"
        >
          Log Out
        </button>
      </form>
    </section>
    </MainLayout>
  );
}
