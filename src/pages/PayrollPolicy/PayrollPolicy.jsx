import React, { useEffect, useState } from 'react'
import './PayrollPolicy.css'
import logo from '/assets/logo.png'
import Footer from '../../components/Footer/Footer'

const PayrollPolicy = () => {
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
    <div className='payroll-policy-whole-container'>

      <div className={`header-empty-whole-container ${showHeader ? 'show' : ''}`} >
        <div className={`header-empty-container ${showHeader ? 'show-down' : ''}`}>
          <img src={logo} />
        </div>
      </div>

      <div className="payroll-policy-container">
        <div className="payroll-policy-content">
          <h1 className='title'>Payroll Policy</h1>
          <h2>1. Purpose</h2>
          <p>This policy outlines the principles and procedures for salary payments to Workers on the SJCP platform, ensuring transparency, fairness, and financial safety among Employers, Workers, Support Staffs, and Admins.</p>

          <h2>2. General Principles</h2>
          <ul>
            <li>All payments are made through the system's internal wallet with VietQR support.</li>
            <li>Workers are paid based on the percentage of job progress completed.</li>
            <li>Salaries are not paid for any day that lacks both check-in and check-out photos as required.</li>
            <li>Employers cannot withdraw deposited funds for a Job Group until all associated Workers have been paid.</li>
            <li>Any remaining balance after the Job Group ends will be refunded to the Employer’s wallet.</li>
          </ul>

          <h2>3. Fund Lock Mechanism</h2>
          <p>When an Employer creates a Job Group, the system calculates and locks the required total budget in the wallet:</p>
          <p><strong>Total Cost of a Job Group =  Sum of all Job Postings' costs ( where each Job Posting = Wage × Number of Workers) + 50,000 VND</strong> (if no VIP package is applied)</p>
          <p>At the end of the Job Group:</p>
          <ul>
            <li>Wages are automatically paid to Workers.</li>
            <li>Remaining funds from unassigned or uncompleted positions are released back to the Employer.</li>
          </ul>

          <h2>4. Payment Conditions for Workers</h2>
          <p>Workers are only eligible for payment if:</p>
          <ul>
            <li>They upload check-in and check-out photos on the correct Assignment Date.</li>
            <li>Their Progress Completed is validated by the Employer or Support Staff.</li>
            <li>Otherwise, Progress Completed for that day is counted as 0.</li>
          </ul>
          <p><strong>Salary Paid = Percentage of Progress Completed × Assigned Wage. </strong></p>

          <h2>5. Rights and Responsibilities</h2>
          <h3>Employers</h3>
          <ul>
            <li>Must deposit sufficient funds to create a Job Group.</li>
            <li>Cannot edit progress more than one day after the assigned date, unless with valid justification.</li>
            <li>Cannot add new Workers once the Job Group has started.</li>
          </ul>
          <h3>Workers</h3>
          <ul>
            <li>Must work on schedule and upload required photos on time.</li>
            <li>Cannot request repeated payments or dispute outside the official process.</li>
          </ul>
          <h3>Support Staff</h3>
          <ul>
            <li>May only modify locked progress upon formal Employer request.</li>
          </ul>

          <h2>6. Payment Method</h2>
          <p>All payments are made to the Worker’s wallet on the platform after the Job Group ends. SJCP only processes payment when completion is validated by the system.</p>

          <h2>7. Commitment</h2>
          <p>SJCP is committed to building a fair, accurate payment mechanism and protecting the legal rights of all users. Violations or disputes must be resolved through the official support process.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PayrollPolicy