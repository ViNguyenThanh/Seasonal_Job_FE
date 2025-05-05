import React from 'react'
import './EmployerPremium.css'
import premium from '/assets/Premium.png'
import { getUserFromToken } from '../../utils/Token';
import { useNavigate } from 'react-router-dom';

const EmployerPremium = () => {
  const navigate = useNavigate();

  const premiumPlans = [
    {
      title: "BASIC",
      content:
        "Just starting out or hiring occasionally? BASIC is a budget-friendly way to post jobs efficiently — perfect for small businesses or occasional hires.",
      price: "199.000 VND",
      numberOfMonths: 3,
      benefits: [
        "✅ 100% free job posting fees.",
        "✅ Post freely without worrying about extra charges.",
      ],
    },
    {
      title: "STANDARD",
      content:
        "Hiring more often? STANDARD helps you post jobs regularly without overspending. A great fit for businesses with ongoing hiring needs.",
      price: "299.000 VND",
      numberOfMonths: 6,
      benefits: [
        "✅ 100% free job posting fees.",
        "✅ More savings for regular recruitment.",
      ],
    },
    {
      title: "PREMIUM",
      content:
        "Hiring all year round? PREMIUM gives you unlimited postings with no extra fees. Total freedom for long-term recruitment.",
      price: "499.000 VND",
      numberOfMonths: 12,
      benefits: [
        "✅ 100% free job posting fees.",
        "✅ The most cost-effective choice for professional employers.",
      ],
    },
  ];

  const handlePayment = () => {
    const { user } = getUserFromToken();
    if(!user || user.role !== 'employer') {
      navigate('/login-for-employer', window.scrollTo(0, 0))
    }
  };

  return (
    <div className='employer-premium-container'>
      <div className="employer-premium-top">
        <div className="employer-premium-top-left">
          <p className='title'><span>🌟</span> Become a Premium Member – Post Jobs Easily and Save More Every Day!</p>
          <p className='content'>Are you an employer who hires frequently?  
            Looking to optimize your job posting costs? <span>The Premium Package</span> is the perfect solution for you!</p>
        </div>
        <div className="employer-premium-top-right">
          <img src={premium} />
        </div>
      </div>

      <div className="employer-premium-bottom">
        <p className='title'>Package Service</p>
        {premiumPlans.map((plan, index) => (
          <div key={index} className="employer-premium-bottom-item">
            <p className='plan-title'>{plan.title}</p>
            <p className='plan-content'>{plan.content}</p>
            <p className='plan-price'><span>{plan.price}</span> / {plan.numberOfMonths} month{plan.numberOfMonths > 1 ? "s" : ""}</p>
            <div className="line"></div>
            {plan.benefits.map((benefit, i) => (
              <p className='plan-benefit' key={i}>{benefit}</p>
            ))}
            <div className="choose-plan-btn">
              <button onClick={()=> handlePayment()}>
                Choose Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployerPremium