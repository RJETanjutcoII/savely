"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/utils/supabase/client"

const fetchDealById = async (id: string) => {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single() // since we only want one row

  if (error) {
    throw new Error(error.message)
  }

  return data
}

const ProductPage = () => {
  const { id } = useParams() as { id: string }

  const {
    data: deal,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deal", id],
    queryFn: () => fetchDealById(id),
    enabled: !!id, // only run when id is defined
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !deal) {
    return <div>{(error as Error)?.message ?? "Deal not found"}</div>
  }

  return (
  <section className="container mx-auto mt-20">
  {/* Row 1: Image + Info */}
  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
    {/* Image */}
    <div className="flex justify-center">
      {deal.imageLink && (
        <img
          src={deal.imageLink}
          alt={deal.name}
          className="object-cover rounded-2xl h-100 w-125"
        />
      )}
    </div>

    {/* Info */}
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold mb-3">{deal.name}</h1>
      <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
        <span className="text-2xl line-through text-gray-500">
          ₱{deal.oldPrice}
        </span>
        <span className="text-3xl font-semibold text-black">
          ₱{deal.newPrice}
        </span>
      </div>

      <button className="bg-blue-700 text-white px-6 py-3 rounded-lg w-full">
          Add to Cart
        </button>
    </div>

  </div>

  {/* Row 2: Description */}
  {deal.description && (
    <div className="mt-10 text-center">
      <p className="text-lg text-gray-700">{deal.description}</p>
    </div>
  )}
</section>

)

}

export default ProductPage
