// app/cart/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

type Row = {
  user_id: string;
  coupon_id: number;
  quantity: number;
  name: string;
  new_price: number;
  image: string | null;
};

export default function CartPage() {
  const router = useRouter();
  const qc = useQueryClient();

  // 1) Get current user (client-side)
  const {
    data: user,
    isLoading: userLoading,
    isError: userErr,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
    staleTime: 10_000,
  });

  React.useEffect(() => {
    if (!userLoading && !user) router.push("/login");
  }, [userLoading, user, router]);

  // 2) Load cart when user exists
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_cart_detailed")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw new Error(error.message);
      const items = (data ?? []) as Row[];
      const total = items.reduce(
        (s, it) => s + Number(it.new_price || 0) * it.quantity,
        0
      );
      return { items, total };
    },
    staleTime: 10_000,
  });

  // 3) Mutations (optimistic)
  const setQty = useMutation({
    mutationFn: async ({ id, qty }: { id: number; qty: number }) => {
      const { error } = await supabase.rpc("cart_set_quantity", {
        p_coupon_id: id,
        p_quantity: qty,
      });
      if (error) throw new Error(error.message);
    },
    onMutate: async ({ id, qty }) => {
      const key = ["cart", user?.id];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<{ items: Row[]; total: number }>(key);
      if (prev) {
        const items = prev.items
          .map((it) => (it.coupon_id === id ? { ...it, quantity: qty } : it))
          .filter((it) => it.quantity > 0);
        const total = items.reduce(
          (s, it) => s + Number(it.new_price || 0) * it.quantity,
          0
        );
        qc.setQueryData(key, { items, total });
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart", user?.id], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart", user?.id] }),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("cart_clear");
      if (error) throw new Error(error.message);
    },
    onMutate: async () => {
      const key = ["cart", user?.id];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<{ items: Row[]; total: number }>(key);
      qc.setQueryData(key, { items: [], total: 0 });
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["cart", user?.id], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart", user?.id] }),
  });

  // Loading / auth
  if (userLoading || (!user && !userErr)) {
    return <section className="mt-20 mx-auto max-w-4xl px-6">Loading…</section>;
  }
  if (userErr) {
    return <section className="mt-20 mx-auto max-w-4xl px-6">Error loading user</section>;
  }
  if (isLoading || !data) {
    return <section className="mt-20 mx-auto max-w-4xl px-6">Loading…</section>;
  }
  if (isError) {
    return (
      <section className="mt-20 mx-auto max-w-4xl px-6">
        {(error as Error)?.message ?? "Error"}
      </section>
    );
  }

  const { items, total } = data;

  return (
  
    <section className="mt-20 mx-auto max-w-4xl px-6">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <p className="mt-4 text-gray-600 mb-120">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y mb-50">
            {items.map((it) => (
              <li key={it.coupon_id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {it.image ? (
                    <Image
                      src={it.image}
                      alt={it.name}
                      width={112}
                      height={112}
                      className="h-14 w-14 object-cover rounded"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded bg-gray-200" aria-hidden />
                  )}
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-600">
                      ₱{Number(it.new_price).toFixed(2)} × {it.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setQty.mutate({ id: it.coupon_id, qty: Math.max(0, it.quantity - 1) })
                    }
                    className="px-3 py-1 border rounded hover:bg-gray-50"
                    disabled={setQty.isPending}
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{it.quantity}</span>
                  <button
                    onClick={() => setQty.mutate({ id: it.coupon_id, qty: it.quantity + 1 })}
                    className="px-3 py-1 border rounded hover:bg-gray-50"
                    disabled={setQty.isPending}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setQty.mutate({ id: it.coupon_id, qty: 0 })}
                    className="text-red-600 hover:underline"
                    disabled={setQty.isPending}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}

          </ul>

          <div className="mt-6 flex items-center justify-between mb-30">
            <div className="text-xl font-bold">Total: ₱{total.toFixed(2)}</div>
            <div className="space-x-3">
              <button
                onClick={() => clearCart.mutate()}
                className="px-4 py-2 border rounded"
                disabled={clearCart.isPending}
              >
                Clear
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="px-6 py-2 bg-green-700 text-white rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
