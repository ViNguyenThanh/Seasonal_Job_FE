import React from 'react'
import './WhyChooseUs.css'
import image from '/assets/Introducing-Man - Copy.png'
import { ClockCircleOutlined, CustomerServiceFilled, DesktopOutlined, SafetyCertificateFilled } from '@ant-design/icons';

const WhyChooseUs = () => {
  return (
    <div className='why-choose-us-container'>
      <div className="why-choose-us-content">
        <h1 className='title'>Why Choose <br/> Our Website?</h1>
        <div className="why-choose-us-left">
          <h1>Why Choose Our Website?</h1>
          <div className="benefit">
            <div className="benefit-content">
              <p><DesktopOutlined /></p>
              <p>User-friendly interface</p>
            </div>
            <div className="benefit-content">
              <p><CustomerServiceFilled /></p>
              <p>Fast support</p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-content">
              <p><SafetyCertificateFilled /></p>
              <p>Quality assurance</p>
            </div>
            <div className="benefit-content">
              <p><ClockCircleOutlined /></p>
              <p>Flexible and convenient</p>
            </div>
          </div>
        </div>

        <div className="why-choose-us-right">
          <img src={image} />
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs