/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './FindingJob.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Select, Space, Button, Flex, Card, Tag, Empty, Spin } from "antd";
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined, DollarOutlined, ArrowRightOutlined, ReloadOutlined, StarOutlined, HomeOutlined } from '@ant-design/icons';
import { Row, Col, Pagination, Breadcrumb, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../apis/job.request'; // Import the jobApi
import { jobGroupApi } from '../../apis/job-group.request'; // Import jobGroupApi
import { useEffect } from 'react';
import { userApi } from '../../apis/user.request';

const { Option } = Select;

const FindingJob = () => {
    const [jobData, setJobData] = useState([]);
    const [allJobs, setAllJobs] = useState([]); // Original list of all jobs
    const [selectedMinStarRequirement, setSelectedMinStarRequirement] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState(allJobs); // State to manage filtered jobs
    const [loading, setLoading] = useState(true);


    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [jobsPerPage, setJobsPerPage] = useState(12); // State to track the number of jobs per page

    // Calculate the jobs to display based on the current page and jobs per page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobData.slice(indexOfFirstJob, indexOfLastJob);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isFiltered, setIsFiltered] = useState(false);

    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Fetch job postings by paid job groups when the component loads
    const fetchPaidJobPostings = async () => {
        setLoading(true);
        try {
            // Fetch inactive job groups
            const inactiveJobGroupsResponse = await jobGroupApi.getAllJobGroupsInactive();
            const inactiveJobGroups = inactiveJobGroupsResponse.data?.data || [];

            // Extract inactive job group IDs
            const inactiveJobGroupIds = inactiveJobGroups.map((group) => group.id);

            // Fetch job postings
            const jobPostingsResponse = await jobApi.getJobPostingsByJobGroupsIsPaid();
            const jobPostings = jobPostingsResponse.data?.data || [];

            // Filter job postings by inactive job group IDs
            const filteredJobs = jobPostings.filter((job) =>
                inactiveJobGroupIds.includes(job.jobGroupId)
            );

            // Sort the filtered jobs by the latest updated date
            const sortedJobs = filteredJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            // Fetch user details for each job and add avatar to the job data
            const jobsWithAvatars = await Promise.all(
                sortedJobs.map(async (job) => {
                    const userId = job.userId; // Assuming each job contains a `userId` field
                    if (userId) {
                        try {
                            const userResponse = await userApi.getUserById(userId);
                            const userAvatar = userResponse.data?.data?.avatar || null; // Fetch avatar from user details
                            return { ...job, avatar: userAvatar }; // Add avatar to job data
                        } catch (userError) {
                            console.error(`Error fetching user details for userId ${userId}:`, userError);
                            return { ...job, avatar: null }; // Fallback to null if error occurs
                        }
                    }
                    return { ...job, avatar: null }; // Fallback to null if no userId
                })
            );

            // Update state with the jobs including avatars
            setAllJobs(jobsWithAvatars);
            setJobData(jobsWithAvatars);
        } catch (error) {
            console.error('Error fetching paid job postings or inactive job groups:', error);
            setAllJobs([]); // Fallback to an empty array
            setJobData([]); // Fallback to an empty array
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchPaidJobPostings(); // Fetch paid job postings when the component loads
    }, []);

    const applyFilters = (title, location, minStar) => {
        let filtered = allJobs;

        if (title) {
            filtered = filtered.filter((job) =>
                job.title.toLowerCase().includes(title.toLowerCase())
            );
        }

        if (location) {
            filtered = filtered.filter((job) =>
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (minStar) {
            filtered = filtered.filter(
                (job) => job.min_star_requirement >= parseInt(minStar, 10) // Filter jobs with min_star_requirement >= selected value
            );
        }

        // Sort the filtered jobs by min_star_requirement in ascending order
        filtered = filtered.sort((a, b) => a.min_star_requirement - b.min_star_requirement);

        setFilteredJobs(filtered); // Update the filtered jobs
        setJobData(filtered); // Update the displayed jobs
    };

    // const showModal = () => {
    //     setIsModalOpen(true);
    // };

    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };

    // const handleCancel = () => {
    //     setIsModalOpen(false);
    // };

    // const handleFilterChange = () => {
    //     setIsFiltered(true);
    // };

    // const handleSaveClick = (index) => {
    //     const newJobData = [...jobData];
    //     newJobData[index].isSaved = !newJobData[index].isSaved;
    //     setJobData(newJobData);
    // };

    const navigate = useNavigate();

    return (
        <Spin spinning={loading} tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className='finding-job-whole-container'>
                <Header />

                <div className="finding-job-container">
                    <div className="search-filter-layer1">
                        <div className="header-title">
                            <p className="ebc-p">Find Jobs</p>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Breadcrumb: {
                                            fontSize: 18, // Increase font size for breadcrumb text
                                            iconFontSize: 20, // Increase icon size
                                        },
                                    },
                                }}
                            >
                                <Breadcrumb
                                    className="custom-breadcrumb"
                                    items={[
                                        {
                                            href: '/',
                                            title: (
                                                <span>
                                                    <HomeOutlined />
                                                    <span style={{ marginLeft: '5px' }}>Home</span>
                                                </span>
                                            ),
                                        },
                                        {
                                            href: '',
                                            title: (
                                                <span style={{ color: 'black' }}> {/* Highlight current page */}
                                                    <SearchOutlined />
                                                    <span style={{ marginLeft: '5px' }}>Find Jobs</span>
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </ConfigProvider>
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
                                        setSelectedTitle(value); // Update state with user input
                                        applyFilters(value, selectedLocation, selectedMinStarRequirement); // Apply cumulative filters
                                    }}
                                    value={selectedTitle} // Bind state
                                    onChange={(value) => {
                                        setSelectedTitle(value); // Update state
                                        applyFilters(value, selectedLocation, selectedMinStarRequirement); // Apply cumulative filters
                                    }}
                                    filterOption={false} // Disable default filtering to rely on custom logic
                                >
                                    {[...new Set(allJobs.map((job) => job.title))]
                                        .filter((title) => title.toLowerCase().includes(selectedTitle?.toLowerCase() || ''))
                                        .map((title, index) => (
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
                                        setSelectedLocation(value); // Update state
                                        applyFilters(selectedTitle, value, selectedMinStarRequirement); // Apply cumulative filters
                                    }}
                                    value={selectedLocation} // Bind state
                                    onChange={(value) => {
                                        setSelectedLocation(value); // Update state
                                        applyFilters(selectedTitle, value, selectedMinStarRequirement); // Apply cumulative filters
                                    }}
                                    filterOption={false} // Disable default filtering to rely on custom logic
                                >
                                    {[...new Set(allJobs.map((job) => job.location))].map((location, index) => (
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
                                        setSelectedMinStarRequirement(value); // Update state
                                        applyFilters(selectedTitle, selectedLocation, value); // Apply cumulative filters
                                    }}
                                    value={selectedMinStarRequirement} // Bind state
                                    onChange={(value) => {
                                        setSelectedMinStarRequirement(value); // Update state
                                        applyFilters(selectedTitle, selectedLocation, value); // Apply cumulative filters
                                    }}
                                    filterOption={false} // Disable default filtering to rely on custom logic
                                >
                                    {[...new Set(allJobs.map((job) => job.min_star_requirement))]
                                        .sort((a, b) => a - b) // Sort star requirements in ascending order
                                        .map((minStar, index) => (
                                            <Option key={index} value={minStar.toString()}>
                                                {minStar} <StarOutlined />
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

                                {/* <Modal
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
                            </Modal> */}

                                <Flex gap="small" wrap>
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />} // Add the reset icon
                                        style={{
                                            height: '50px',
                                            borderRadius: '5px',
                                            width: '100%',
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

                    {Array.isArray(currentJobs) && currentJobs.length > 0 ? (
                        currentJobs.map((job) => (
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
                                                <Tag color="yellow" style={{ marginLeft: '-10px' }}>
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
                                        avatar={
                                            <img
                                                alt="example"
                                                src={job.avatar || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                                                style={{ width: '100px', height: '100px', borderRadius: '5px' }}
                                            />
                                        }
                                    />
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                            <Empty description="No Data" />
                        </div>
                    )}

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
        </Spin>
    );
};

export default FindingJob;