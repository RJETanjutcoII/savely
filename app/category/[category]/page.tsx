export const revalidate = 60;

import React from 'react'
import { notFound } from 'next/navigation'
import LongDeals from '@/components/LongDeals'
import { createClient } from "@/utils/supabase/server"
import MainLayout from '@/layouts/MainLayout';

const VALID_CATEGORIES = [
  "Restaurants", "Clothing", "Things To Do",
  "Beauty & Wellness", "Entertainment", "Sports & Recreation",
];

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const displayName = decodeURIComponent(category);

  if (!VALID_CATEGORIES.includes(displayName)) notFound();

  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_available", true)
    .eq("category", displayName)
    .limit(20);

  if (error) {
    console.log(error);
    return (
      <MainLayout>
        <section className="bg-white pt-10 pb-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
              {displayName}
            </h1>
            <p className="mt-4 text-gray-600">Couldn&apos;t load deals right now.</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-white pt-10 pb-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
            {displayName}
          </h1>
        </div>
      </section>
      {deals && deals.length > 0 ? (
        (deals).map((deal) => (
          <LongDeals key={deal.id} id={deal.id} name={deal.name} image={deal.image} oldPrice={deal.old_price} newPrice={deal.new_price} description={deal.description} expDate={deal.exp_date} />
        ))
      ) : (
        <section className="bg-white pt-4 pb-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-xl">No deals available in this category yet. Check back soon!</p>
          </div>
        </section>
      )}
    </MainLayout>
  )
}
