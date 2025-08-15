import React, {type ComponentProps} from 'react'
import Link from 'next/link'
import Image from 'next/image'

type CategoryProps = {
    name: string
    numDeals?: number
    image?: string
} & ComponentProps<"div">

function Category ({name, numDeals, image}: CategoryProps)  {
  return (
    <div className="mx-10">
        <Link href='/'>
            <div>
              {/*  <Image src="null" className="h-60 w-100 min-w-100" width={100} height={60} alt={name}/> */}
            </div>
            <div className="bold text-2xl">
                {name}
            </div>
            <div className="text-sm">
                {numDeals}+ Deals
            </div>
        </Link>
    </div>
  )
}

export default Category