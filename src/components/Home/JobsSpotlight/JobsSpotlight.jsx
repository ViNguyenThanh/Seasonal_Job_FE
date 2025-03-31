import React, { useEffect, useState } from 'react'
import './JobsSpotlight.css'
import { Button, ConfigProvider } from 'antd'
import { DownOutlined, EnvironmentOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';

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

export default function JobsSpotlight() {
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
        <div className='jobs-spotlight-container'>
            <div className="jobs-spotlight-info">
                <div className="jobs-spotlight-header">
                    <p>Jobs <span>Spotlight</span></p>
                </div>
                <div className="jobs-spotlight-content">
                    <div className="jobs-spotlight-items">
                        {data.map((item, index) => (
                            index == 8 && screenWidth < 1170 ? null :
                                <div key={index} className="job-list-spotlight">
                                    <div className="job-list-spotlight-img">
                                        <img src="/assets/background_colour.jpg" alt="" />
                                    </div>
                                    <div className="job-list-spotlight-info">
                                        <h3>Ticket checker for Spring Fair 2025 - VIFA EXPO</h3>
                                        <div className='job-list-spotlight-info-location'>
                                            <p><EnvironmentOutlined /> Ho Chi Minh</p>
                                            <p><DollarOutlined /> 4.000.000</p>
                                            <p><CalendarOutlined /> 7 days</p>
                                        </div>
                                        <p>Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services</p>
                                    </div>
                                </div>
                        ))}
                    </div>
                    <div className="jobs-spotlight-btn">
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
