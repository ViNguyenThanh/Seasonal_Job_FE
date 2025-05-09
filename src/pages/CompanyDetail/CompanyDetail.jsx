// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; // For extracting the ID from the URL
import { userApi } from "../../apis/user.request";
import { jobGroupApi } from "../../apis/job-group.request";
import { jobApi } from "../../apis/job.request";
import "./CompanyDetail.css";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Avatar, Button, Divider, Tag, Space, Tooltip, Rate } from 'antd';
import { ArrowRightOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, StarOutlined, CalendarOutlined, SolutionOutlined, FileProtectOutlined, UserOutlined } from '@ant-design/icons';
import { Typography, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;

const CompanyDetail = () => {
    const { id } = useParams(); // Extract the company ID from the URL
    const [userData, setUserData] = useState(null);
    const [jobGroups, setJobGroups] = useState([]);
    const [jobPostings, setJobPostings] = useState([]);
    const openPositionRef = useRef(null);
    const [companyDetails, setCompanyDetails] = useState(null); // State to store the company details

    // Calculate the filtered job count
    const filteredJobCount = jobPostings.filter((job) => {
        const startDate = new Date(job.started_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
        return startDate > today; // Exclude jobs where startDate is today or earlier
    }).length;

    useEffect(() => {
        // console.log("Company ID:", id); // Log the company ID in the console

        // Fetch user data by ID
        userApi.getPublicUserById(id)
            .then(response => {
                // console.log("User Data:", response.data); // Log the fetched user data
                setUserData(response.data.data); // Store the user data in state
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    useEffect(() => {
        if (userData) {
            // Fetch job groups related to the user
            jobGroupApi.getAllJobGroupsInactive()
                .then(response => {
                    // console.log("All Job Groups Data:", response.data); // Log all fetched job groups data
                    const filteredJobs = response.data.data.filter(
                        job => job.userId === userData.id && job.isPaid === true // Filter jobs by userId and isPaid
                    );
                    // console.log("Filtered Job Groups Data (isPaid: true):", filteredJobs); // Log the filtered job groups data
                    setJobGroups(filteredJobs); // Store the filtered job groups in state
                })
                .catch(error => {
                    console.error("Error fetching job groups data:", error);
                });
        }
    }, [userData]);

    useEffect(() => {
        if (jobGroups.length > 0) {
            // Fetch job postings for the filtered job groups
            jobApi.getJobPostingsByJobGroupsIsPaid()
                .then(response => {
                    // console.log("All Job Postings Data:", response.data); // Log all fetched job postings data
                    const filteredPostings = response.data.data.filter(posting =>
                        jobGroups.some(jobGroup => jobGroup.id === posting.jobGroupId) // Filter postings by matching jobGroupId
                    );
                    // console.log("Filtered Job Postings Data:", filteredPostings); // Log the filtered job postings data
                    setJobPostings(filteredPostings); // Store the filtered job postings in state
                })
                .catch(error => {
                    console.error("Error fetching job postings data:", error);
                });
        }
    }, [jobGroups]);

    const handleScrollToOpenPosition = () => {
        openPositionRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the Open Position section
    };

    useEffect(() => {
        // Fetch user companies and log details
        userApi.getUserCompanies()
            .then(response => {
                // console.log("User Companies Data:", response.data.data); // Log all fetched user companies data
                const details = response.data.data.find(company => company.id === parseInt(id)); // Ensure `id` is compared as a number
                if (details) {
                    // console.log("Company Details for ID:", details); // Log the specific company details
                    setCompanyDetails(details); // Store the entire company details in state
                } else {
                    console.log(`No company found for ID: ${id}`); // Log if no matching company is found
                }
            })
            .catch(error => {
                console.error("Error fetching user companies data:", error);
            });
    }, [id]);

    // In the JSX
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
        <Rate disabled value={companyDetails?.avgRating || 0} style={{ fontSize: '24px' }} />
    </div>

    return (
        <div className='finding-company-whole-container'>
            <Header />
            <div style={{ height: '90px' }}></div>
            <div className="company-image-cover-container">
                <img className="company-image-cover" src="https://wallpaperaccess.com/full/506796.jpg" alt="Company Cover" />
            </div>
            <div className="finding-company-container">
                <div className="company-detail-header-container">
                    <div className="company-detail-header">
                        <div style={{ display: 'flex', justifyContent: 'space-start', gap: '20px', padding: '10px' }}>
                            <div className="company-detail-avatar-section">
                                {userData?.avatar ? (
                                    <Avatar
                                        shape="square" size={80}
                                        // icon={<AntDesignOutlined />}
                                        icon={<UserOutlined />}
                                        // src={userData ? userData.avatar : "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"} // Default avatar if none provided              
                                        src={userData?.avatar}
                                    />
                                ) : (
                                    <p className='no-avatar'><UserOutlined /></p>
                                )}
                            </div>
                            <div className="company-detail-title-section">
                                <Title level={3} style={{ fontWeight: 'bold', margin: 0 }}>
                                    {userData ? userData.companyName : "Loading..."}
                                </Title>
                                <Paragraph style={{ margin: 0, color: 'gray' }}><EnvironmentOutlined /> {userData ? userData.address : "Loading..."}</Paragraph>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                    <Rate disabled value={companyDetails?.avgRating || 0} style={{ fontSize: '24px' }} />
                                </div>
                            </div>
                        </div>
                        <div className="company-detail-buttons">
                            <Button
                                type="primary"
                                className="vop-now-button"
                                onClick={handleScrollToOpenPosition}
                            >
                                View Open Position <ArrowRightOutlined />
                            </Button>
                        </div>
                    </div>
                </div>

                <div style={{ height: '90px' }}></div>

                <Row >
                    <Col xs={24} sm={24} md={12}>
                        <div className="company-description-leftSide">

                            <Typography className="company-description-leftSide-typography">
                                <Title level={3} className="company-description-leftSide-title">Description</Title>
                                <Paragraph style={{ fontSize: '19px', lineHeight: '1.5' }}>
                                    {userData && userData.description ? (
                                        <div className='description'
                                            style={{ whiteSpace: 'pre-wrap' }}
                                            dangerouslySetInnerHTML={{
                                                __html: userData.description.replace(/\n/g, "<br />"),
                                            }}
                                        />
                                    ) : (
                                        "--None--"
                                    )}
                                </Paragraph>
                            </Typography>

                            {/* <Typography className="company-description-leftSide-typography">
                                <Title level={3} className="company-description-leftSide-title">Company Benefits</Title>
                                <Paragraph>
                                    Donec dignissim nunc eu tellus malesuada fermentum. Sed blandit in magna at accumsan. Etiam imperdiet massa aliquam, consectetur leo in, auctor neque.
                                </Paragraph>
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
                                                Nam condimentum sit amet ipsum id malesuada.
                                            </Paragraph>
                                        </li>
                                    </ul>
                                </Paragraph>
                            </Typography>

                            <Typography className="company-description-leftSide-typography">
                                <Title level={3} className="company-description-leftSide-title">Company Vision</Title>
                                <Paragraph>
                                    Praesent ultrices mauris at nisi euismod, ut venenatis augue blandit. Etiam massa risus, accumsan nec tempus nec, venenatis in nisl. Maecenas nulla ex, blandit in magna id, pellentesque facilisis sapien. In feugiat auctor mi, eget commodo lectus convallis ac.                                 </Paragraph>
                            </Typography> */}

                            {/* <div className="share-profile desktop-n-tablet-only">
                                <Title level={4} style={{ margin: 0 }}>Share profile:</Title>
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
                            </div> */}

                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                        <div className="company-description-rightSide">
                            <div className="company-overview">
                                <Space.Compact size="large" className="custom-space-compact">
                                    <Paragraph>
                                        <Row gutter={[16, 16]} className="company-overview-grid">
                                            <Col xs={24} sm={12} md={12} className="company-overview-item">
                                                <CalendarOutlined className="company-overview-icon" />
                                                <Paragraph className="company-overview-text">
                                                    FOUNDED IN:<br />
                                                    <span className="company-overview-highlight">
                                                        {userData && userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }) : "None"}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={12} className="company-overview-item">
                                                <SolutionOutlined className="company-overview-icon" />
                                                <Paragraph className="company-overview-text">
                                                    RECORD INITIATION:<br />
                                                    <span className="company-overview-highlight">
                                                        {userData && userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }) : "Loading..."}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={12} className="company-overview-item">
                                                <EnvironmentOutlined className="company-overview-icon" />
                                                <Paragraph className="company-overview-text">
                                                    LOCATION:<br />
                                                    <span className="company-overview-highlight">
                                                        {userData && userData.address ? userData.address : "Loading..."}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={12} className="company-overview-item">
                                                <FileProtectOutlined className="company-overview-icon" />
                                                <Paragraph className="company-overview-text">
                                                    VERIFICATION:<br />
                                                    <span className="company-overview-highlight">
                                                        {userData && userData.isVerified ? "Verified" : "Not Verified"}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                        </Row>
                                    </Paragraph>
                                </Space.Compact>
                            </div>

                            <div className="company-contact-info">
                                <Title level={4}>Contact Infomation</Title>
                                <div style={{ padding: '10px 0' }}>
                                    {/* <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                        <GlobalOutlined className="company-contact-info-icon" />
                                        <Paragraph className="company-overview-text">
                                            WEBSITE<br />
                                            <span className="company-overview-highlight">www.estherhoward.com</span>
                                        </Paragraph>
                                    </div>
                                    <Divider /> */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                        <PhoneOutlined className="company-contact-info-icon" style={{ transform: 'scaleX(-1)' }} />
                                        <Paragraph className="company-overview-text">
                                            PHONE<br />
                                            <span className="company-overview-highlight">{userData ? userData.phoneNumber : "Loading..."}</span>
                                        </Paragraph>
                                    </div>
                                    <Divider />
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                        <MailOutlined className="company-contact-info-icon" />
                                        <Paragraph className="company-overview-text">
                                            EMAIL ADDRESS<br />
                                            <span className="company-overview-highlight">{userData ? userData.email : "Loading..."}</span>
                                        </Paragraph>
                                    </div>
                                </div>

                            </div>

                            {/* <div className="company-others-info">
                                <Title level={5} style={{ marginTop: '10px' }}>Follow us on:</Title>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', padding: '10px 0' }}>
                                    <Button
                                        type="primary"
                                        className="company-anothers-info-hover-button"
                                    >
                                        <FacebookOutlined />
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="company-anothers-info-hover-button"
                                    >
                                        <InstagramOutlined />
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="company-anothers-info-hover-button"
                                    >
                                        <TwitterOutlined />
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="company-anothers-info-hover-button"
                                    >
                                        <YoutubeOutlined />
                                    </Button>
                                </div>

                            </div> */}

                            {/* <div className="share-profile-mobile-only">
                                <Title level={4} style={{ margin: 0 }}>Share profile:</Title>
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
                            </div> */}
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="open-position" ref={openPositionRef}>
                {filteredJobCount > 0 && (
                    <Title level={2} style={{ display: "flex", justifyContent: 'center' }}>
                        Open Position ({filteredJobCount})
                    </Title>
                )}
                <div className="list-company">
                    <div className="list-company-container">
                        <Row gutter={[16, 16]} justify="start">
                            {jobPostings
                                .filter((job) => {
                                    const startDate = new Date(job.started_date);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
                                    return startDate > today; // Exclude jobs where startDate is today or earlier
                                })
                                .map((job) => (
                                    <Col key={job.id} xs={24} sm={24} md={24} lg={24}>
                                        <Tooltip title={job.title}>
                                            <a href={`/job-detail-view/${job.id}`} className="list-company-card-link">
                                                <div className="list-company-card">
                                                    <div className="list-company-detail1">
                                                        <img
                                                            alt={job.title}
                                                            src={
                                                                userData
                                                                    ? userData.avatar
                                                                    : "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                                                            }
                                                            className="company-image"
                                                        />
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <Title level={4} className="company-detail-job-title">
                                                                    {job.title}
                                                                </Title>
                                                            </div>
                                                            <Paragraph style={{ color: "grey", margin: 0 }}>
                                                                <EnvironmentOutlined /> {job.location}
                                                            </Paragraph>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "right",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <Tag color="blue">
                                                            {(() => {
                                                                const startDate = new Date(job.started_date);
                                                                const endDate = new Date(job.end_date);
                                                                const durationInDays = Math.ceil(
                                                                    (endDate - startDate) / (1000 * 60 * 60 * 24)
                                                                );
                                                                if (durationInDays === 0) {
                                                                    return "Same-day";
                                                                } else if (durationInDays === 1) {
                                                                    return "1 day";
                                                                } else {
                                                                    return `${durationInDays} days`;
                                                                }
                                                            })()}
                                                        </Tag>
                                                        <Tag color="yellow">
                                                            {job.min_star_requirement} <StarOutlined />
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </a>
                                        </Tooltip>
                                    </Col>
                                ))}
                        </Row>
                    </div>
                </div>
            </div>
            <div style={{ height: '90px' }}></div>
            <Footer />
        </div>
    );
}

export default CompanyDetail;
