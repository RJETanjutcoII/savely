import React from 'react'
import Category from './Category'
import restaurant from '../public/category/restaurant.jpeg'
import clothing from '../public/category/clothing.jpeg'
import thingsToDo from '../public/category/thingsToDo.jpg'
import beauty from '../public/category/beauty.jpg'
import entertainment from '../public/category/entertainment.jpg'
import sports from '../public/category/sports.jpg'

const Categories = () => {
  return (
    <div className="pt-10 bg-white pb-10">
        <div className="text-center font-extrabold text-5xl mb-5">
          Browse by Category
        </div>
        <div className="text-center mb-20">
          Find the perfect deals in your favorite categories
        </div>
        <div>
          <div className="items-center flex mb-20 justify-center">
            <Category name="Restaurants" image={restaurant} numDeals={150}/>
            <Category name="Clothing" image={clothing} numDeals={200}/>
            <Category name="Things To Do" image={thingsToDo} numDeals={300} />
          </div>
          <div className="items-center flex justify-center">
            <Category name="Beauty & Wellness" image={beauty} numDeals={100}/>
            <Category name="Entertainment" image={entertainment} numDeals={300}/>
            <Category name="Sports & Recreation" image={sports} numDeals={50}/>
          </div>
        </div>
    </div>
  )
}

export default Categories