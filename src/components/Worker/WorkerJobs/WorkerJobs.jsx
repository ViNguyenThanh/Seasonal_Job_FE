import React from 'react'
import './WorkerJobs.css'
import { CalendarOutlined, DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const WorkerJobs = () => {

  const navigate = useNavigate();

  const listData = [
    {
      id: 1,
      title: "Project Manager",
      location: "City, District",
      salary: "300.000",
      remaining: "4",
      status: "Processing",
      today: "10/5/2025"
    },
    {
      id: 2,
      title: "Project Manager",
      location: "City, District",
      salary: "300.000",
      remaining: "4",
      status: "Processing",
      today: "10/5/2025"
    },
    {
      id: 3,
      title: "Project Manager",
      location: "City, District",
      salary: "300.000",
      remaining: "4",
      status: "Processing",
      today: "10/5/2025"
    },
    {
      id: 4,
      title: "Project Manager",
      location: "City, District",
      salary: "300.000",
      remaining: "1",
      status: "Processing",
      today: "10/5/2025"
    },
  ]

  return (
    <div className='worker-jobs-container'>
      <h1>My Jobs</h1>

      <div className="worker-jobs-search">

      </div>

      {listData.map((item) => (
        <div className="worker-jobs-item" key={item.id} onClick={() => navigate(`/worker/worker-jobs/worker-job-detail/${item.id}`, window.scrollTo(0, 0))}>
          <div className="worker-jobs-item-left">
            <p className='worker-jobs-item-title'>{item.title}</p>
            <p className='worker-jobs-item-info'>
              <EnvironmentOutlined /> {item.location} &emsp;
              <DollarOutlined /> {item.salary} VND &emsp;
              <CalendarOutlined /> {item.remaining} day{item.remaining > 1 ? 's' : ''} remaining
            </p>
          </div>
          <div className="worker-jobs-item-right">
            <p>{item.status} <br /> ({item.today})</p>
          </div>
        </div>
      ))}

    </div>
  )
}

export default WorkerJobs