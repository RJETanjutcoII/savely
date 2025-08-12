export const revalidate = 60;

import Link from "next/link";
import Deals from "./Deals";
import { createClient } from "@/utils/supabase/server";

export default async function BestDeals() {
  
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("coupons")
    .select("*")
    .limit(3);

  if (error) {
    console.log(error);
    return (
      <section className="bg-white pt-10 pb-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
            Best Selling Deals
          </h1>
          <p className="mt-4 text-gray-600">Couldn’t load deals right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-10 pb-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
          Best Selling Deals
        </h1>
      </div>

      <div className="flex justify-evenly mb-25">
        {(deals ?? []).map((deal) => (
          <Deals
            key={deal.id}
            id={deal.id}
            name={deal.name}
            oldPrice={deal.old_price}
            newPrice={deal.new_price}
            image={deal.image}
            expDate={deal.exp_date}
          />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/browse-deals"
          className="px-2 text-blue-700 bg-white rounded-lg py-3 font-bold border border-blue-700"
        >
          See More Deals
        </Link>
      </div>
    </section>
  );
}
