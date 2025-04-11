import React, { useState } from 'react'
import './WorkerDetailForEmployer.css'
import { Breadcrumb, Rate } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ContainerOutlined, DownOutlined, EnvironmentOutlined, FolderOpenOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, SnippetsOutlined, SolutionOutlined, UpOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'

const WorkerDetailForEmployer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state; //item này bao gồm cả jobGroupInfo ( thông tin của 1 group) và jobPostingInfo (thông tin của 1 posting) và workerInfo (thông tin của 1 worker)
  // console.log(item);

  const [showMore, setShowMore] = useState(false);

  return (
    <div className='worker-detail-for-employer-whole-container'>
      <Breadcrumb className='breadcrumb'
        items={[
          {
            title: <Link
              to="/employer/employer-job-groups"
              className='b-title-1'
            >
              <FolderOpenOutlined /> List Job Groups
            </Link>,
          },
          {
            title:
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}`, { state: item.jobGroupInfo })}>
                  <ContainerOutlined /> Job Group Detail
                </div>
              )
          },
          {
            title:
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}/employer-job-posting-detail/${item.jobPostingInfo.id}`, { state: { jobGroupInfo: item.jobGroupInfo, jobPostingInfo: item.jobPostingInfo } })}>
                  <SnippetsOutlined /> Job Posting Detail
                </div>
              )
          },
          {
            title: (
              <div className='b-title-2'>
                <SolutionOutlined /> Worker Detail
              </div>
            ),
          },
        ]}
      />

      <div className='worker-detail-for-employer-container'>
        <div className="worker-detail-for-employer-info">
          <div className="worker-detail-for-employer-info-left">
            <div className="worker-identity">
              <img src={avatar} />
              <div className="worker-name-star">
                <p>{item.workerInfo?.workerName}</p>
                <div><Rate defaultValue={4} disabled /></div>
              </div>
            </div>
          </div>

          <div className="worker-detail-for-employer-info-right">
            <h2>Worker Information</h2>
            <div className="worker-info">
              <p className='worker-email'><MailOutlined /> {item.workerInfo?.email}</p>
              <p><UserSwitchOutlined /> Female  </p> {/* -- None -- */}
            </div>
            <div className="worker-info">
              <p><EnvironmentOutlined /> Tỉnh Tây Ninh, Huyện Dương Minh Châu</p>
              <p><PhoneOutlined rotate={90} /> 0123456789 </p>
            </div>
            <div className="worker-info">
              <p><GiftOutlined /> 01/01/2000</p>
            </div>
            {showMore && (
              <>
                <div className='worker-description'>
                  <p> <IdcardOutlined /> About me: </p>
                  <p>I am an energetic individual with experience in seasonal jobs such as sales,
                    customer service support, and gift wrapping during holidays. I have also worked
                    in production environments with high workloads and participated in event organization,
                    assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure,
                    and quickly adjust to job demands.</p>
                  {/* <p>-- None --</p> */}
                </div>
                {/* Nút Show less */}
                <div className="show-more-less-btn show-less">
                  <button onClick={() => { setShowMore(false); window.scroll({ top: 0, left: 0, behavior: 'smooth' }); }}><UpOutlined /> Show less</button>
                </div>
              </>
            )}
            {/* Nút Show more (chỉ hiển thị khi showMore = false) */}
            {!showMore && (
              <div className="show-more-less-btn">
                <button onClick={() => setShowMore(true)}><DownOutlined /> Show more</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDetailForEmployer