/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./JobDetailView.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Breadcrumb, Avatar, Tag, Button, Space, Row, Col, Modal, Upload, Input, message, ConfigProvider, notification, Spin, Radio } from 'antd';
import { AntDesignOutlined, PhoneOutlined, MailOutlined, ArrowRightOutlined, HomeOutlined, SearchOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;
import { CalendarOutlined, ClockCircleOutlined, WalletOutlined, EnvironmentOutlined, UploadOutlined, ManOutlined, WomanOutlined, TeamOutlined, HourglassOutlined, PushpinOutlined, SolutionOutlined, StarOutlined } from '@ant-design/icons';
const { TextArea } = Input;
import { useParams } from "react-router-dom";
import { jobApi } from "../../apis/job.request";
import { jobGroupApi } from "../../apis/job-group.request";
import { cvApi, uploadCV } from "../../apis/cv.request";
import { userApi } from "../../apis/user.request";
import { getApplicationsByUserId } from "../../apis/application.request";
import { getToken } from "../../utils/Token";

const JobDetailView = () => {

    const { id } = useParams(); // Get the job ID from the route
    const [jobDetail, setJobDetail] = useState(null); // State to store job details
    const [isLoading, setIsLoading] = useState(true); // State to track loading
    const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [isApplied, setIsApplied] = useState(false); // State to track if the user has applied
    const [value, setValue] = useState(''); // State for cover letter
    const [loadings, setLoadings] = useState([]); // State for button loading
    const [previewVisible, setPreviewVisible] = useState(false);
    const [jobGroupDetail, setJobGroupDetail] = useState(null); // State to store job group details
    const [jobTypeDetail, setJobTypeDetail] = useState(null); // State to store job type details
    const [userCompanies, setUserCompanies] = useState(null); // State to store user company details
    const [selectedCVOption, setSelectedCVOption] = useState("default"); // State to track selected CV option
    const [userId, setUserId] = useState(null); // State to store the logged-in user's ID
    const [defaultCV, setDefaultCV] = useState(null); // State to store the default CV
    const [defaultPreviewUrl, setDefaultPreviewUrl] = useState(null); // State for the default CV preview URL
    const [defaultPreviewVisible, setDefaultPreviewVisible] = useState(false); // State for the default CV preview modal
    const [avatarUrl, setAvatarUrl] = useState(null); // State for the avatar URL


    // Fetch job details when the component loads
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const jobResponse = await jobApi.getJobById(id);
                const jobData = jobResponse.data.data;
                console.log("Job Detail:", jobData); // Log the job details
                setJobDetail(jobData);

                // Fetch user details using userId from jobData
                if (jobData.userId) {
                    const userResponse = await userApi.getPublicUserById(jobData.userId);
                    console.log("User Detail:", userResponse.data); // Log user details here
                    setAvatarUrl(userResponse.data.data.avatar); // Set the avatar URL
                }

                // Fetch job group details
                if (jobData.jobGroupId) {
                    const jobGroupResponse = await jobGroupApi.getJobGroupById(jobData.jobGroupId);
                    setJobGroupDetail(jobGroupResponse.data.data);
                }

                // Fetch job type details
                if (jobData.jobTypeId) {
                    const jobTypeResponse = await jobApi.getJobTypeById(jobData.jobTypeId);
                    setJobTypeDetail(jobTypeResponse.data.data);
                }

                // Fetch user company details
                const userCompaniesResponse = await userApi.getUserCompanies();
                const companies = userCompaniesResponse.data.data;
                const filteredCompany = companies.find(company => company.id === jobData.userId);
                setUserCompanies(filteredCompany || null);

                // Check if the user has already applied for this job
                const applications = await getApplicationsByUserId();
                const alreadyApplied = applications.data.some(
                    (application) => application.jobPostingId === jobData.id
                );
                setIsApplied(alreadyApplied);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching job details:", error);
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    useEffect(() => {
        const token = getToken();
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
            setUserId(decodedToken.id); // Extract and set the user ID
        }

        const fetchDefaultCV = async () => {
            if (!userId) return;

            try {
                const response = await cvApi.getUserCVs(userId); // Fetch all CVs for the user
                const cvs = response.data;
                if (Array.isArray(cvs)) {
                    const defaultCV = cvs.find((cv) => cv.status === "Default"); // Find the default CV
                    if (defaultCV) {
                        setDefaultCV({
                            id: defaultCV.id,
                            name: defaultCV.filename,
                            url: defaultCV.file_Url,
                        });
                        console.log("Default CV:", defaultCV); // Log the default CV
                    } else {
                        setDefaultCV(null);
                        console.log("No default CV found.");
                    }
                }
            } catch (error) {
                console.error("Error fetching default CV:", error);
            }
        };

        fetchDefaultCV();
    }, [userId]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading..." /> {/* Ant Design loading spinner */}
            </div>
        );
    }

    if (!jobDetail) {
        return <div>Job not found</div>; // Show a message if no job details are found
    }


    // Handle file selection
    const handleUpload = (info) => {
        if (info.file.status === "done") {
            const file = info.file.originFileObj; // Get the selected file
            console.log("File selected:", file); // Log the file details
            setSelectedFile(file); // Store the file in state
            message.success(`${info.file.name} file is ready to upload.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const props = {
        name: "file",
        beforeUpload: (file) => {
            const isPdf = file.type === "application/pdf";
            if (!isPdf) {
                message.error("Only PDF files are allowed!");
            }
            return isPdf || Upload.LIST_IGNORE; // Ngăn file không hợp lệ vào danh sách
        },
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok"); // Simulate success for Ant Design's Upload component
            }, 0);
        },
        onChange: handleUpload, // Use the custom handler
        showUploadList: false, // Ẩn danh sách file
    };

    const handleApplyNow = async () => {
        if (selectedCVOption === "upload" && !selectedFile) {
            message.error("Please upload a CV before applying.");
            return;
        }

        if (selectedCVOption === "default" && !defaultCV) {
            message.error("No default CV is available. Please upload a CV.");
            return;
        }

        // Trigger loading animation
        enterLoading(1); // Pass the index of the button to enable loading

        try {
            // Fetch existing applications by the user
            const applications = await getApplicationsByUserId();
            const alreadyApplied = applications.data.some(
                (application) => application.jobPostingId === jobDetail.id
            );

            if (alreadyApplied) {
                message.warning("You have already applied for this job.");
                setIsApplied(true);
                setIsModalOpen(false); // Close the modal
                return;
            }

            let cvId;

            if (selectedCVOption === "upload") {
                // Upload the CV
                const response = await uploadCV(selectedFile);
                cvId = response.data.data;
            } else if (selectedCVOption === "default") {
                // Use the default CV
                cvId = defaultCV.id;
            }

            await cvApi.applyjob(jobDetail.id, {
                jobPostingId: jobDetail.id,
                cvId,
                coverLetter: value,
            });

            message.success("Your application has been submitted successfully!");

            // Mark the job as applied
            setIsApplied(true);
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error submitting application:", error);
            message.error(error.message || "Failed to submit your application.");
        } finally {
            // Stop the loading animation after the process is complete
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[1] = false; // Reset loading state
                return newLoadings;
            });
        }
    };

    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true; // Enable loading for the button at the given index
            return newLoadings;
        });
    };

    // const toggleSaveStatus = () => {
    //     setIsSaved(!isSaved); // Toggle the saved status
    // };


    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: 'Warning',
            description: 'You need to sign in to apply for this job.',
        });
    };

    const handleApplyClick = () => {
        const token = localStorage.getItem('token'); // Check if the user has a token
        if (!token) {
            openNotificationWithIcon('warning'); // Show warning notification if no token
        } else {
            showModal(); // Show the modal if the user is signed in
        }
    };

    const handleCVOptionChange = (e) => {
        setSelectedCVOption(e.target.value); // Update the selected option
    };

    const handleDefaultPreview = async () => {
        try {
            // Fetch the file as a Blob
            const response = await fetch(defaultCV.url);
            const blob = await response.blob();

            // Force the Blob to be treated as a PDF
            const pdfBlob = new Blob([blob], { type: "application/pdf" });
            const objectUrl = URL.createObjectURL(pdfBlob);

            setDefaultPreviewUrl(objectUrl); // Set the object URL for the default CV preview
            setDefaultPreviewVisible(true); // Open the modal
        } catch (error) {
            console.error("Error fetching the PDF:", error);
            message.error("Failed to load the CV for preview.");
        }
    };

    return (
        <div className='job-detail-view-whole-container'>
            <Header />
            <div className="job-detail-view-container">

                <div style={{ height: '50px' }}></div>

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
                                title: (
                                    <a href="/">
                                        <HomeOutlined style={{ marginRight: '5px' }} />
                                        Home
                                    </a>
                                ),
                            },
                            {
                                title: (
                                    <a href="/finding-job">
                                        <SearchOutlined style={{ marginRight: '5px' }} />
                                        Find Jobs
                                    </a>
                                ),
                            },
                            {
                                title: (
                                    <span>
                                        <FileTextOutlined style={{ marginRight: '5px' }} />
                                        Job Detail
                                    </span>
                                ),
                            },
                        ]}
                    />
                </ConfigProvider>

                <div style={{ height: '30px' }}></div>

                <div className="job-detail-header">
                    <div className="job-detail-avatar-section">
                        <Avatar
                            style={{ width: '100px', height: '100px' }}
                            src={avatarUrl} // Use the avatar URL from state
                            icon={!avatarUrl && <AntDesignOutlined />} // Fallback to icon if no avatar
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <div className="job-detail-title-section">
                                <Title level={2} style={{ fontWeight: 'bold', margin: 0 }}>{jobDetail.title}</Title>
                                <Tag color="blue" style={{ marginTop: '1%' }}>
                                    {(() => {
                                        const startDate = new Date(jobDetail.started_date);
                                        const endDate = new Date(jobDetail.end_date);
                                        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate duration in days
                                        return `${durationInDays} days`; // Display duration
                                    })()}
                                </Tag>
                                <Tag color="yellow" style={{ marginLeft: '-10px', marginTop: '1%' }}>
                                    {jobDetail.min_star_requirement} <StarOutlined />
                                </Tag>
                            </div>

                            <div className="job-detail-info-section">
                                {/* <p className="ebc-p-info"><LinkOutlined style={{ color: '#1DA1F2' }} /> https://instagram.com</p> */}
                                <p className="ebc-p-info"><PhoneOutlined style={{ color: '#1DA1F2', transform: 'scaleX(-1)' }} /> {userCompanies.phoneNumber}</p>
                                <p className="ebc-p-info"><MailOutlined style={{ color: '#1DA1F2' }} /> {userCompanies.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="job-detail-action-section">
                        <div className="job-detail-buttons">
                            {/* <Button
                                type={isSaved ? "primary" : "default"} // Change button type based on isSaved
                                shape="rectangle"
                                className="bookmark-button"
                                onClick={toggleSaveStatus} // Handle click to toggle status
                            >
                                <BookOutlined />
                            </Button> */}

                            <Button
                                type="primary"
                                className="apply-now-button"
                                onClick={handleApplyClick}
                                disabled={isApplied} // Disable the button if the user has applied
                            >
                                {isApplied ? "Applied" : <>Apply now <ArrowRightOutlined /></>} {/* Conditionally render text and icon */}
                            </Button>
                        </div>
                        <p className="job-expiry-info">
                            Created on <span className="job-expiry-date">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(jobDetail.createdAt))}</span>
                        </p>
                    </div>
                </div>
                <Row >
                    <Col xs={24} sm={24} md={12}>
                        <div className="job-description-leftSide">
                            <Typography className="job-description-leftSide-typography">
                                <div style={{ display: "flex", alignItems: "center", marginTop: "15px", color: "#555" }}>
                                    <PushpinOutlined className="job-overview-icon" />
                                    <span style={{ fontSize: "16px", color: "#333", marginLeft: "10px" }}>{jobDetail.address}</span>
                                </div>
                                <Title level={3} className="job-description-leftSide-title">
                                    <span>General Overview of the Job:<br></br></span>
                                    {jobGroupDetail.title}
                                </Title>
                                <Paragraph style={{ fontSize: "18px", color: "#333333" }}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: jobGroupDetail.description.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </Paragraph>
                                <Title level={3} className="job-description-leftSide-title">Job Description</Title>
                                <Paragraph style={{ fontSize: "18px", color: "#333333" }}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: jobDetail.description.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </Paragraph>
                            </Typography>

                            {/* <Typography className="job-description-leftSide-typography">
                                <Title level={3} className="job-description-leftSide-title">Job Details</Title>

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
                            </Typography> */}

                            {/* <div className="share-this-job desktop-n-tablet-only">
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
                            </div> */}

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
                                                    <span className="job-overview-highlight">
                                                        {new Intl.DateTimeFormat('en-GB', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        }).format(new Date(jobDetail.updatedAt))}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <ClockCircleOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    START DATE<br />
                                                    <span className="job-overview-highlight">
                                                        {new Intl.DateTimeFormat('en-GB', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            timeZone: 'UTC',
                                                        }).format(new Date(jobDetail.started_date))}</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <HourglassOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    END DATE<br />
                                                    <span className="job-overview-highlight">
                                                        {new Intl.DateTimeFormat('en-GB', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            timeZone: 'UTC',
                                                        }).format(new Date(jobDetail.end_date))}
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <WalletOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    SALARY:<br />
                                                    <span className="job-overview-highlight">
                                                        {new Intl.NumberFormat('vi-VN').format(jobDetail.salary)} VND
                                                    </span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <EnvironmentOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    LOCATION:<br />
                                                    <span className="job-overview-highlight">{jobDetail.location}</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <SolutionOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    JOB TYPE:<br />
                                                    <span className="job-overview-highlight">{jobTypeDetail?.name || "None"}</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <TeamOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    REQUIRED PEOPLE:<br />
                                                    <span className="job-overview-highlight">{jobDetail.number_of_person}</span>
                                                </Paragraph>
                                            </Col>
                                            <Col xs={24} sm={12} md={8} className="job-overview-item">
                                                <ManOutlined className="job-overview-icon" />
                                                <WomanOutlined className="job-overview-icon" />
                                                <Paragraph className="job-overview-text">
                                                    GENDER:<br />
                                                    <span className="job-overview-highlight">{jobDetail.gender_requirement ? jobDetail.gender_requirement : "Any"}</span>
                                                </Paragraph>
                                            </Col>
                                        </Row>
                                    </Paragraph>
                                </Space.Compact>
                            </div>

                            {/* <div className="job-others-info">
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
                            </div> */}

                            <div className="job-detail-action-section-mobile-only">
                                <div className="job-detail-buttons">
                                    {/* <Button
                                        type={isSaved ? "primary" : "default"} // Change button type based on isSaved
                                        shape="rectangle"
                                        className="bookmark-button"
                                        onClick={toggleSaveStatus} // Handle click to toggle status
                                    >
                                        <BookOutlined />
                                    </Button> */}

                                    <Button
                                        type="primary"
                                        className="apply-now-button"
                                        onClick={handleApplyClick}
                                        disabled={isApplied} // Disable the button if the user has applied
                                    >
                                        {isApplied ? "Applied" : <>Apply now <ArrowRightOutlined /></>} {/* Conditionally render text and icon */}
                                    </Button>
                                </div>
                            </div>
                            <p className="jobType-but-job-expiry-date" style={{ color: "grey", display: 'flex', justifyContent: 'center' }}>
                                Job type:<span className="job-expiry-date">
                                    {jobTypeDetail?.name || "None"}
                                </span>
                            </p>

                            {/* <div className="share-this-job-mobile-only">
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
                            </div> */}

                            <Modal
                                title={jobDetail.title}
                                open={isModalOpen}
                                onCancel={handleCancel}
                                centered
                                footer={[
                                    <Button key="cancel" onClick={handleCancel}>
                                        Cancel
                                    </Button>,
                                    <Button
                                        key="submit"
                                        type="primary"
                                        style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                                        loading={loadings[1]}
                                        onClick={handleApplyNow}
                                    >
                                        Apply Now
                                    </Button>,
                                ]}
                            >
                                <Title level={5} style={{ margin: 0 }}>
                                    Choose CV
                                </Title>
                                <Radio.Group
                                    style={{ marginTop: "10px" }}
                                    onChange={(e) => {
                                        handleCVOptionChange(e);
                                        if (e.target.value === "default" && defaultCV) {
                                            message.success("Default CV is ready to upload.");
                                        }
                                    }}
                                    value={selectedCVOption} // Bind the selected value
                                >
                                    <Radio value="default">Default CV</Radio>
                                    <Radio value="upload">Upload</Radio>
                                </Radio.Group>
                                <br />
                                {selectedCVOption === "upload" && (
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined />} style={{ marginTop: "15px" }}>
                                            Upload
                                        </Button>
                                    </Upload>
                                )}
                                {selectedCVOption === "default" && defaultCV && (
                                    <div style={{ marginTop: "15px" }}>
                                        <Title level={5} style={{ margin: 0 }}>
                                            Preview Default CV
                                        </Title>
                                        <Button
                                            size="large"
                                            onClick={handleDefaultPreview} // Open preview for default CV
                                        >
                                            <FilePdfOutlined /> {defaultCV.name}
                                        </Button>
                                        <Modal
                                            open={defaultPreviewVisible}
                                            title="Preview Default CV"
                                            footer={null}
                                            onCancel={() => setDefaultPreviewVisible(false)}
                                            width="80%"
                                        >
                                            <embed
                                                src={defaultPreviewUrl} // Preview default CV
                                                type="application/pdf"
                                                width="100%"
                                                height="500px"
                                            />
                                        </Modal>
                                    </div>
                                )}
                                {selectedCVOption === "upload" && selectedFile && (
                                    <div style={{ marginTop: "15px" }}>
                                        <Title level={5} style={{ margin: 0 }}>
                                            Preview CV
                                        </Title>
                                        <Button
                                            size="large"
                                            onClick={() => setPreviewVisible(true)} // Open preview for uploaded file
                                        >
                                            <FilePdfOutlined /> {selectedFile.name}
                                        </Button>
                                        <Modal
                                            open={previewVisible}
                                            title="Preview CV"
                                            footer={null}
                                            onCancel={() => setPreviewVisible(false)}
                                            width="80%"
                                        >
                                            <embed
                                                src={URL.createObjectURL(selectedFile)} // Preview uploaded file
                                                type="application/pdf"
                                                width="100%"
                                                height="500px"
                                            />
                                        </Modal>
                                    </div>
                                )}
                                {!defaultCV && selectedCVOption === "default" && (
                                    <div style={{ marginTop: "15px", color: "red" }}>
                                        No available default CV.
                                    </div>
                                )}
                                <Title level={5} style={{ marginTop: "20px" }}>
                                    Cover Letter
                                </Title>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <TextArea
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="Write down your biography here. Let the employers know who you are..."
                                        autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                        }}
                                        style={{ paddingBottom: "50px" }}
                                    />
                                </div>
                            </Modal>
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