import { supabase } from "@/utils/supabase/client";

export async function ensureProfileFromMetadata() {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return;

  const username = user.user_metadata?.username;
  if (!username) return; // no username to write yet

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, username }, { onConflict: "id" });

  if (error && (error as any).code === "23505") {
    // Username already taken — handle in UI if you want
    throw new Error("That username is already taken.");
  }
}
