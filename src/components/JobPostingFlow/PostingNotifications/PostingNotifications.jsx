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
                            to="/employer-home"
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
                        <span className='black'>1. Each Job Posting must be part of a Job Group</span> → Before posting a job, you
                        must first create a <span className='purple'>Job Group</span>. <br />
                        <span className='black'>2. Job Group duration</span> → Because this is a short-term seasonal job, the time is
                        <span className='red'> only from 1 day to a maximum of 1 month (30 days)</span>. <br />
                        <span className='black'>3. Create the correct number of Job Postings</span> → Each <span className='purple'>Job Group</span> can contain
                        multiple Jobs. Make sure to set the correct number of <span className='dark-red'>Job Postings</span> needed for recruitment. <br />
                        <span className='black'>4. Payment is required before posting a job</span> → <br />
                        • &#160; When creating a <span className='dark-red'>Job Posting</span>, specify the number of employees to be recruited. <br />
                        • &#160; The system will calculate the total payment amount based on the number of employees and the set salary. <br />
                        • &#160; Each time you post, <span className='blue'>SJCP</span> will charge <span className='rose-first'>50.000 VND / 1 post</span>,
                        <span className='dark-green'> but for accounts that have paid for the Premium package, this fee will not be charged</span>. <br />
                        &emsp; &#160; Ex: You have <span className='purple'>1 Job Group</span>, including <span className='purple'>2 Jobs</span>: <br />
                        &emsp; &emsp; • <span className='blue-lagoon'>&#160; Job 1</span> needs <span className='light-blue'>4 people</span>, salary for 1 person: <span className='orange'>2.000.000 VND</span> <br />
                        &emsp; &emsp; • <span className='blue-lagoon'>&#160; Job 2</span> needs <span className='light-blue'>2 people</span>, salary for 1 person: <span className='orange'>3.000.000 VND</span> <br />
                        → The amount to be paid in advance will be:
                        <span className='light-blue'> 4</span> <span className='green'>x</span> <span className='orange'>2.000.000</span> +
                        <span className='light-blue'> 2</span> <span className='green'>x</span> <span className='orange'>3.000.000</span> =
                        <span className='light-red'> 14.000.000 (VND)</span> <br />
                        → <span className='rose'>If the account is not a Premium account</span>, the total amount to be paid will be:
                        <span className='light-red'> 14.000.000</span> + <span className='rose'>50.000</span> = <span className='crimson'>14.050.000 (VND)</span> <br />
                        {/* <span className='blue'>• You must pay the full amount and deposit in one transaction before the Job Posting is posted.</span> <br /> */}
                        <span className='warning'>⚠️</span> <span className='yellow'>Important:  </span> <br />
                        &emsp; • &#160; Your <span className='dark-red'>Job Postings</span> will <span className='dark-orange'> only be posted
                        after the payment is completed.</span> <br />
                        &emsp; • &#160; Once the payment is made, you will  <span className='red'> not be able to edit the <span className='dark-red'>Job Postings information </span> </span> <br/>
                        &emsp; &emsp; ➜ &#160;So please DOUBLE-CHECK all the details before completing the payment. <br />
                        &emsp; • &#160; This amount will be temporarily locked when starting the <span className='purple'>Job Group</span>,
                        after the <span className='purple'>Job Group</span> is completed and confirmed by both parties, this amount
                        will be unlocked and then the salary will be paid. <br />
                        <span className='warning'>🚩</span> <span className='red'>Note: </span> <br />
                        &emsp; • &#160; After the <span className='dark-red'>Job Postings</span> is approved, <span className='dark-green'>after 7 days </span>,
                        the <span className='purple'>Job Group</span> must have <span className='red'>at least 1 worker </span> whose application has been approved 
                        in a <span className='dark-red'>Job Posting</span> before the <span className='purple'>Job Group</span> can be started. <br />
                        &emsp; • &#160; If the <span className='dark-red'>other Job Postings</span> in the <span className='purple'>Job Group </span>
                        <span className='red'>have reached the start date</span> but <span className='red'>no worker</span> has been approved yet, then after the <span className='purple'>Job Group </span>
                        is completed, <span className='blue'>SJCP</span> will refund the corresponding amount of <span className='dark-red'>those Job Postings</span> to you. <br />
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