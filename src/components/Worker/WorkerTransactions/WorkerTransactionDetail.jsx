import React from 'react'
import './WorkerTransactionDetail.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ContainerOutlined, CreditCardOutlined, ScheduleOutlined, SnippetsOutlined, TagOutlined } from '@ant-design/icons';

const WorkerTransactionDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location);
  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'pending';
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'RELEASED') return 'released';
    return '';
  }

  return (
    <div className='worker-transaction-detail-container'>
      <button
        className='go-back-btn'
        onClick={() => navigate('/worker/worker-transactions', window.scrollTo(0, 0))}>
        <ArrowLeftOutlined />
      </button>

      <h1 className='worker-transaction-detail-title'>Transaction History Detail</h1>

      <div className="worker-transaction-detail-info">
        <p><ContainerOutlined /> Job Group Name: {location.state.jobPostingName}</p>
        <p className='double-content'> <ScheduleOutlined /> Start Date: {location.state.date}</p>
        <p className='double-content'> <ScheduleOutlined /> End Date: {location.state.date}</p>
        <p><SnippetsOutlined /> Job Posting Name: {location.state.jobPostingName}</p>
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

export default WorkerTransactionDetail