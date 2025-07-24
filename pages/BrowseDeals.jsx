"use client"

import React from 'react'
import LongDeals from '../components/LongDeals'
import supabase from "../utils/supabase/client"
import { useQuery } from '@tanstack/react-query'


const fetchDeals = async () => {
  const {data, error} = await supabase.from("coupons").select("*")

  if (error) {
    throw new Error(error.message)
  }

  return data
}

const BrowseDeals = () => {

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
  })

  return (
    <>
      {deals?.map((deal, index) => (
        <LongDeals key={deal.id} name={deal.name} image={deal.imageLink} oldPrice={deal.oldPrice} newPrice={deal.newPrice} description={deal.description} />
      ))}
      
    </>
  )
}

export default BrowseDeals