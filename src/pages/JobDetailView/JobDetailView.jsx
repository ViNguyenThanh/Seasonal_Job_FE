// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./JobDetailView.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Breadcrumb, Avatar, Tag, Button, Space, Row, Col } from 'antd';
import { AntDesignOutlined, LinkOutlined, PhoneOutlined, MailOutlined, BookOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;
import { FacebookOutlined, InstagramOutlined, CalendarOutlined, ClockCircleOutlined, SolutionOutlined, WalletOutlined, EnvironmentOutlined, FileProtectOutlined, HistoryOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';

const JobDetailView = () => {
    const [isSaved, setIsSaved] = useState(false); // State to track saved status

    const toggleSaveStatus = () => {
        setIsSaved(!isSaved); // Toggle the saved status
    };

    return (
        <div className='job-detail-view-whole-container'>
            <Header />
            <div className="job-detail-view-container">

                <div style={{ height: '50px' }}></div>

                <div className="breadcrumb">
                    <Breadcrumb
                        items={[
                            {
                                title: <a href="/">Home</a>,
                            },
                            {
                                title: <a href="/finding-job">Find Jobs</a>,
                            },
                            {
                                title: 'Job Detail',
                            }
                        ]}
                    />
                </div>

                <div style={{ height: '30px' }}></div>

                <div className="job-detail-header">
                    <div className="job-detail-avatar-section">
                        <Avatar
                            style={{ width: '100px', height: '100px' }}
                            icon={<AntDesignOutlined />}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <div className="job-detail-title-section">
                                <Title level={2} style={{ fontWeight: 'bold', margin: 0 }}>UX Designer</Title>
                                <Tag className="job-tag" color="blue">1 weeks</Tag>
                            </div>

                            <div className="job-detail-info-section">
                                <p className="ebc-p-info"><LinkOutlined style={{ color: '#1DA1F2' }} /> https://instagram.com</p>
                                <p className="ebc-p-info"><PhoneOutlined style={{ color: '#1DA1F2', transform: 'scaleX(-1)' }} /> (406) 555-0120</p>
                                <p className="ebc-p-info"><MailOutlined style={{ color: '#1DA1F2' }} /> career@instagram.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="job-detail-action-section">
                        <div className="job-detail-buttons">
                            <Button
                                type={isSaved ? "primary" : "default"} // Change button type based on isSaved
                                shape="rectangle"
                                className="bookmark-button"
                                onClick={toggleSaveStatus} // Handle click to toggle status
                            >
                                <BookOutlined />
                            </Button>

                            <Button
                                type="primary"
                                className="apply-now-button"
                            >
                                Apply now <ArrowRightOutlined />
                            </Button>
                        </div>
                        <p className="job-expiry-info">
                            Job expire in:<span className="job-expiry-date">June 30, 2021</span>
                        </p>
                    </div>
                </div>
                <Row >
                    <Col xs={24} sm={24} md={12}>
                        <div className="job-description-leftSide">

                            <Typography className="job-description-leftSide-typography">
                                <Title level={3} className="job-description-leftSide-title">Job Description</Title>
                                <Paragraph>
                                    Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.
                                </Paragraph>

                                <Paragraph>
                                    Nam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.
                                </Paragraph>

                            </Typography>

                            <Typography className="job-description-leftSide-typography">
                                <Title level={3} className="job-description-leftSide-title">Responsibilities</Title>

                                <Paragraph>
                                    <ul className="responsibilities-list">
                                        <li>
                                            <Paragraph>
                                                Quisque semper gravida est et consectetur.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                Curabitur blandit lorem velit, vitae pretium leo placerat eget.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                Morbi mattis in ipsum ac tempus.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                lobortis vel lectus. Nulla at risus ut diam.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                odio metus posuere lorem, id condimentum erat velit nec neque.
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph>
                                                dui sodales ut. Curabitur tempus augue.
                                            </Paragraph>
                                        </li>
                                    </ul>
                                </Paragraph>
                            </Typography>

                            <div className="share-this-job desktop-n-tablet-only">
                                <Title level={4} style={{ margin: 0 }}>Share this job:</Title>
                                <div className="social-media-buttons">
                                    <Button
                                        type="default"
                                        className="facebook-button"
                                        icon={<FacebookOutlined style={{ fontSize: '20px', marginTop: '2px' }} />} // Bigger icon
                                    >
                                        Facebook
                                    </Button>
                                    <Button
                                        type="default"
                                        className="instagram-button"
                                        icon={<InstagramOutlined style={{ fontSize: '20px', marginTop: '2px' }} />} // Bigger icon
                                    >
                                        Instagram
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                        <div className="job-description-rightSide">
                            <div className="job-overview">
                                <Space.Compact size="large" className="custom-space-compact">
                                    <Paragraph>
                                        <Title level={3} className="job-overview-title">Job Overview</Title>
                                        <Row gutter={[16, 16]} className="job-overview-grid">
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <CalendarOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    JOB POSTED:<br />
                                                    <span className="job-overview-highlight">14 June, 2021</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <ClockCircleOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    JOB EXPIRE IN:<br />
                                                    <span className="job-overview-highlight">June 30, 2021</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <SolutionOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    EDUCATION:<br />
                                                    <span className="job-overview-highlight">Graduation</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <WalletOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    SALARY:<br />
                                                    <span className="job-overview-highlight">$50k-80k/month</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <EnvironmentOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    LOCATION:<br />
                                                    <span className="job-overview-highlight">New York, USA</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <FileProtectOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    JOB TYPE:<br />
                                                    <span className="job-overview-highlight">Full Time</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <HistoryOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    EXPERIENCE:<br />
                                                    <span className="job-overview-highlight">10 - 15 Years</span>
                                                </Paragraph>
                                            </Col>
                                        </Row>
                                    </Paragraph>
                                </Space.Compact>
                            </div>

                            <div className="job-others-info">
                                <div className="job-avatar-container">
                                    <img
                                        alt="example"
                                        src={"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                                        className="job-image"
                                    />
                                    <div className="job-avatar-text">
                                        <Title level={3}>Instagram</Title>
                                        <Paragraph style={{ color: 'grey' }}>Social networking service</Paragraph>
                                    </div>
                                </div>

                                <div className="job-anothers-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Founded in:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>March 21, 2006</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Organization type:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>Private Company</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Company size:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>120-300 Employers</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Phone:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>(406) 555-0120</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Email:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>twitter@gmail.com</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                                        <Paragraph style={{ color: 'grey' }}>Website:</Paragraph>
                                        <Paragraph style={{ color: 'black' }}>https://twitter.com</Paragraph>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                                        <Button
                                            type="primary"
                                            className="job-anothers-info-hover-button"
                                        >
                                            <FacebookOutlined />
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="job-anothers-info-hover-button"
                                        >
                                            <InstagramOutlined />
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="job-anothers-info-hover-button"
                                        >
                                            <TwitterOutlined />
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="job-anothers-info-hover-button"
                                        >
                                            <YoutubeOutlined />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="job-detail-action-section-mobile-only">
                                <div className="job-detail-buttons">
                                    <Button
                                        type={isSaved ? "primary" : "default"} // Change button type based on isSaved
                                        shape="rectangle"
                                        className="bookmark-button"
                                        onClick={toggleSaveStatus} // Handle click to toggle status
                                    >
                                        <BookOutlined />
                                    </Button>

                                    <Button
                                        type="primary"
                                        className="apply-now-button"
                                    >
                                        Apply now <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>

                            <div className="share-this-job-mobile-only">
                                <Title level={4} style={{ margin: 0 }}>Share this job:</Title>
                                <div className="social-media-buttons">
                                    <Button
                                        type="default"
                                        className="facebook-button"
                                        icon={<FacebookOutlined style={{ fontSize: '20px', marginTop: '2px' }} />} // Bigger icon
                                    >
                                        Facebook
                                    </Button>
                                    <Button
                                        type="default"
                                        className="instagram-button"
                                        icon={<InstagramOutlined style={{ fontSize: '20px', marginTop: '2px' }} />} // Bigger icon
                                    >
                                        Instagram
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
};

export default JobDetailView;