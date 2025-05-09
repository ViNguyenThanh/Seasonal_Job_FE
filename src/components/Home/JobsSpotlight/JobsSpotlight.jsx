/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './JobsSpotlight.css'
import { Button, ConfigProvider } from 'antd'
import { DownOutlined, EnvironmentOutlined, DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { jobGroupApi } from '../../../apis/job-group.request';
import { jobApi } from '../../../apis/job.request';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../apis/user.request'; // Import userApi

const data = [
    {
        title: '',
        location: '',
        salary: '',
        duration: '',
        description: '',
        imgSrc: ''
    },
];

export default function JobsSpotlight() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [matchedPostings, setMatchedPostings] = useState([]);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);


    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Fetch data from both APIs
        Promise.all([
            jobGroupApi.getAllJobGroupsInactive(),
            jobApi.getJobPostingsByJobGroupsIsPaid()
        ])
            .then(([jobGroupsResponse, jobPostingsResponse]) => {
                const jobGroupsInactive = Array.isArray(jobGroupsResponse.data.data) ? jobGroupsResponse.data.data : [];
                const jobPostingsIsPaid = Array.isArray(jobPostingsResponse.data.data) ? jobPostingsResponse.data.data : [];

                // Get today's date in ISO format (ignoring time)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Filter out job postings where started_date is today or earlier
                const futureJobPostings = jobPostingsIsPaid.filter(posting => {
                    const startedDate = new Date(posting.started_date);
                    return startedDate > today;
                });

                // Filter futureJobPostings where jobGroupId matches id in jobGroupsInactive
                const matched = futureJobPostings.filter(posting =>
                    jobGroupsInactive.some(group => group.id === posting.jobGroupId)
                );

                setMatchedPostings(matched); // Update state with matched postings
                console.log('Matched postings Job Spotlight:', matched);

                // Fetch user details for the first matched posting
                if (matched.length > 0) {
                    const userId = matched[0].userId; // Get userId from the first matched posting
                    userApi.getPublicUserById(userId)
                        .then(response => {
                            setUserDetails(response.data.data); // Update state with user details
                            console.log('User Details Job Spotlight:', response.data);
                        })
                        .catch(error => {
                            console.error('Error fetching user details:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className='jobs-spotlight-container'>
            <div className="jobs-spotlight-info">
                <div className="jobs-spotlight-header">
                    <p>Jobs <span>Spotlight</span></p>
                </div>
                <div className="jobs-spotlight-content">
                    <div className="jobs-spotlight-items">
                        {matchedPostings.map((item, index) => (
                            index === 8 && screenWidth < 1170 ? null :
                                <div
                                    key={index}
                                    className="job-list-spotlight"
                                    onClick={() => navigate(`/job-detail-view/${item.id}`)} // Navigate to job-detail-view/id
                                    style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                                >
                                    <div className="job-list-spotlight-img">
                                        {/* <img src={userDetails?.avatar || "/assets/background_colour.jpg"} alt="User Avatar" /> */}
                                        {userDetails?.avatar ? (
                                            <img src={userDetails?.avatar} />
                                        ) : (
                                            <p className='no-avatar'><UserOutlined /></p>
                                        )}
                                    </div>
                                    <div className="job-list-spotlight-info">
                                        <h3>{item.title || 'Default Title'}</h3>
                                        <div className='job-list-spotlight-info-location'>
                                            <p><EnvironmentOutlined /> {item.location || 'Ho Chi Minh'}</p>
                                            <p><DollarOutlined /> {item.salary ? `${parseInt(item.salary, 10)} VND` : 'Loading...'}</p>
                                            <p>
                                                <CalendarOutlined />
                                                {(() => {
                                                    if (item.started_date && item.end_date) {
                                                        const startDate = new Date(item.started_date);
                                                        const endDate = new Date(item.end_date);
                                                        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                                                        if (duration === 0) return ' Same-day';
                                                        if (duration === 1) return ' 1 day';
                                                        return `${duration} days`;
                                                    }
                                                    return '7 days'; // Default fallback
                                                })()}
                                            </p>
                                        </div>
                                        <p>
                                            {item.description
                                                ? new DOMParser().parseFromString(item.description, 'text/html').body.textContent
                                                : 'Loading...'}
                                        </p>
                                    </div>
                                </div>
                        ))}
                    </div>
                    <div className="jobs-spotlight-btn">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultBorderColor: 'var(--btn-primary-color)',
                                        defaultColor: 'var(--btn-primary-color)',
                                        defaultHoverBg: 'var(--btn-primary-color)',
                                        defaultHoverColor: 'white',
                                    }
                                },
                                token: { fontSize: 20 }
                            }}>
                            <Button
                                icon={<DownOutlined />}
                                size='large'
                                onClick={() => {
                                    window.scrollTo({ top: 0 });
                                    navigate('/finding-job');
                                }}
                            >
                                View All
                            </Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
