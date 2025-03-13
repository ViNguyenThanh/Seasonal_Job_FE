// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './FindingJob.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Select, Space, Button, Flex, Modal, Checkbox, Radio, Card, Tag } from "antd";
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined, DollarOutlined, CalendarOutlined, BookOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col, Pagination } from 'antd';

const { Option } = Select;

const FindingJob = () => {
    const [jobData, setJobData] = useState([
        {
            title: "Marketing Manager",
            duration: "1 month",
            location: "New Mexico, USA",
            salary: "50k-80k/month",
            remaining: "4 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            title: "Software Engineer",
            duration: "2 weeks",
            location: "California, USA",
            salary: "70k-100k/month",
            remaining: "10 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            title: "Product Manager",
            duration: "3 weeks",
            location: "Texas, USA",
            salary: "60k-90k/month",
            remaining: "7 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            title: "Data Scientist",
            duration: "1 month",
            location: "New York, USA",
            salary: "80k-120k/month",
            remaining: "5 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            title: "UX Designer",
            duration: "1 weeks",
            location: "Florida, USA",
            salary: "50k-70k/month",
            remaining: "3 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            title: "DevOps Engineer",
            duration: "1 month",
            location: "Washington, USA",
            salary: "90k-130k/month",
            remaining: "8 Days Remaining",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFilterChange = () => {
        setIsFiltered(true);
    };

    const handleSaveClick = (index) => {
        const newJobData = [...jobData];
        newJobData[index].isSaved = !newJobData[index].isSaved;
        setJobData(newJobData);
    };

    return (
        <div className='finding-job-whole-container'>
            <Header />

            <div className="finding-job-container">
                <div className="search-filter-layer1">
                    <p className="ebc-p">Find Jobs</p>
                    <div className="search-filter-layer2">
                        <Space.Compact size="large" className="custom-space-compact">
                            <Select
                                showSearch
                                placeholder="Job title, Keyword..."
                                prefix={<SearchOutlined className="custom-icon" />}
                                style={{
                                    width: '90%',
                                    height: '50px',
                                }}
                            >
                                <Option value="job1">Job 1</Option>
                                <Option value="job2">Job 2</Option>
                            </Select>
                            <Select
                                showSearch
                                placeholder="Location"
                                prefix={<EnvironmentOutlined className="custom-icon" />}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                            >
                                <Option value="location1">Location 1</Option>
                                <Option value="location2">Location 2</Option>
                            </Select>
                            <Select
                                showSearch
                                placeholder="Select Category"
                                prefix={<ContainerOutlined className="custom-icon" />}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                            >
                                <Option value="category1">Category 1</Option>
                                <Option value="category2">Category 2</Option>
                            </Select>

                            <Select
                                placeholder=""
                                prefix={<span style={{ color: isFiltered ? 'blue' : 'inherit' }}>Advance Filter</span>}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                                open={false}
                                onClick={showModal}
                            >
                            </Select>

                            <Modal
                                title=" "
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                width={900}
                            >
                                <div className="modal-content">
                                    <div className="modal-section">
                                        <h3>Experience</h3>
                                        <Radio.Group style={{ fontSize: '18px', lineHeight: '2.5' }} onChange={handleFilterChange}>
                                            <Radio value={1} style={{ fontSize: '18px' }}>0-1 years</Radio>
                                            <Radio value={2} style={{ fontSize: '18px' }}>1-2 years</Radio>
                                            <Radio value={3} style={{ fontSize: '18px' }}>2-3 years</Radio>
                                            <Radio value={4} style={{ fontSize: '18px' }}>3-4 years</Radio>
                                            <Radio value={5} style={{ fontSize: '18px' }}>4-5 years</Radio>
                                            <Radio value={6} style={{ fontSize: '18px' }}>5-6 years</Radio>
                                            <Radio value={7} style={{ fontSize: '18px' }}>6-7 years</Radio>
                                            <Radio value={8} style={{ fontSize: '18px' }}>7+ years</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="modal-section">
                                        <h3>Salary</h3>
                                        <Radio.Group style={{ fontSize: '18px', lineHeight: '2.5' }} onChange={handleFilterChange}>
                                            <Radio value={1} style={{ fontSize: '18px' }}>$50 - $1000</Radio>
                                            <Radio value={2} style={{ fontSize: '18px' }}>$1000 - $2000</Radio>
                                            <Radio value={3} style={{ fontSize: '18px' }}>$3000 - $4000</Radio>
                                            <Radio value={4} style={{ fontSize: '18px' }}>$4000 - $6000</Radio>
                                            <Radio value={5} style={{ fontSize: '18px' }}>$6000 - $8000</Radio>
                                            <Radio value={6} style={{ fontSize: '18px' }}>$8000 - $10000</Radio>
                                            <Radio value={7} style={{ fontSize: '18px' }}>$10000 - $15000</Radio>
                                            <Radio value={8} style={{ fontSize: '18px' }}>$15000+</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="modal-section">
                                        <h3>Job Type</h3>
                                        <Checkbox.Group onChange={handleFilterChange}>
                                            <Checkbox value="full-time" style={{ fontSize: '18px', lineHeight: '2.5' }}>Full-time</Checkbox>
                                            <Checkbox value="part-time" style={{ fontSize: '18px', lineHeight: '2.5' }}>Part-time</Checkbox>
                                            <Checkbox value="contract" style={{ fontSize: '18px', lineHeight: '2.5' }}>Contract</Checkbox>
                                            <Checkbox value="temporary" style={{ fontSize: '18px', lineHeight: '2.5' }}>Temporary</Checkbox>
                                            <Checkbox value="internship" style={{ fontSize: '18px', lineHeight: '2.5' }}>Internship</Checkbox>
                                            <Checkbox value="volunteer" style={{ fontSize: '18px', lineHeight: '2.5' }}>Volunteer</Checkbox>
                                            <Checkbox value="freelance" style={{ fontSize: '18px', lineHeight: '2.5' }}>Freelance</Checkbox>
                                        </Checkbox.Group>
                                    </div>
                                    <div className="modal-section">
                                        <h3>Education</h3>
                                        <Checkbox.Group onChange={handleFilterChange}>
                                            <Checkbox value="other" style={{ fontSize: '18px', lineHeight: '2.5' }}>All</Checkbox>
                                            <Checkbox value="high-school" style={{ fontSize: '18px', lineHeight: '2.5' }}>High School</Checkbox>
                                            <Checkbox value="associate" style={{ fontSize: '18px', lineHeight: '2.5' }}>Intermediate</Checkbox>
                                            <Checkbox value="doctorate" style={{ fontSize: '18px', lineHeight: '2.5' }}>Graduation</Checkbox>
                                            <Checkbox value="bachelor" style={{ fontSize: '18px', lineHeight: '2.5' }}>Bachelor Degree</Checkbox>
                                            <Checkbox value="master" style={{ fontSize: '18px', lineHeight: '2.5' }}>Master Degree</Checkbox>
                                        </Checkbox.Group>
                                    </div>
                                    <div className="modal-section">
                                        <h3>Job Level</h3>
                                        <Radio.Group style={{ fontSize: '18px', lineHeight: '2.5' }} onChange={handleFilterChange}>
                                            <Radio value={1} style={{ fontSize: '18px' }}>Entry Level</Radio>
                                            <Radio value={2} style={{ fontSize: '18px' }}>Mid Level</Radio>
                                            <Radio value={3} style={{ fontSize: '18px' }}>Senior Level</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>
                            </Modal>

                            <Flex gap="small" wrap>
                                <Button type="primary" style={{
                                    height: '50px'
                                }}>Find Job</Button>
                            </Flex>
                        </Space.Compact>
                    </div>
                </div>

                <Row justify="end" align="middle" style={{ marginTop: '30px' }}>
                    <Col>
                        <Select
                            defaultValue="Latest"
                            className="sort-select"
                            style={{
                                width: 120,
                                marginRight: '10px',
                                border: '1px solid gray',
                                borderRadius: '5px',
                            }}
                            options={[
                                {
                                    value: 'latest',
                                    label: 'Latest',
                                },
                                {
                                    value: 'oldest',
                                    label: 'Oldest',
                                },
                            ]}
                        />
                        <Select
                            defaultValue="12 per page"
                            style={{
                                width: 120,
                                border: '1px solid gray',
                                borderRadius: '5px',
                                marginRight: '30px',
                            }}
                            options={[
                                {
                                    value: '12perpage',
                                    label: '12 per page',
                                },
                                {
                                    value: '24perpage',
                                    label: '24 per page',
                                },
                            ]}
                        />
                    </Col>
                </Row>

                {jobData.map((job, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            style={{
                                width: '96%',
                                marginTop: 20,
                            }}
                        >
                            <Card.Meta
                                title={
                                    <div className="job-card-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>{job.title}</span>
                                        <Tag color="blue">{job.duration}</Tag>
                                    </div>
                                }
                                description={
                                    <>
                                        <div className="job-card-description" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '21px' }}>
                                                <span><EnvironmentOutlined /> {job.location}</span>
                                                <span><DollarOutlined /> {job.salary}</span>
                                                <span><CalendarOutlined /> {job.remaining}</span>
                                            </div>
                                            <div className="job-card-buttons" style={{ display: 'flex', gap: '10px', marginRight: '10px' }}>
                                                <Button
                                                    type={job.isSaved ? 'primary' : 'default'}
                                                    shape="rectangle"
                                                    style={{ height: '40px' }}
                                                    onClick={() => handleSaveClick(index)}
                                                >
                                                    <BookOutlined />
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    className="apply-now-button"
                                                    style={{ height: '40px' }}
                                                >
                                                    Apply now <ArrowRightOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                }
                                avatar={<img alt="example" src={job.avatar} style={{ width: '100px', height: '100px', borderRadius: '5px' }} />}
                            />
                        </Card>
                    </div>
                ))}

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <Pagination defaultCurrent={1} total={50} />
            </div>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
};

export default FindingJob;