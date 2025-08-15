import React from 'react'
import Category from './Category'

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
            <Category name="Restaurants"/>
            <Category name="Clothing"/>
            <Category name="Things To Do"/>
          </div>
          <div className="items-center flex justify-center">
            <Category name="Beauty & Wellness"/>
            <Category name="Entertainment"/>
            <Category name="Sports & Recreation"/>
          </div>
        </div>
    </div>
  )
}

export default Categories