import React from 'react'
import { CiSearch } from 'react-icons/ci'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="bg-slate-50 pt-60 pb-20 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-7xl font-extrabold text-black -mt-40 mb-7 text-wrap w-200 bg-gradient-to-r from-blue-950 to-violet-700 text-transparent bg-clip-text pb-5">The best deals at the best prices.</h1>
            <p className="my-4 text-xl text-black mb-10 font-bold">Find exclusive discounts for your favorite businesses here</p>
            <div className="flex justify-center mx-auto mb-15">
                <Link href="/browse-deals" className="mx-4 px-10 bg-blue-800 border-1 rounded-xl text-white font-bold py-3">Browse Deals</Link>
                <Link className="mx-4 px-10 border-1 rounded-xl text-black font-bold py-3" href="/">List your Business</Link>
            </div>
            <div className="flex justify-center items-center">
                <CiSearch className="z-2 -mr-5.5" />
                <input className="w-100 bg-white py-4 pr-3 pl-7 rounded-xl border-0.9 shadow-2xl z-1 shadow-black" placeholder="Search for Restaurants, stores, services, etc..."></input>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Hero