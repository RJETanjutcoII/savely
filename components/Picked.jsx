import React from 'react'

const Picked = () => {
  return (
    <div className="bg-white h-120 w-80 rounded-xl mb-1">
      <a href="/">
        <div>
          <img src="null" className="rounded-t-xl w-full object-none h-55 min-w-80"/>
        </div>
        <div className="ml-3 mt-3 mb-3 text-sm">
          Sky Ranch
        </div>
        <div className="font-bold mx-3 text-3xl mb-2">
          87% off Sky Ranch Pampanga All You Can Promo
        </div>
        <div className="items-center flex">
          <span className="text-5xl ml-5 font-bold text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-indigo-900 to-violet-700">₱289</span>
          <span className="ml-3 font-bold">From ₱2210</span>
        </div>
      </a>
    </div>
     
  )
}

export default Picked