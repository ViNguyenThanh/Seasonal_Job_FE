import React from 'react'
import './WorkerTransactionDetail.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, CalendarOutlined, ContainerOutlined, CreditCardOutlined, ScheduleOutlined, SnippetsOutlined, TagOutlined, UserSwitchOutlined } from '@ant-design/icons';

const WorkerTransactionDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location);
  const getStatusClass = (status) => {
    if (status === 'HELD') return 'pending';
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'COMPLETED') return 'released';
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
        <>
          <p><SnippetsOutlined /> Type transaction: {location.state.description}</p>
          <p><UserSwitchOutlined /> Sender: {location.state.sender}</p>
          <p><UserSwitchOutlined /> Receiver: {location.state.receiver}</p>
        </>
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