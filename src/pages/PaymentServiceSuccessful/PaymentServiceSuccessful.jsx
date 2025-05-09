import React from 'react'
import './PaymentServiceSuccessful.css'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const PaymentServiceSuccessful = () => {

  const navigate = useNavigate();

  return (
    <div className='payment-service-successful-whole-container'>
      <div className="payment-service-successful-container">
        <div className="payment-service-successful-content">
          <h1><span>🎉</span> Payment <br/> Successful! <span>🎉</span> </h1>
          {/* <p className='thank-u'>Thank you for choosing the <br/> <span>BASIC</span> plan!</p> */}
          <p>You’ve now unlocked FREE job posting privileges for the full duration of your plan.</p>
          <p>🔒 Your benefits are now active.</p>
          <p>🎯 You can now post unlimited job listings (based on your plan) without worrying about additional costs.</p>

          <div className="payment-service-successful-btn">
            <button type="submit" onClick={() => navigate('/employer-home', window.scrollTo(0, 0))}>
              <ArrowLeftOutlined /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentServiceSuccessful