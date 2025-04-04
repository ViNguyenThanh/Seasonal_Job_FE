import React from 'react'
import './JobPostingFlow.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'

const JobPostingFlow = () => {
    return (
        <div className='job-posting-flow-whole-container'>
            <EmployerHeader />
            <div className="job-posting-flow-container">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default JobPostingFlow