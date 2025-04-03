import React from 'react'
import './Worker.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import WorkerMenu from '../../components/Worker/WorkerMenu/WorkerMenu'

const Worker = () => {
  return (
    <div className='worker-whole-container'>
      <Header />
      <div className="worker-container">
        <div className="worker-left-container">
            <WorkerMenu/>
        </div>
        <div className="worker-right-container">
            <Outlet/>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Worker