"use client"

import React from 'react'
import Deals from './Deals'
import { supabase } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

const fetchDeals = async () => {
  const {data, error} = await supabase.from("coupons").select("*").limit(3)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

const BestDeals = () => {

  const {
    data: deals,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
    staleTime: 6000,
    refetchInterval: 6000,
    refetchOnWindowFocus: false,
  })

  return (
    <section className="bg-white pt-10 pb-10">
        <div className='mx-auto px-4 sm:px-6 lg:px-8 items-center text-center mb-10'>
            <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">Best Selling Deals</h1>
        </div>
        <div className="items-center flex mb-20 justify-evenly">
          {isLoading || !deals ? (
            <>
              {[1, 2, 3].map((num) => (
                <Deals
                  key={`loading-${num}`}
                  id={0}
                  name="Loading"
                  oldPrice={0}
                  newPrice={0}
                />
              ))}
            </>
          ) : (
          deals.map((deal, index) => (
            <Deals
              key={deal.id}
              id={deal.id}
              name={deal.name}
              oldPrice={deal.oldPrice}
              newPrice={deal.newPrice}
              image={deal.imageLink}
            />
          ))
        )}
        </div>
        <div className='items-center text-center'>
          <Link href="/browse-deals" className="px-2 text-blue-700 bg-white rounded-lg py-3 font-bold border-1 border-blue-700">See More Deals</Link>
        </div>
    </section>
  )
}

export default BestDeals