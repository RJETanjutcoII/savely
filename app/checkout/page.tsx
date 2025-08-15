// app/checkout/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import MainLayout from "@/layouts/MainLayout";

// Optional: export const dynamic = "force-dynamic";

type CartRow = {
  user_id: string;
  coupon_id: number;
  quantity: number;
  name: string;
  new_price: number;
  image: string | null;
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  // Require auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Pull cart items from the view
  const { data: rows, error } = await supabase
    .from("v_cart_detailed")
    .select("user_id, coupon_id, quantity, name, new_price, image")
    .eq("user_id", user.id);

  if (error) {
    console.error("cart error:", error);
    return (
      <MainLayout>
        <section className="mt-20 mx-auto max-w-4xl px-6">
          Couldn’t load your cart.
        </section>
      </MainLayout>
    );
  }

  const items = (rows ?? []) as CartRow[];
  if (items.length === 0) {
    redirect("/cart"); // nothing to checkout
  }
  const subtotal = items.reduce((s, it) => s + Number(it.new_price || 0) * it.quantity, 0);

  // Server action: create order + order_items, then (later) redirect to payment
  async function placeOrder(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Read form
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const provider = String(formData.get("provider") || "gcash"); // "gcash" | "maya"

    // Re-read current cart at write-time
    const { data: _rows, error: vErr } = await supabase
      .from("v_cart_detailed")
      .select("coupon_id, quantity, name, new_price, image")
      .eq("user_id", user.id);
    if (vErr) {
      console.error(vErr);
      redirect("/cart?error=cart"); // basic fallback
    }
    const curItems = (_rows ?? []) as Array<{
      coupon_id: number;
      quantity: number;
      name: string;
      new_price: number;
      image: string | null;
    }>;
    if (curItems.length === 0) redirect("/cart");

    const total = curItems.reduce((s, it) => s + Number(it.new_price || 0) * it.quantity, 0);

    // 1) Create order (assumes you have public.orders table)
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",               // "pending" | "paid" | "failed" | "cancelled"
        provider,                        // "gcash" | "maya"
        total_amount: total,             // numeric
        currency: "PHP",                 // text
        shipping_name: name,
        shipping_phone: phone,
        shipping_address: address,
      })
      .select("id")
      .single();

    if (orderErr || !order?.id) {
      console.error(orderErr);
      redirect("/checkout?error=order");
    }

    // 2) Insert order_items snapshot (assumes public.order_items table)
    const itemsPayload = curItems.map((it) => ({
      order_id: order.id,
      coupon_id: it.coupon_id,
      name: it.name,
      unit_price: it.new_price,
      quantity: it.quantity,
    }));
    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(itemsPayload);
    if (itemsErr) {
      console.error(itemsErr);
      redirect(`/checkout?error=items`);
    }

    // 3) (Optional) Clear the cart now or after payment succeeds
    await supabase
      .from("profiles")
      .update({ shopping_cart: [] })
      .eq("id", user.id);

    // 4) TODO: Create a payment session with GCash / Maya, then redirect.
    // For now, pretend it succeeded:
    redirect(`/checkout/success?order=${order.id}`);
  }

  return (
    <MainLayout>
    <section className="mt-20 mx-auto max-w-4xl px-6">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">
        Checkout
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Customer details + provider */}
        <form className="md:col-span-2 space-y-4" action={placeOrder}>
          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input name="name" className="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" className="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea name="address" className="mt-1 w-full border rounded px-3 py-2" rows={3} required />
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold mb-2">Payment method</legend>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="provider" value="gcash" defaultChecked />
                <span>GCash</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="provider" value="maya" />
                <span>Maya</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-green-700 text-white rounded-lg font-semibold mb-30"
          >
            Place Order
          </button>
        </form>

        {/* Right: Order summary */}
        <aside className="md:col-span-1 bg-gray-50 rounded-lg p-4 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-3">Order Summary</h2>
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.coupon_id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image ?? ""} alt={it.name} className="h-12 w-12 object-cover rounded" />
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-600">
                      ₱{Number(it.new_price).toFixed(2)} × {it.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-semibold">
                  ₱{(Number(it.new_price) * it.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-semibold">Subtotal</span>
            <span className="font-bold">₱{subtotal.toFixed(2)}</span>
          </div>
          {/* shipping/taxes can be added here */}
        </aside>
      </div>
    </section>
    </MainLayout>
  );
}
