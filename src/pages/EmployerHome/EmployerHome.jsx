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
                <div>
                    <Title level={1} style={{ color: '#023b5f', fontSize: '65px', fontWeight: 'bold', marginLeft: '2%' }}>
                        Hire Short-Term<br></br>Workers
                    </Title>
                    <Paragraph style={{ fontSize: '30px', marginLeft: '2%' }}>
                        Find qualified candidates for temporary <br></br> and seasonal positions with ease.<br></br>
                        Our platform connects you with workers<br></br> quickly and efficiently, helping you meet<br></br> your staffing needs without the hassle.
                    </Paragraph>
                    <div style={{ marginLeft: '2%', marginTop: '20px' }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{ width: '250px', height: '60px', fontSize: '30px', fontWeight: '500', padding: '10px 20px' }}
                        >
                            Post a Job
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default EmployerHome