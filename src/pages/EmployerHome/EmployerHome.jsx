/* eslint-disable no-unused-vars */
import React from 'react'
import './EmployerHome.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader';
import Footer from '../../components/Footer/Footer'
import { Typography, Button, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;

const EmployerHome = () => {
    return (
        <div className='employer-home-whole-container'>
            <EmployerHeader />
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
                    <div style={{ marginLeft: '6em'}}>
                        <Title level={1} style={{ color: '#023b5f', fontSize: '50px', fontWeight: '700' }}>
                            Lý do lựa chọn SJCP
                        </Title>
                        <Paragraph style={{ fontSize: '25px' }}>
                            Các lợi ích khi sử dụng trang web
                        </Paragraph>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-13em' }}>
                        <div className="employer-home-reason-container">
                            <Row gutter={[16, 16]} justify="center">
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image2"
                                            src="../assets/laptop.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600', margin: 0 }}>
                                            Giao diện <br></br>dễ sử dụng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image3"
                                            src="../assets/customer-service.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Hỗ trợ <br></br>nhanh chóng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image4"
                                            src="../assets/shield.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Đảm bảo <br></br>chất lượng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image5"
                                            src="../assets/flexible.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Linh hoạt <br></br>và tiện lợi
                                        </Paragraph>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <img
                                className="employer-home-image6"
                                src="../assets/Introducing-Man.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '2000px' }}></div>
            <Footer />
        </div>
    )
}

export default EmployerHome