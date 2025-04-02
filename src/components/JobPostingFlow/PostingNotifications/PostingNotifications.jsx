import React from 'react'
import './PostingNotifications.css'
import { Breadcrumb } from 'antd'
import { BellOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const PostingNotifications = () => {

    const navigate = useNavigate()

    return (
        <div className='posting-notifications-container'>
            <Breadcrumb className='breadcrumb'
                items={[
                    {
                        title: <Link
                            to="/"
                            className='b-title-1'
                        >
                            <HomeOutlined /> Home
                        </Link>,
                    },
                    {
                        title: (
                            <div className='b-title-2'>
                                <BellOutlined /> Notification
                            </div>
                        ),
                    },
                ]}
            />

            <div className="posting-notifications-info">

                <h1>POSTING <span>NOTIFICATIONS</span></h1>

                <div className="posting-notification-content">
                    <p>
                        Hello! <span className='blue'>SJCP</span> would like to send some notices to employers. To ensure a
                        transparent and efficient job posting process, please follow these guidelines: <br />
                        <br />
                        <span className='black'>1. Each job must be part of a Job Group</span> → Before posting a job, you
                        must first create a Job Group. <br />
                        <span className='black'>2. Job Group duration</span> → Because this is a short-term seasonal job, the time is 
                        <span className='red'> only from 1 day to a maximum of 1 month (30 days)</span>. <br />
                        <span className='black'>3. Create the correct number of Jobs</span> → Each Job Group can contain
                        multiple Jobs. Make sure to set the correct number of Jobs needed for recruitment. <br />
                        <span className='black'>4. Payment is required before posting a job</span> → <br />
                        • When creating a Job, specify the number of employees to be recruited. <br />
                        • The system will calculate the total payment amount based on the number of employees and the set salary. <br />
                        • Each time you post, <span className='blue'>SJCP</span> will charge <span className='rose-first'>50.000 VND / 1 post</span>, 
                        <span className='dark-green'> but for accounts that have paid for the Premium package, this fee will not be charged</span>. <br/>
                        &emsp; For example: You have <span className='purple'>1 Job Group</span>, including <span className='purple'>2 Jobs</span>: <br />
                        &emsp; &emsp; • <span className='blue-lagoon'>Job 1</span> needs <span className='light-blue'>4 people</span>, salary for 1 person: <span className='orange'>2.000.000 VND</span> <br />
                        &emsp; &emsp; • <span className='blue-lagoon'>Job 2</span> needs <span className='light-blue'>2 people</span>, salary for 1 person: <span className='orange'>3.000.000 VND</span> <br />
                        → The amount to be paid in advance will be:
                        <span className='light-blue'> 4</span> <span className='green'>x</span> <span className='orange'>2.000.000</span> +
                        <span className='light-blue'> 2</span> <span className='green'>x</span> <span className='orange'>3.000.000</span> =
                        <span className='light-red'> 14.000.000 (VND)</span> <br />
                        → <span className='rose'>If the account is not a Premium account</span>, the total amount to be paid will be: 
                        <span className='light-red'> 14.000.000</span> + <span className='rose'>50.000</span> = <span className='crimson'>14.050.000 (VND)</span> <br/>
                        <span className='blue'>• You must pay the full amount and deposit in one transaction before the job posting is posted.</span> <br />
                        <span className='warning'>⚠️</span> <span className='yellow'>Important: </span> Your job posting will only be posted
                        after the payment is completed. Please double check all the details before proceeding! This amount will be
                        temporarily locked when starting the <span className='purple'>Job Group</span>, after the <span className='purple'>Job Group</span> is completed and confirmed by both parties, this amount
                        will be unlocked and then the salary will be paid. <br />
                        <br />
                        <span className='icon'>📞</span> If you have any questions, please contact our support team: <span className='blue'>Mr. Kiet: 0903334554</span> <br />
                        <br />
                        <span className='icon'>🚀</span> Wish you a smooth recruitment process!
                    </p>

                    <button onClick={() => {
                        navigate("/job-posting-flow/creating-new-job-group");
                        window.scrollTo(0, 0);
                    }}>
                        Continue <span>➜</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostingNotifications