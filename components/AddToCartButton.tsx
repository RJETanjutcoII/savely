"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AddToCartButton({ couponId }: { couponId: number }) {
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const onAdd = async () => {
    setAdding(true);
    setAdded(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      // read current JSONB cart
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("shopping_cart")
        .eq("id", user.id)
        .single();
      if (profErr) throw new Error(profErr.message);

      type CartItem = { id: number; quantity: number };

      const current: CartItem[] = Array.isArray(prof?.shopping_cart)
        ? (prof!.shopping_cart as Partial<CartItem>[]).map((x) => ({
            id: Number(x?.id),
            quantity: Math.max(1, Number(x?.quantity ?? 1)),
          }))
        : [];

      const idx = current.findIndex((x) => x.id === couponId);
      const next =
        idx >= 0
          ? current.map((x, i) => (i === idx ? { ...x, quantity: x.quantity + 1 } : x))
          : [...current, { id: couponId, quantity: 1 }];

      const { error: updErr } = await supabase
        .from("profiles")
        .update({ shopping_cart: next })
        .eq("id", user.id);
      if (updErr) throw new Error(updErr.message);

      setAdded(true);
    } catch (e) {
      console.warn("Add to cart failed:", (e as Error).message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <button
        onClick={onAdd}
        disabled={adding}
        className="bg-blue-700 text-white px-6 py-3 rounded-lg w-full disabled:opacity-60"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
      {added && <p className="mt-2 text-green-700 text-sm font-medium">Added to cart ✓</p>}
    </>
  );
}
