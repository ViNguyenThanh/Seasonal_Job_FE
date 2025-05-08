import React, { useState } from 'react'
import './VerifyEmail.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../../apis/auth.request';

const VerifyEmail = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleVerifyEmail = async () => {
    setLoading(true);
    const token = searchParams.get('token');
    try {
      if (token) {
        const res = await authApi.verifyEmail(token);
        setLoading(false);
        message.success('Verify email successfully!');
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      message.error("Cannot verify email");
      console.log(error);
    }
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