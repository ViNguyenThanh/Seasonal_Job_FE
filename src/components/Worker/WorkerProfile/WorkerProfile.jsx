import React from 'react'
import './WorkerProfile.css'
import { Rate } from 'antd'
import {  EnvironmentOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'

const WorkerProfile = () => {
  return (
    <div className='worker-profile-container'>
      <div className="worker-profile-left">

        <div className="worker-identity">
          <img src={avatar} />
          <div className="worker-name-star">
            <p>Trương Thị Quỳnh Giang</p>
            <div><Rate defaultValue={4} disabled /></div>
          </div>
        </div>
      </div>

      <div className="worker-profile-right">
        <div className="worker-info">
          <p className='worker-email'><MailOutlined /> truongthiquynhgiang@example.com</p>
          <p><UserSwitchOutlined /> Female  </p> {/* -- None -- */}
        </div>
        <div className="worker-info">
          <p><EnvironmentOutlined /> Tỉnh Tây Ninh, Huyện Dương Minh Châu</p>
          <p><PhoneOutlined rotate={90} /> 0123456789 </p>
        </div>
        <div className="worker-info">
          <p><GiftOutlined /> 01/01/2000</p>
        </div>
        <div className='worker-description'>
          <p> <IdcardOutlined /> About me: </p>
          <p>I am an energetic individual with experience in seasonal jobs such as sales,
            customer service support, and gift wrapping during holidays. I have also worked
            in production environments with high workloads and participated in event organization,
            assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure,
            and quickly adjust to job demands.</p>
          {/* <p>-- None --</p> */}
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile