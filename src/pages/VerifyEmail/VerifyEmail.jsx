import React, { useState } from 'react'
import './VerifyEmail.css'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const VerifyEmail = () => {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = () => {
    setLoading(true);
    message.success('Verify email successfully!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }

  return (
    <div className='verify-email-whole-container'>
      <div className="verify-email-container">
        <div className="verify-email-content">
          <h1>Verify Email</h1>
          <p>
            Thank you for registering with us! Please verify your email address to complete the registration process.
          </p>
          <div className="verify-email-btn">
            <button type="submit" onClick={handleVerifyEmail} disabled={loading}>
              Verify Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail