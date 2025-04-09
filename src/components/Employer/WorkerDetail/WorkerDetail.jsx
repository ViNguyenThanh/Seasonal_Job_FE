import React from 'react'
import './WorkerDetail.css'
import { Breadcrumb } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {  ContainerOutlined, FolderOpenOutlined, SnippetsOutlined, SolutionOutlined } from '@ant-design/icons';


const WorkerDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state; //item này bao gồm cả jobGroupInfo ( thông tin của 1 group) và jobPostingInfo (thông tin của 1 posting) và workerInfo (thông tin của 1 worker)
  // console.log(item);
  return (
    <div className='worker-detail-whole-container'>
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
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}/employer-job-posting-detail/${item.jobPostingInfo.id}`, { state: { jobGroupInfo: item.jobGroupInfo,  jobPostingInfo: item.jobPostingInfo} })}>
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
    </div>
  )
}

export default WorkerDetail