import React from 'react'
import Hero from '../components/Hero'
import BestDeals from '../components/BestDeals'
import PickedForYou from '../components/PickedForYou'
import Categories from '../components/Categories'


const Homepage = () => {
  return (
    <>
      <Hero />
      <BestDeals />
      <PickedForYou />
      <Categories />
    </>
  )
}

export default Homepage