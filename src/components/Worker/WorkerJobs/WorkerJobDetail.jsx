import React from 'react'
import './WorkerJobDetail.css'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const WorkerJobDetail = () => {
    const navigate = useNavigate();
    return (
        <div className='worker-job-detail-container'>
            <button
                className='go-back-btn'
                onClick={() => navigate('/worker/worker-jobs/', window.scrollTo(0, 0))}>
                <ArrowLeftOutlined />
            </button>
            
            <h1>Job Detail</h1>


        </div>
    )
}

export default WorkerJobDetail