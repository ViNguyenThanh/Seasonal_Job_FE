import React from 'react'
import './EmployerTransactionDetail.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ContainerOutlined, CreditCardOutlined, ScheduleOutlined, SnippetsOutlined, TagOutlined } from '@ant-design/icons';

const EmployerTransactionDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location);
  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'pending';
    if (status === 'HELD') return 'held';
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'RELEASED') return 'released';
    return '';
  }

  return (
    <div className='employer-transaction-detail-container'>
      <button
        className='go-back-btn'
        onClick={() => navigate('/employer/employer-transactions', window.scrollTo(0, 0))}>
        <ArrowLeftOutlined />
      </button>

      <h1 className='employer-transaction-detail-title'>Transaction History Detail</h1>

      <div className="employer-transaction-detail-info">
        <p><ContainerOutlined /> Job Group Name: {location.state.jobGroupName}</p>
        <p className='double-content'> <ScheduleOutlined /> Start Date: {location.state.startDate}</p>
        <p className='double-content'> <ScheduleOutlined /> End Date: {location.state.endDate}</p>
        <p className='double-content'><CalendarOutlined /> Transaction Date: {location.state.date}</p>
        <p className='double-content'><TagOutlined /> Status:
          <span className={getStatusClass(location.state.status)}> {location.state.status}</span>
        </p>
        <p className='amount'><CreditCardOutlined /> Amount: <br />
          <span> {location.state.amount.toLocaleString('vi-VN')} VND</span>
        </p>
      </div>

    </div>
  )
}

export default EmployerTransactionDetail