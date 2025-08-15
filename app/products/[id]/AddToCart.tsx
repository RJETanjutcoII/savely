"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

type CartItem = { id: number; quantity: number };

// Narrow/normalize whatever came from JSONB to typed CartItem[]
function normalizeCart(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];
  const out: CartItem[] = [];
  for (const it of input) {
    if (it && typeof it === "object") {
      const id = Number((it as Record<string, unknown>).id);
      const q = Number((it as Record<string, unknown>).quantity ?? 1);
      if (Number.isFinite(id)) {
        out.push({ id, quantity: Math.max(1, Number.isFinite(q) ? q : 1) });
      }
    }
  }
  return out;
}

export default function AddToCart({ couponId }: { couponId: number }) {
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function addToCart() {
    setAdding(true);
    setAdded(false);
    setErr(null);

    try {
      // 1) require auth
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // 2) read current cart (JSONB array of { id, quantity })
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("shopping_cart")
        .eq("id", user.id)
        .single();
      if (profErr) throw new Error(profErr.message);

      const current = normalizeCart(prof?.shopping_cart);
      const idx = current.findIndex((x) => x.id === couponId);
      const next: CartItem[] =
        idx >= 0
          ? current.map((x, i) => (i === idx ? { ...x, quantity: x.quantity + 1 } : x))
          : [...current, { id: couponId, quantity: 1 }];

      // 3) update
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ shopping_cart: next })
        .eq("id", user.id);
      if (updErr) throw new Error(updErr.message);

      setAdded(true);
      // If you show cart count in header (SSR), call router.refresh()
      // router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setErr(message || "Add to cart failed");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <button
        onClick={addToCart}
        disabled={adding}
        className="bg-blue-700 text-white px-6 py-3 rounded-lg w-full disabled:opacity-60"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
      {added && <p className="mt-2 text-green-700 text-sm font-medium">Added to cart ✓</p>}
      {err && <p className="mt-2 text-red-600 text-sm">{err}</p>}
    </div>
  );
}
