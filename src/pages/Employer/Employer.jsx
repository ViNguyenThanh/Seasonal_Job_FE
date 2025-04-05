import React from 'react'
import './Employer.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'

const Employer = () => {
  return (
    <div className='employer-whole-container'>
      <Header />
      <div className="employer-container">
        <Outlet/>
      </div>
      <Footer />
    </div>
  )
}

export default Employer