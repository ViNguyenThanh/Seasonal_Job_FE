import React, { useEffect, useState } from 'react'
import './PrivacyPolicy.css'
import logo from '/assets/logo.png'
import Footer from '../../components/Footer/Footer'

const PrivacyPolicy = () => {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < lastScrollY) { // Kiểm tra nếu người dùng cuộn lên. Nếu đúng, header sẽ được hiển thị
        setShowHeader(true)
      } else if (window.scrollY < 10) { // để khi component Header được gọi ở trang mới thì Header sẽ được hiện ra lần đầu tiên // nói cách khác, kiểm tra nếu người dùng ở gần đầu trang (khoảng cách cuộn từ trên cùng ít hơn 10px), header sẽ được hiển thị 
        setShowHeader(true)
      } else {
        setShowHeader(false)
      }
    }
    setLastScrollY(window.scrollY)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader)

      return () => {
        window.removeEventListener('scroll', controlHeader)
      }
    }
  }, [lastScrollY])

  return (
    <div className='privacy-policy-whole-container'>

      <div className={`header-empty-whole-container ${showHeader ? 'show' : ''}`} >
        <div className={`header-empty-container ${showHeader ? 'show-down' : ''}`}>
          <img src={logo} />
        </div>
      </div>

      <div className="privacy-policy-container">
        <div className="privacy-policy-content">
          <h1 className='title'>Privacy Policy</h1>
          <p>
            The Seasonal Job Connection Platform (SJCP) is committed to protecting the privacy and personal information of users.
            This policy explains how we collect, use, store and protect your personal data during the use of the platform.
          </p>
          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information from users:</p>
          <ul>
            <li><strong>Personal information:</strong> Full name, phone number, email, company name (if an employer).</li>
            <li><strong>Job information:</strong> Application history, posted job information, job progress.</li>
          </ul>

          <h2>2. Purpose of Using Information</h2>
          <ul>
            <li>Providing recruitment connection services - applying for seasonal jobs.</li>
            <li>Authentication and account management.</li>
            <li>Posting and managing seasonal job information.</li>
            <li>Connecting workers and employers.</li>
            <li>Processing and responding to support requests from users.</li>
            <li>Improve service quality and optimize user experience.</li>
            <li>Comply with current legal regulations.</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We apply technical and organizational measures to ensure that personal information is protected:</p>
          <ul>
            <li>Encrypt connections using SSL/TLS.</li>
            <li>Firewalls and system access monitoring.</li>
            <li>Periodic security updates and vulnerability testing.</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>We do not share, sell or disclose users' personal information to third parties, except in the following cases:</p>
          <ul>
            <li>With explicit consent from the user.</li>
            <li>When requested by a competent authority as prescribed by law.</li>
            <li>When necessary to protect the rights, property or safety of the platform and other users.</li>
          </ul>

          <h2>5. Minors (&lt;18 years old) Data</h2>
          <p>
            We do not encourage people under 18 years old to use the platform without the consent of a parent or legal guardian.
            If an invalid registration is detected, the system has the right to delete the account and all related data.
          </p>

          <h2>6. User Rights and Options</h2>
          <p>Users have the right to:</p>
          <ul>
            <li>Access, edit or delete personal information.</li>
            <li>Withdraw consent to use data.</li>
            <li>Send requests related to personal data via email: <span> scjp123sstaff@gmail.com</span>.</li>
          </ul>

          <h2>7. Privacy Policy by Role</h2>
          <h3>For Workers:</h3>
          <ul>
            <li>We only share application information with employers to whom you submit your profile.</li>
            <li>You can update or delete your personal profile at any time.</li>
          </ul>
          <h3>For Employers:</h3>
          <ul>
            <li>Job postings must comply with transparency regulations.</li>
            <li>Employers are not allowed to use candidate information for purposes other than recruitment.</li>
          </ul>
          <h3>For Support Staff:</h3>
          <ul>
            <li>Access to user information is only for the purpose of technical support or handling complaints.</li>
          </ul>
          <h3>For Administrators:</h3>
          <ul>
            <li>Have full access to the system to review, compile and process data.</li>
            <li>Must comply with the internal security and ethics procedures.</li>
          </ul>

          <h2>8. Data Storage and Retention Period</h2>
          <p>
            Data is securely stored on the system for the period necessary to serve the purpose of use.
            Users can request data deletion after the account is no longer active.
          </p>

          <h2>9. Policy Changes</h2>
          <p>
            This privacy policy may be updated from time to time. Any changes will be announced on this page.
            Continued use of the platform after the policy is updated means you agree to the changes.
          </p>

          <p>If you have any questions regarding the Privacy Policy, please contact the development team via email: <span> scjp123sstaff@gmail.com</span>.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy