import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'

const MainLayout = ({ children }) => {
  return (
    <>
        <Header />
        <Navbar />
        <main>{children}</main>
        <Footer />
    </>
  )
}

export default MainLayout