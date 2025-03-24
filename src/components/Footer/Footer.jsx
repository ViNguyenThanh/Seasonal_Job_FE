import React from 'react'
import './Footer.css'
import logo from '/assets/logo.png'
import instagram from '/assets/instagram.png'
import facebook from '/assets/facebook.png'
import twitter from '/assets/twitter.png'
import { Link } from 'react-router-dom'
import telephone from '/assets/telephone.png'
import location from '/assets/location.png'
import email from '/assets/email.png'

const Footer = () => {
  return (
    <div className='footer-whole-container'>
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} className='footer-logo' />
          <div className="follow-us">
            <p>FOLLOW US:</p>
            <img src={instagram} />
            <img src={facebook} />
            <img src={twitter} />
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-content">
            <p className='title'>ABOUT US</p>
            <p>SJCP is a trusted intermediary connecting employers
              with job seekers. We streamline the hiring process by
              categorizing jobs efficiently, making it easier for
              candidates to find the right opportunities and for
              companies to discover top talent. Whether you're
              looking for your next career move or the perfect
              candidate, we've got you covered
            </p>
          </div>
          <div className="footer-content">
            <p className='title'>TERMS & POLICIES</p>
            <div className="policy">
              <Link className='policy-link'>Privacy Policy</Link>
              <Link className='policy-link'>Terms of Service</Link>
              <Link className='policy-link'>Payroll Policy</Link>
            </div>
          </div>
          <div className="footer-content">
            <p className='title'>CONTACT US</p>
            <div className="contact-us">
              <img src={telephone} />
              <p><b>Phone:</b> 0944431812</p>
            </div>
            <div className="contact-us">
              <img src={location} />
              <p><b>Address:</b> Vinhomes Grand Park, Q.9,
                TP Thủ Đức, TP.HCM</p>
            </div>
            <div className="contact-us">
              <img src={email} />
              <p><b>Email:</b> scjp@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer