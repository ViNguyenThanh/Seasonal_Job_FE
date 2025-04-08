/* eslint-disable no-dupe-keys */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './FindingJob.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Select, Space, Button, Flex, Modal, Checkbox, Radio, Card, Tag } from "antd";
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined, DollarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col, Pagination, Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../apis/job.request'; // Import the jobApi
import { useEffect } from 'react';

const { Option } = Select;

const FindingJob = () => {
    const [jobData, setJobData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);

    // Fetch all jobs when the component loads
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobApi.getAllJobs(); // Call the API
                if (Array.isArray(response.data.data)) { // Access the nested 'data' property
                    setJobData(response.data.data); // Extract the array of jobs
                } else {
                    console.error('Unexpected API response format:', response);
                    setJobData([]); // Fallback to an empty array
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setJobData([]); // Fallback to an empty array
            }
        };

        fetchJobs();
    }, []);

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

    // const handleSaveClick = (index) => {
    //     const newJobData = [...jobData];
    //     newJobData[index].isSaved = !newJobData[index].isSaved;
    //     setJobData(newJobData);
    // };

    const navigate = useNavigate();

    return (
        <div className='finding-job-whole-container'>
            <Header />

            <div className="finding-job-container">
                <div className="search-filter-layer1">
                    <div className="header-title">
                        <p className="ebc-p">Find Jobs</p>
                        <Breadcrumb
                            className="breadcrumb"
                            items={[
                                {
                                    title: <a href="/">Home</a>,
                                },
                                {
                                    title: 'Find Jobs',
                                },
                            ]}
                        />
                    </div>
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
                                    height: '50px', borderRadius: '5px', width: '100%'
                                }}>Find Job</Button>
                            </Flex>
                        </Space.Compact>
                    </div>
                </div>

                <Row justify="end" align="middle" style={{ marginTop: '30px', marginRight: '39px' }}>
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


                {Array.isArray(jobData) && jobData.map((job, index) => (
                    <div key={job.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            style={{
                                width: '100%',
                                marginTop: 30,
                                marginLeft: 50,
                                marginRight: 50,
                            }}
                        >
                            <Card.Meta
                                title={
                                    <div className="job-card-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span>{job.title}</span>
                                        <Tag color="blue">
                                            {(() => {
                                                const startDate = new Date(job.started_date);
                                                const endDate = new Date(job.end_date);
                                                const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate duration in days
                                                return `${durationInDays} days`; // Display duration
                                            })()}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <>
                                        <div className="job-card-description" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row-reverse' }}>
                                                <span>
                                                    <DollarOutlined /> {new Intl.NumberFormat('vi-VN').format(job.salary)} VND
                                                </span>
                                                {/* <span><CalendarOutlined /> Expiry: {new Date(job.expired_date).toLocaleDateString()}</span> */}
                                                <span><EnvironmentOutlined /> {job.location}</span>
                                            </div>
                                            <div className="job-card-buttons" style={{ display: 'flex', gap: '10px', marginRight: '10px' }}>
                                                {/* <Button
                                                    type={job.isSaved ? 'primary' : 'default'}
                                                    shape="rectangle"
                                                    style={{ height: '40px' }}
                                                    onClick={() => handleSaveClick(index)}
                                                    className="save-button"
                                                >
                                                    <BookOutlined />
                                                </Button> */}
                                                <Button
                                                    type="primary"
                                                    className="apply-now-button"
                                                    style={{ height: '40px' }}
                                                    onClick={() => {
                                                        navigate(`/job-detail-view/${job.id}`);
                                                        window.scrollTo(0, 0);
                                                    }}
                                                >
                                                    Apply now <ArrowRightOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                }
                                avatar={<img alt="example" src={"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"} style={{ width: '100px', height: '100px', borderRadius: '5px' }} />}
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