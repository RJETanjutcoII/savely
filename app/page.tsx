import React from 'react'
import Homepage from '../pages/Homepage'
import MainLayout from '../layouts/MainLayout';
import BrowseDeals from '../pages/BrowseDeals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Link from 'next/link';

export default function Page() {
    return (
        <div className="font-poppins">
            <MainLayout>
                <Homepage />
            </MainLayout>
        </div>
    )
}