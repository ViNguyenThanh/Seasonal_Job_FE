import React, { useEffect, useState } from 'react'
import './WorkerMenu.css'

import worker_profile_icon from '/assets/worker.png'
import worker_profile_icon_active from '/assets/worker-active.png'
import cv_icon from '/assets/cv.png'
import cv_icon_active from '/assets/cv-active.png'
import application_icon from '/assets/application.png'
import application_icon_active from '/assets/application-active.png'
import my_jobs_icon from '/assets/my-jobs.png'
import my_jobs_icon_active from '/assets/my-jobs-active.png'
import wallet_icon from '/assets/wallet.png'
import wallet_icon_active from '/assets/wallet-active.png'
import { useLocation, useNavigate } from 'react-router-dom'


const WorkerMenu = () => {
  const listBtn = [
    {
      id: 1,
      img: worker_profile_icon,
      activeImg: worker_profile_icon_active,
      title: "Profile",
    },
    {
      id: 2,
      img: cv_icon,
      activeImg: cv_icon_active,
      title: "CV Attachment",
    },
    {
      id: 3,
      img: application_icon,
      activeImg: application_icon_active,
      title: "Applications",
    },
    {
      id: 4,
      img: my_jobs_icon,
      activeImg: my_jobs_icon_active,
      title: "My Jobs",
    },
    {
      id: 5,
      img: wallet_icon,
      activeImg: wallet_icon_active,
      title: "Wallet & Transactions",
    },
  ]

  const [activeButton, setActiveButton] = useState(null); 
  const navigate = useNavigate();

  const handleButtonClick = (buttonIndex) => {
    if (buttonIndex === 1) {
      navigate('/worker/worker-profile');
      setActiveButton(buttonIndex);
    }
    if (buttonIndex === 2) {
      navigate('/worker/worker-cv');
    } 
    if (buttonIndex === 3){
      navigate('/worker/worker-applications')
    }
    if (buttonIndex === 4){
      navigate('/worker/worker-jobs')
    }
    if (buttonIndex === 5){
      navigate('/worker/worker-transactions')
    }

    setActiveButton(buttonIndex);
    window.scrollTo(0, 0);
  }

  // khi người dùng có reload lại trang thì đang ở component nào thì nút đó sẽ phát sáng
  const location = useLocation()
  
  useEffect(() => {
    if(location.pathname === '/worker/worker-profile' || location.pathname.includes('/worker/worker-ratings')){
      setActiveButton(1)
    }
    if(location.pathname === '/worker/worker-cv'){
      setActiveButton(2)
    }
    if(location.pathname === '/worker/worker-applications'){
      setActiveButton(3)
    }
    if(location.pathname === '/worker/worker-jobs' || location.pathname.includes('/worker/worker-jobs/worker-job-detail')){
      setActiveButton(4)
    }
    if(location.pathname === '/worker/worker-transactions'){
      setActiveButton(5)
    }
  }, [location])

  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div className='worker-menu-container'>
        <div className="worker-menu-list-btn">
        {listBtn.map((item) => (
          <div key={item.id} className='worker-menu-btn'>
            <div className={`worker-menu-btn-item ${activeButton === item.id ? 'choose' : ''}`}
              onClick={() => handleButtonClick(item.id)}
              onMouseEnter={() => setHoveredButton(item.id)} // Cập nhật khi hover
              onMouseLeave={() => setHoveredButton(null)}  // Xóa hover khi ra ngoài
            >
              <div className="image-icon">
                <img 
                  src={hoveredButton === item.id || activeButton === item.id ? item.activeImg : item.img} 
                />
              </div>
              <p className={`worker-menu-btn-item-title ${activeButton === item.id ? 'title-choose' : ''}`}>{item.title}</p>
            </div>
          </div>
        ))}
        </div>
    </div>
  )
}

export default WorkerMenu