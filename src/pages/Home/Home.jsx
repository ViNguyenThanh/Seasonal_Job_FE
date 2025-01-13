import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div className='home-whole-container'>
      <Header />
      <div className="home-container">
        <h1>Home</h1>
      </div>
      <Footer />
    </div>
  )
}

export default Home