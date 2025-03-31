import React from 'react'
import './JobPostingFlow.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'

const JobPostingFlow = () => {
    return (
        <div className='job-posting-flow-whole-container'>
            <Header />
            <div className="job-posting-flow-container">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default JobPostingFlow