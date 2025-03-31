import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Rate } from 'antd'
import { DownOutlined, EnvironmentOutlined, DollarOutlined, FileSearchOutlined } from '@ant-design/icons';
import './CompanySpotlight.css'

const data = [
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  },
  {
    title: 'Ticket checker for Spring Fair 2025 - VIFA EXPO',
    location: 'Ho Chi Minh',
    salary: '4.000.000',
    duration: '7 days',
    description: 'Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services',
    imgSrc: 'https://via.placeholder.com/150'
  }
];

export default function CompanySpotlight() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Thêm sự kiện resize để theo dõi thay đổi kích thước màn hình
    window.addEventListener('resize', handleResize);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='company-spotlight-container'>
      <div className="companies-spotlight-info">
        <div className="companies-spotlight-header">
          <p>Companies <span>Spotlight</span></p>
        </div>
        <div className="companies-spotlight-content">
          <div className="companies-spotlight-items">
            {data.map((item, index) => (
              index == 8 && screenWidth < 1170 ? null :
                <div key={index} className="company-list-spotlight">
                  <div className="company-list-spotlight-img">
                    <img src="/assets/background_colour.jpg" alt="" />
                  </div>
                  <div className="company-list-spotlight-info">
                    <h3>Ticket checker for Spring Fair 2025 - VIFA EXPO</h3>
                    <div className='company-list-spotlight-info-location'>
                      <p><EnvironmentOutlined /> Ho Chi Minh</p>
                      <ConfigProvider
                        theme={{
                          components: {
                            Rate: {
                              starSize: 10,
                              starBg: '#B0B7BD',
                            },
                          },
                          token: {
                            marginXS: 3
                          }
                        }}
                      >
                        <Rate style={{ height: 'fit-content'}} disabled defaultValue={2} />
                      </ConfigProvider>
                      <p><FileSearchOutlined /> 7 jobs</p>
                    </div>
                    <p>Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services</p>
                  </div>
                </div>
            ))}
          </div>
          <div className="companies-spotlight-btn">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBorderColor: 'var(--btn-primary-color)',
                    defaultColor: 'var(--btn-primary-color)',
                    defaultHoverBg: 'var(--btn-primary-color)',
                    defaultHoverColor: 'white',
                  }
                },
                token: { fontSize: 20 }
              }
              }>
              <Button icon={<DownOutlined />} size='large'>View All</Button>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
