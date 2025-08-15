import React from 'react'
import Link from 'next/link';
import Countdown from './Countdown';
import Image from 'next/image';

type LongDealsProps = {
  id: number
  name: string
  oldPrice: number
  newPrice: number
  image: string
  description: string
  expDate: string
}

function LongDeals ({id, name, oldPrice, newPrice, image, description, expDate}: LongDealsProps) {

  const discount = ((1 - newPrice / oldPrice) * 100).toFixed();

  return (
    <section className="ml-60 mt-20">
      <Link href={`/products/${id}`}>
        <div className="flex">
            <div className="grid col-start-1 row-start-1 text-center">
                <Image src={image} className="col-start-1 row-start-1 h-60 w-80 object-cover mb-5 rounded-3xl  min-w-80" alt={name} width={640} height={480}/>
                <span className="col-start-1 row-start-1 bg-green-400 w-30 h-10 rounded-xl pt-1.5 ml-2 mt-2 text-white text-xl">{discount}% off!</span>
                <Countdown expDate={expDate} />
            </div>
            <span className="ml-4">
                <div className="text-5xl mb-2 text-black font-bold font-primary">{name}</div>
                <div>{description}</div>
            </span>
        </div>
      </Link>
    </section>
  )
}

export default LongDeals