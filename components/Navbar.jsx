import React from 'react'
import Link from 'next/link'

const Navbar = () => {

  // REPLACE DIVS WITH LINKS

  return (
    <nav className="bg-white">
        <div className="flex items-center mx-auto max-w-3xl h-14 text-nowrap font-bold">
            <div className="mx-3">Restaurants</div>
            <div className="mx-3">Clothing</div>
            <div className="mx-3">Things To Do</div>
            <div className="mx-3">Beauty & Wellness</div>
            <div className="mx-3">Entertainment</div>
            <div className="mx-3">Sports & Recreation</div>
        </div>
    </nav>
  )
}

export default Navbar