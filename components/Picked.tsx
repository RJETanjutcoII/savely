import React from 'react'

const Picked = ({name, oldPrice, newPrice, image}) => {
  return (
    <div className="bg-white w-80 rounded-xl mb-1">
      <a href="/">
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
      </a>
    </div>
     
  )
}

export default Picked