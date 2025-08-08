import Link from 'next/link'
import React, { type ComponentProps} from 'react'

type DealsProps = {
  id: number
  name: string
  oldPrice: number
  newPrice: number
  image?: string
}

function Deals ({id, name, oldPrice, newPrice, image}: DealsProps) {

  let discount = ((1 - newPrice / oldPrice) * 100).toFixed();

  return (
    <div className="h-90 w-80 items-center text-center">
        <Link href={`products/${id}`}>
        <div className="grid col-start-1 row-start-1">
            <img src={image} className="col-start-1 row-start-1 h-60 w-80 object-cover mb-5 rounded-3xl  min-w-80"/>
            <span className="col-start-1 row-start-1 bg-green-400 w-30 h-10 rounded-xl pt-1.5 ml-2 mt-2 text-white text-xl">{discount}% off!</span>
        </div>
        <div className="font-bold text-4xl">{name}</div>
        <div className="mb-7">
            <span className="line-through">₱{oldPrice}</span>
            <span className="text-4xl text-green-400 font-bold">₱{newPrice}</span>
        </div>
        </Link>
        <a className="px-25 bg-blue-700 rounded-xl text-white py-3 font-bold">Add to Cart</a>

    </div>
  )
}

export default Deals