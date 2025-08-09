import React from 'react'
import Link from 'next/link'

type PickedProps = {
  id: number
  name: string
  oldPrice: number
  newPrice: number
  image: string
}

function Picked ({id, name, oldPrice, newPrice, image}: PickedProps) {
  return (
    <div className="bg-white w-80 rounded-xl mb-1">
      <Link href={`/products/${id}`}>
        <div>
          <img src={image} className="rounded-t-xl w-full object-cover h-55 min-w-80"/>
        </div>

        <div className="font-bold mx-3 text-3xl mt-3 mb-2">
          {name}
        </div>
        <div className="items-center flex mb-20">
          <span className="text-5xl ml-5 font-bold text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-indigo-900 to-violet-700">₱{newPrice}</span>
          <span className="ml-3 font-bold">From {oldPrice}</span>
        </div>
      </Link>
    </div>
     
  )
}

export default Picked