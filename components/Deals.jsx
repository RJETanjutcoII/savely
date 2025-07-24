import React from 'react'

const Deals = ({name, oldPrice, newPrice, image}) => {

  let discount = ((1 - newPrice / oldPrice) * 100).toFixed();

  return (
    <div className="h-90 w-80 items-center text-center">
        <a href="/">
        <div className="grid col-start-1 row-start-1">
            <img src={image} className="col-start-1 row-start-1 h-60 w-80 object-cover mb-5 rounded-3xl  min-w-80"/>
            <span className="col-start-1 row-start-1 bg-green-400 w-30 h-10 rounded-xl pt-1.5 ml-2 mt-2 text-white text-xl">{discount}% off!</span>
        </div>
        <div className="font-bold text-4xl">{name}</div>
        <div className="mb-7">
            <span className="line-through">₱{oldPrice}</span>
            <span className="text-4xl text-green-400 font-bold">₱{newPrice}</span>
        </div>
        </a>
        <a className="px-25 bg-blue-700 rounded-xl text-white py-3 font-bold">Add to Cart</a>

    </div>
  )
}

export default Deals