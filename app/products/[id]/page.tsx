// app/products/[id]/page.tsx  (Server Component)
import { notFound } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import { createClient } from "@/utils/supabase/server";
import AddToCart from "./AddToCart";
import Countdown from "@/components/Countdown";
import Image from "next/image";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // <- match Next's generated PageProps (Promise<any>)
}) {
  const { id } = await params;     // <- await the params
  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum) || idNum <= 0) notFound();

  const supabase = await createClient();
  const { data: deal, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", idNum)
    .single();

  if (error || !deal) notFound();

  return (
    <MainLayout>
      {deal.is_available === false ? (
        <section className="container mx-auto mt-20 text-center">
          <p className="mt-50 mb-100">This item is out of stock or expired.</p>
        </section>
      ) : (
        <section className="container mx-auto mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="flex justify-center">
              {deal.image && (
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={640}
                  height={480}
                  className="object-cover rounded-2xl h-100 w-125"
                />
              )}
            </div>

            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-3">{deal.name}</h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
                <span className="text-2xl line-through text-gray-500">₱{deal.old_price}</span>
                <span className="text-3xl font-semibold text-black">₱{deal.new_price}</span>
              </div>

              {deal.exp_date && <Countdown expDate={deal.exp_date} />}
              <AddToCart couponId={deal.id} />
            </div>
          </div>

          {deal.description && (
            <div className="mt-10 text-center">
              <p className="text-lg text-gray-700">{deal.description}</p>
            </div>
          )}
        </section>
      )}
    </MainLayout>
  );
}
