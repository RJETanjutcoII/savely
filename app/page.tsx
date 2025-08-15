import React from 'react'
import MainLayout from '../layouts/MainLayout';
import Hero from '@/components/Hero';
import BestDeals from '@/components/BestDeals';
import PickedForYou from '@/components/PickedForYou';
import Categories from '@/components/Categories';

export default function Page() {
    return (
        <div className="font-poppins">
            <MainLayout>
                <Hero />
                <BestDeals />
                <PickedForYou />
                <Categories />
            </MainLayout>
        </div>
    )
}