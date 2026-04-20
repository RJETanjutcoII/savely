import React, {type ComponentProps} from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'

type CategoryProps = {
    name: string
    numDeals?: number
    image?: string | StaticImageData
} & ComponentProps<"div">

function Category ({name, numDeals, image}: CategoryProps)  {
  return (
    <div className="mx-10">
        <Link href={`category/${name}`}>
            <div>
              <Image src={image as string} className="h-60 w-100 min-w-100" width={400} height={240} alt={name}/>
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