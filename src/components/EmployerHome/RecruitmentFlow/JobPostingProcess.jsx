import React from 'react'
import './JobPostingProcess.css'
import { ArrowDownOutlined, CreditCardOutlined, DiffOutlined, RollbackOutlined, ScheduleOutlined, SnippetsOutlined } from '@ant-design/icons';

const JobPostingProcess = () => {
  return (
    <div className='job-posting-process-container'>
      <div className="job-posting-process-content">
        <h1>Job Posting Process</h1>
        <p className='introduction'>To help you easily create and manage effective job postings, SJCP would like to
          send you the simple steps below. Follow them one by one to start your recruitment
          campaign smoothly!</p>

        <div className="job-posting-process-step">
          <p className='step-number'>1</p> <p className='step-content'> <DiffOutlined />Create a Job Group</p>
        </div>
        <div className="job-posting-process-step">
          <p className='step-number'>2</p> <p className='step-content'> <ScheduleOutlined />Set the Job Group's duration</p>
        </div>
        <div className="job-posting-process-step">
          <p className='step-number'>3</p> <p className='step-content'> <SnippetsOutlined /> Add the number and description of Job Potings you want to post</p>
        </div>
        <div className="job-posting-process-step">
          <p className='step-number'>4</p> <p className='step-content'> <CreditCardOutlined /> Proceed to payment</p>
        </div>
      </div>
    </div>
  )
}

export default JobPostingProcess