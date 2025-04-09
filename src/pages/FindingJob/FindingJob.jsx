/* eslint-disable no-dupe-keys */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './FindingJob.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Select, Space, Button, Flex, Modal, Checkbox, Radio, Card, Tag } from "antd";
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined, DollarOutlined, ArrowRightOutlined, ReloadOutlined, StarOutlined } from '@ant-design/icons';
import { Row, Col, Pagination, Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../apis/job.request'; // Import the jobApi
import { useEffect } from 'react';

const { Option } = Select;

const FindingJob = () => {
    const [jobData, setJobData] = useState([]);
    const [allJobs, setAllJobs] = useState([]); // Original list of all jobs
    const [selectedMinStarRequirement, setSelectedMinStarRequirement] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState(allJobs); // State to manage filtered jobs


    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [jobsPerPage, setJobsPerPage] = useState(12); // State to track the number of jobs per page

    // Calculate the jobs to display based on the current page and jobs per page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobData.slice(indexOfFirstJob, indexOfLastJob);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);

    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Fetch all jobs when the component loads
    const fetchJobs = async () => {
        try {
            const response = await jobApi.getAllJobs(); // Call the API
            if (Array.isArray(response.data.data)) {
                setAllJobs(response.data.data); // Store the original list of jobs
                setJobData(response.data.data); // Initialize the filtered list
            } else {
                console.error('Unexpected API response format:', response);
                setAllJobs([]); // Fallback to an empty array
                setJobData([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setAllJobs([]); // Fallback to an empty array
            setJobData([]); // Fallback to an empty array
        }
    };

    useEffect(() => {
        fetchJobs(); // Fetch all jobs when the component loads
    }, []);

    // const showModal = () => {
    //     setIsModalOpen(true);
    // };

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
                                onSearch={(value) => {
                                    if (!value.trim()) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if input is empty
                                    } else {
                                        const filtered = allJobs.filter((job) =>
                                            job.title.toLowerCase().includes(value.toLowerCase())
                                        );
                                        setFilteredJobs(filtered); // Update the filtered jobs
                                    }
                                }}
                                value={selectedTitle} // Bind state
                                onChange={(value) => {
                                    setSelectedTitle(value); // Update state
                                    if (!value) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if no value is selected
                                    } else {
                                        const selectedJobs = allJobs.filter((job) => job.title === value);
                                        setJobData(selectedJobs); // Display all jobs with the selected title
                                    }
                                }}
                                filterOption={false} // Disable default filtering to rely on custom logic
                            >
                                {[...new Set(filteredJobs.map((job) => job.title))].map((title, index) => (
                                    <Option key={index} value={title}>
                                        {title}
                                    </Option>
                                ))}
                            </Select>

                            <Select
                                showSearch
                                placeholder="Location"
                                prefix={<EnvironmentOutlined className="custom-icon" />}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                                onSearch={(value) => {
                                    if (!value.trim()) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if input is empty
                                    } else {
                                        const filtered = allJobs.filter((job) =>
                                            job.location.toLowerCase().includes(value.toLowerCase())
                                        );
                                        setFilteredJobs(filtered); // Update the filtered jobs
                                    }
                                }}
                                value={selectedLocation} // Bind state
                                onChange={(value) => {
                                    setSelectedLocation(value); // Update state
                                    if (!value) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if no value is selected
                                    } else {
                                        const selectedJobs = allJobs.filter((job) => job.location === value);
                                        setJobData(selectedJobs); // Display all jobs with the selected location
                                    }
                                }}
                                filterOption={false} // Disable default filtering to rely on custom logic
                            >
                                {[...new Set(filteredJobs.map((job) => job.location))].map((location, index) => (
                                    <Option key={index} value={location}>
                                        {location}
                                    </Option>
                                ))}
                            </Select>

                            <Select
                                showSearch
                                placeholder="Minimum Star Requirement"
                                prefix={<StarOutlined className="custom-icon" />}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                                onSearch={(value) => {
                                    if (!value.trim()) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if input is empty
                                    } else {
                                        const filtered = allJobs.filter((job) =>
                                            job.min_star_requirement.toString().includes(value)
                                        );
                                        setFilteredJobs(filtered); // Update the filtered jobs
                                    }
                                }}
                                value={selectedMinStarRequirement} // Bind state
                                onChange={(value) => {
                                    setSelectedMinStarRequirement(value); // Update state
                                    if (!value) {
                                        setFilteredJobs(allJobs); // Reset to all jobs if no value is selected
                                    } else {
                                        const selectedJobs = allJobs.filter(
                                            (job) => job.min_star_requirement.toString() === value
                                        );
                                        setJobData(selectedJobs); // Display all jobs with the selected min_star_requirement
                                    }
                                }}
                                filterOption={false} // Disable default filtering to rely on custom logic
                            >
                                {[...new Set(filteredJobs.map((job) => job.min_star_requirement))].map((minStar, index) => (
                                    <Option key={index} value={minStar.toString()}>
                                        {minStar}
                                    </Option>
                                ))}
                            </Select>

                            {/* <Select
                                placeholder=""
                                prefix={<span style={{ color: isFiltered ? 'blue' : 'inherit' }}>Advance Filter</span>}
                                style={{
                                    width: '60%',
                                    height: '50px',
                                }}
                                open={false}
                                onClick={showModal}
                            >
                            </Select> */}

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
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />} // Add the reset icon
                                    style={{
                                        height: '50px',
                                        borderRadius: '5px',
                                        width: '100%'
                                    }}
                                    onClick={() => {
                                        setJobData(allJobs); // Reset the job data to show all jobs
                                        setSelectedTitle(null); // Clear the job title input
                                        setSelectedLocation(null); // Clear the location input
                                        setSelectedMinStarRequirement(null); // Clear the min star requirement input
                                    }}
                                >
                                    Reset
                                </Button>
                            </Flex>
                        </Space.Compact>
                    </div>
                </div>

                <Row justify="end" align="middle" style={{ marginTop: '30px', marginRight: '39px' }}>
                    <Col>
                        <Select
                            defaultValue="latest"
                            className="sort-select"
                            style={{
                                width: 120,
                                marginRight: '10px',
                                border: '1px solid gray',
                                borderRadius: '5px',
                            }}
                            onChange={(value) => {
                                const sortedJobs = [...jobData].sort((a, b) => {
                                    const dateA = new Date(a.updatedAt);
                                    const dateB = new Date(b.updatedAt);
                                    return value === 'latest' ? dateB - dateA : dateA - dateB; // Sort by latest or oldest
                                });
                                setJobData(sortedJobs); // Update the job data with the sorted list
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
                            onChange={(value) => {
                                const jobsPerPageValue = value === '12perpage' ? 12 : 24; // Determine jobs per page
                                setJobsPerPage(jobsPerPageValue); // Update the jobs per page
                                setCurrentPage(1); // Reset to the first page
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

                {Array.isArray(currentJobs) && currentJobs.map((job, index) => (
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
                                        <Tag color="yellow" style={{marginLeft: '-10px'}}>
                                            {job.min_star_requirement} <StarOutlined />
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
                                                <span><EnvironmentOutlined /> {job.location}</span>
                                                <span>
                                                    <ContainerOutlined /> {new Date(job.updatedAt).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="job-card-buttons" style={{ display: 'flex', gap: '10px', marginRight: '10px' }}>
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
                <Pagination
                    current={currentPage} // Bind the current page
                    total={jobData.length} // Total number of jobs
                    pageSize={jobsPerPage} // Number of jobs per page
                    onChange={(page) => setCurrentPage(page)} // Update the current page
                />
            </div>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
};

export default FindingJob;