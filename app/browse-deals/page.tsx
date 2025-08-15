export const revalidate = 60;

import React from 'react'
import LongDeals from '@/components/LongDeals'
import { createClient } from "@/utils/supabase/server"
import MainLayout from '@/layouts/MainLayout';

export default async function BrowseDeals() {

  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_available", true)
    .limit(7);
    

  if (error) {
    console.log(error);
    return (
      <MainLayout>
      <section className="bg-white pt-10 pb-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
            Best Selling Deals
          </h1>
          <p className="mt-4 text-gray-600">Couldn&apos;t load deals right now.</p>
        </div>
      </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {(deals ?? []).map((deal) => (
        <LongDeals key={deal.id} id={deal.id} name={deal.name} image={deal.image} oldPrice={deal.old_price} newPrice={deal.new_price} description={deal.description} expDate={deal.exp_date}/>
      ))}
      
    </MainLayout>
  )
}