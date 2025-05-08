import React from 'react'
import './ShortTermHiring.css'
import { useNavigate } from 'react-router-dom'
import image from '/assets/Work-On-Computer.png'

const ShortTermHiring = () => {
  const navigate = useNavigate()
  return (
    <div className='short-term-hiring-container'>
      <div className="short-term-hiring-left">
        <h1>Hire Short-Term Workers </h1>
        <img src={image} />
        <p>Find qualified candidates for temporary and seasonal positions with ease.</p>
        <p>Our platform connects you with workers quickly and efficiently, helping you meet your staffing needs without the hassle.</p>      
        <div className="post-job-btn">
          <button onClick={() => navigate('/job-posting-flow/posting-notifications', window.scrollTo(0, 0))}>
            Post a Job
          </button>
        </div>
      </div>
      <div className="short-term-hiring-right">
        <img src={image} />
      </div>
    </div>
  )
}

export default ShortTermHiring