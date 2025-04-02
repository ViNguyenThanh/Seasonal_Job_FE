/* eslint-disable no-unused-vars */
import React from 'react'
import './EmployerHome.css'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { Typography, Button } from 'antd';
const { Title, Paragraph } = Typography;

const EmployerHome = () => {
    return (
        <div className='employer-home-whole-container'>
            <Header />
            <div className="employer-home-container">

                <div className="employer-home-first-section">
                    <div>
                        <Title level={1} style={{ color: '#023b5f', fontSize: '60px', fontWeight: 'bold' }}>
                            Hire Short-Term<br></br>Workers
                        </Title>
                        <Paragraph style={{ fontSize: '25px' }}>
                            Find qualified candidates for temporary <br></br> and seasonal positions with ease.<br></br>
                            Our platform connects you with workers<br></br> quickly and efficiently, helping you meet<br></br> your staffing needs without the hassle.
                        </Paragraph>
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{ width: '200px', height: '55px', fontSize: '25px', fontWeight: '500', padding: '10px 20px' }}
                            >
                                Post a Job
                            </Button>
                        </div>
                    </div>
                    <div>
                        <img
                            className="employer-home-image1"
                            src="../assets/Work-On-Computer.png"
                        />
                    </div>
                </div>

                <div className="employer-home-second-section">
                    <Title level={1} style={{ color: '#023b5f', fontSize: '50px', fontWeight: '700' }}>
                        Lý do lựa chọn SJCP
                    </Title>
                    <Paragraph style={{ fontSize: '25px' }}>
                        Các lợi ích khi sử dụng trang web:
                    </Paragraph>

                </div>
            </div>
            <div style={{ height: '500px' }}></div>
            <Footer />
        </div>
    )
}

export default EmployerHome