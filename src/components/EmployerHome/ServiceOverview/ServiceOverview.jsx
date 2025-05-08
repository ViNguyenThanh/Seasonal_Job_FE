import React from 'react'
import './ServiceOverview.css'
import image from '/assets/Employer-Services.png'
import { DashboardOutlined, PlusOutlined, SolutionOutlined } from '@ant-design/icons';

const ServiceOverview = () => {
  return (
    <div className='service-overview-container'>
      <div className="service-overview-top">
        <div className="service-overview-top-left">
          <h1>Platform & Services</h1>
          <img src={image} />
          <p>Providing services for employers: from posting jobs, managing candidates' job applications to monitoring candidates' work progress after recruitment in a flexible and effective way.</p>
        </div>
        <div className="service-overview-top-right">
          <img src={image} />
        </div>
      </div>

      <div className="service-overview-bottom">
        <div className="service-overview-bottom-item">
          <div><PlusOutlined/></div>
          <h2>Posting job ads</h2>
          <p>Create and manage job ads with just a few steps.</p>
        </div>

        <div className="service-overview-bottom-item">
          <div><SolutionOutlined/></div>
          <h2>Managing <br/> recruitment progress</h2>
          <p>Tracking and updating application status in a transparent and easy way.</p>
        </div>

        <div className="service-overview-bottom-item">
          <div><DashboardOutlined /></div>
          <h2>Managing <br/> work progress</h2>
          <p>Monitoring workers' progress and work efficiency during the working process.</p>
        </div>
      </div>
    </div>
  )
}

export default ServiceOverview