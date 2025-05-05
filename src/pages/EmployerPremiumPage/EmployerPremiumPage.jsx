import React from 'react'
import './EmployerPremiumPage.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader'
import Footer from '../../components/Footer/Footer'
import EmployerPremium from '../../components/EmployerPremium/EmployerPremium'

const EmployerPremiumPage = () => {
  return (
    <div className='employer-premium-page-whole-container'>
      <EmployerHeader />
      <div className="employer-premium-page-container">
        <EmployerPremium />
      </div>
      <Footer />
    </div>
  )
}

export default EmployerPremiumPage