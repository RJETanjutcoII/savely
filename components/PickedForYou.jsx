import React from 'react'
import Picked from './Picked'

const PickedForYou = () => {
  return (
    <section className="bg-slate-50 pt-10 pb-10">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mb-10'>
            <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">Picked For You</h1>
        </div>
        <div className="items-center flex justify-center">
            <Picked />
            <section className="mx-30"><Picked /></section>
            <Picked />
        </div>
    </section>
  )
}

export default PickedForYou