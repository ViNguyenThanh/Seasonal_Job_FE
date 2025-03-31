import React, { useEffect, useState } from 'react'
import './Slide.css'
import { Button, Col, ConfigProvider, Input, Rate, Row, Select } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

export default function Slide() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [locations, setLocations] = useState([]);

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
        <div className='slide-container'>
            <div className="slide_left">
                <div className="location-search">
                    <Select
                        prefix={<EnvironmentOutlined />}
                        size='large'
                        className='select-location'
                        showSearch
                        placeholder="Select a location"
                        optionFilterProp="label"
                        options={[
                            {
                                value: 'jack',
                                label: 'Jack',
                            },
                            {
                                value: 'lucy',
                                label: 'Lucy',
                            },
                            {
                                value: 'tom',
                                label: 'Tom',
                            },
                        ]}
                    />
                    <Input size='large' allowClear prefix={<SearchOutlined />} placeholder="Search" className="search-input" />
                    <Button size='large' className="search-btn">Search</Button>
                </div>
                <div className="company-spotlight">
                    <div className="company-spotlight-img">
                        <img src="/assets/background_colour.jpg" alt="" />
                    </div>
                    <div className="company-spotlight-info">
                        {screenWidth < 1100 ? (
                            <h3>TAM VIET INTERNATIONAL INVESTMENT & TRADING JOINT STOCK COMPANY</h3> // Thay h2 bằng h4 khi màn hình nhỏ
                        ) : (
                            <h2>TAM VIET INTERNATIONAL INVESTMENT & TRADING JOINT STOCK COMPANY</h2>
                        )}
                        <div className='company-spotlight-info-location'>
                            <Link><EnvironmentOutlined/> Ho Chi Minh</Link>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Rate: {
                                            starSize: screenWidth < 1100 ? 10 : 20,
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
                            <Link>12 công việc <DownOutlined /></Link>
                        </div>
                        <p>Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services</p>
                    </div>
                </div>
            </div>
            <div className="slide_right">
                <div className="today_dashboard">
                    <p>Today: <b>19/2/2025</b></p>
                    <p>Total Job: <b>100+</b> | Today new jobs: <b>10</b></p>
                </div>
                <div className="image_background">
                    <img src="/assets/background_home.png" alt="" />
                </div>
            </div>
        </div>
    )
}
