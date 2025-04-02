import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Slide from '../../components/Home/Slide/Slide'
import CompanySpotlight from '../../components/Home/CompanySpotlight/CompanySpotlight'
import JobsSpotlight from '../../components/Home/JobsSpotlight/JobsSpotlight'
import Platform from '../../components/Home/Platform/Platform'

const Home = () => {
  return (
    <div className='home-whole-container'>
      <Header />
      <div className="home-container">
        <Slide />
        <JobsSpotlight />
        <Platform />
        <CompanySpotlight />
      </div>
      <Footer />
    </div>
  )
}

export default Home