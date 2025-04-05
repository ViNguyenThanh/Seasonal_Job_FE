import React from 'react'
import './Employer.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'

const Employer = () => {
  return (
    <div className='employer-whole-container'>
      <EmployerHeader />
      <div className="employer-container">
        <Outlet/>
      </div>
      <Footer />
    </div>
  )
}

export default Employer