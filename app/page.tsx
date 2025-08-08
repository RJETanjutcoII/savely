import React from 'react'
import Homepage from '../pages/Homepage'
import MainLayout from '../layouts/MainLayout';

export default function Page() {
    return (
        <div className="font-poppins">
            <MainLayout>
                <Homepage />
            </MainLayout>
        </div>
    )
}