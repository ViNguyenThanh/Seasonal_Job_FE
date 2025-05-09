import React, { useEffect, useState } from 'react'
import './TermsAndConditions.css'
import logo from '/assets/logo.png'
import Footer from '../../components/Footer/Footer'

const TermsAndConditions = () => {
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
    <div className='terms-and-conditions-whole-container'>

      <div className={`header-empty-whole-container ${showHeader ? 'show' : ''}`} >
        <div className={`header-empty-container ${showHeader ? 'show-down' : ''}`}>
          <img src={logo} />
        </div>
      </div>

      <div className="terms-and-conditions-container">
        <div className="terms-and-conditions-content">
          <h1 className='title'>Terms & Conditions</h1>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using SJCP, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not continue using the platform.</p>

          <h2>2. Definitions</h2>
          <ul>
            <li><strong>Platform:</strong> SJCP developed and maintained by a group of students.</li>
            <li><strong>Employer:</strong> Users who post seasonal job listings.</li>
            <li><strong>Worker:</strong> Users who seek and apply for seasonal jobs.</li>
            <li><strong>Support Staff:</strong> Users who provide assistance and resolve user issues.</li>
            <li><strong>Admin:</strong> Users who manage accounts, content, and platform data.</li>
            <li><strong>Services:</strong> All functionalities provided by SJCP, including job posting, application, progress tracking, and payment handling.</li>
          </ul>

          <h2>3. Usage Conditions</h2>
          <p>SJCP is intended for users aged 18 and above. By registering, you affirm you have the legal capacity to engage with the platform.</p>

          <h2>4. User Responsibilities</h2>
          <h3>a. Employers</h3>
          <ul>
            <li>Provide clear job descriptions: title, requirements, payment, duration, location.</li>
            <li>Review applications and respond transparently and on time.</li>
            <li>Make payment after job completion confirmation.</li>
          </ul>
          <h3>b. Workers</h3>
          <ul>
            <li>Maintain accurate and updated personal profiles.</li>
            <li>Apply for jobs matching skills and availability.</li>
            <li>Complete tasks fully and timely as described.</li>
            <li>Confirm job completion via the platform.</li>
          </ul>
          <h3>c. Support Staff</h3>
          <ul>
            <li>Guide users and assist with complaints.</li>
            <li>Handle disputes neutrally and fairly.</li>
          </ul>
          <h3>d. Administrators</h3>
          <ul>
            <li>Ensure transparency, security, and stability of the platform.</li>
            <li>Manage accounts, content, and system transactions.</li>
            <li>Track revenue from paid services.</li>
          </ul>

          <h2>5. Payment Terms</h2>
          <ul>
            <li>All payments between employers and workers are processed via SJCP.</li>
            <li>Employers must prepay before approving workers.</li>
            <li>Funds are held securely and only released after both parties confirm job completion.</li>
            <li>SJCP is not liable for transactions outside the platform.</li>
          </ul>

          <h2>6. Content Management</h2>
          <p>All job posts, profiles, and interactions are subject to moderation. SJCP may remove or block content/accounts that violate rules or contain misleading, offensive, or illegal material.</p>

          <h2>7. Data Protection & Privacy</h2>
          <ul>
            <li>Personal data is collected only to operate the platform.</li>
            <li>No third-party sharing unless required by law.</li>
            <li>SSL/TLS encryption and firewall protections are applied.</li>
          </ul>

          <h2>8. System Access & Maintenance</h2>
          <p>SJCP aims for 99% uptime. Maintenance may occur during low-traffic hours. Temporary suspensions for updates or fixes may happen without prior notice.</p>

          <h2>9. Limitation of Liability</h2>
          <ul>
            <li>SJCP acts as a neutral intermediary and is not responsible for job quality or user behavior.</li>
            <li>Payment delays due to failure to follow proper procedures are not SJCP's responsibility.</li>
            <li>Disputes not processed through the official system or lacking evidence may not be resolved.</li>
            <li>SJCP is not liable for indirect damages, business losses, or uncontrollable technical issues.</li>
            <li>Partial payouts are processed as per progress confirmed. Remaining funds are refunded post-confirmation. All funds must stay within the platform’s wallet.</li>
          </ul>

          <h2>10. Dispute Resolution</h2>
          <p>Disputes must first go through Support Staff. If unresolved, Admins may temporarily suspend accounts for investigation and resolution.</p>

          <h2>11. Termination of Service</h2>
          <p>SJCP may suspend or terminate accounts found violating terms or misusing the platform.</p>

          <h2>12. Amendments</h2>
          <p>SJCP may revise these Terms at any time. Changes will be notified via email or platform notifications. Continued use implies agreement with the revised Terms.</p>

          <p>By using SJCP, you confirm that you have read, understood, and agreed to all the Terms and Conditions above.</p>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsAndConditions