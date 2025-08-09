"use client"

import React from 'react'
import Picked from './Picked'
import { supabase } from "../utils/supabase/client"
import { useQuery } from '@tanstack/react-query'


const fetchPicked = async() => {
  const {data, error} = await supabase.from("coupons").select("*").limit(3);

  if (error)
      throw new Error(error.message);

  return data;
}

const PickedForYou = () => {

  const {
    data: picks,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["picks"],
    queryFn: fetchPicked,
  })

  return (
    <section className="bg-slate-50 pt-10 pb-10">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mb-10'>
            <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">Picked For You</h1>
        </div>
        <div className="items-center flex justify-evenly shrink">
          {isLoading || !picks ? (
            <>
              <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null"/>
              <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null"/>
              <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null"/>
            </>
          ) : (
            picks.map((pick, index) => (
              <Picked
                id={pick.id}
                key={pick.id}
                name={pick.name}
                oldPrice={pick.oldPrice}
                newPrice={pick.newPrice}
                image={pick.imageLink}
              />
            ))
          )}
        </div>
    </section>
  )
}

export default PickedForYou