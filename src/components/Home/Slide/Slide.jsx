/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './Slide.css'
import { Button, Col, ConfigProvider, Input, Rate, Row, Select } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, SearchOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { jobGroupApi } from '../../../apis/job-group.request';
import { jobApi } from '../../../apis/job.request';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../apis/user.request';

export default function Slide() {
    const { Option } = Select;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [locations, setLocations] = useState([]); // State to store locations
    const [matchedPostings, setMatchedPostings] = useState([]); // State to store matched postings
    const [searchInput, setSearchInput] = useState(''); // State to track user input
    const [searchLocation, setSearchLocation] = useState(''); // State to track selected location
    const [searchTitle, setSearchTitle] = useState(''); // State to track selected job title
    const [filteredTitles, setFilteredTitles] = useState([]); // State to store filtered job titles
    const navigate = useNavigate();
    const [highestRatedCompany, setHighestRatedCompany] = useState(null);
    const [publicUserDetails, setPublicUserDetails] = useState(null);

    const handleSearch = () => {
        navigate(
            `/finding-job?location=${encodeURIComponent(searchLocation)}&title=${encodeURIComponent(searchTitle)}&trigger=true`
        );
    };

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // Thêm sự kiện resize để theo dõi thay đổi kích thước màn hình
        window.addEventListener('resize', handleResize);

        // Dọn dẹp sự kiện khi component unmount
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

                // console.log('Job Groups Inactive:', jobGroupsInactive);
                // console.log('Job Postings Is Paid:', jobPostingsIsPaid);

                // Get today's date in ISO format (ignoring time)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Filter out job postings where started_date is today or earlier
                const futureJobPostings = jobPostingsIsPaid.filter(posting => {
                    const startedDate = new Date(posting.started_date);
                    return startedDate > today;
                });

                // console.log('Future Job Postings:', futureJobPostings);

                // Filter futureJobPostings where jobGroupId matches id in jobGroupsInactive
                const matched = futureJobPostings.filter(posting =>
                    jobGroupsInactive.some(group => group.id === posting.jobGroupId)
                );

                console.log('Matched Postings:', matched);

                // Extract unique locations from matchedPostings
                const uniqueLocations = [...new Set(matched.map(posting => posting.location))].map(location => ({
                    value: location,
                    label: location
                }));

                // console.log('Unique Locations:', uniqueLocations);

                // Extract unique job titles
                const uniqueTitles = [...new Set(matched.map(posting => posting.title))];

                // console.log('Unique Titles:', uniqueTitles);

                // Update states
                setLocations(uniqueLocations);
                setMatchedPostings(matched);
                setFilteredTitles(uniqueTitles); // Initialize with all titles
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch user companies
        userApi.getUserCompanies()
            .then(response => {
                const companies = response.data.data;

                // Find the company with the highest avgRating
                const highestRated = companies.reduce((max, company) =>
                    company.avgRating > max.avgRating ? company : max, { avgRating: 0 });

                setHighestRatedCompany(highestRated);
                // console.log('Highest Rated Company:', highestRated);

                // Fetch additional details using getPublicUserById
                if (highestRated?.id) {
                    userApi.getPublicUserById(highestRated.id)
                        .then(publicUserResponse => {
                            // console.log('Public User Details:', publicUserResponse.data);
                            setPublicUserDetails(publicUserResponse.data.data); // Store public user details
                        })
                        .catch(error => {
                            console.error('Error fetching public user details:', error);
                        });
                }

                // Filter matched postings for the highest-rated company
                const filteredPostings = matchedPostings.filter(posting => posting.userId === highestRated.id);
                // console.log('Matched Postings for Highest Rated Company:', filteredPostings);
            })
            .catch(error => {
                console.error('Error fetching user companies:', error);
            });
    }, [matchedPostings]); // Add matchedPostings as a dependency

    const handleSearchChange = (value) => {
        setSearchInput(value);

        // Filter job titles based on user input
        const filtered = matchedPostings
            .map(posting => posting.title)
            .filter(title => title.toLowerCase().includes(value.toLowerCase()));

        setFilteredTitles([...new Set(filtered)]); // Ensure unique titles
    };

    return (
        <div className='slide-container'>
            <div className="slide_left">
                {/* <div className="location-search">
                    <Select
                        prefix={<EnvironmentOutlined />}
                        size="large"
                        allowClear
                        className="select-location"
                        showSearch
                        placeholder="Select a location"
                        optionFilterProp="label"
                        options={locations}
                        onChange={(value) => setSearchLocation(value)} // Update location state
                    />
                    <Input
                        className="select-location"
                        placeholder="Job title"
                        allowClear
                        prefix={<SearchOutlined className="custom-search-icon" />}
                        size="large"
                        value={searchTitle || ''} // Bind the input value to the state
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchTitle(value); // Update the state with user input
                            handleSearchChange(value); // Filter job titles based on user input
                        }}
                        onPressEnter={handleSearch} // Trigger search when the user presses Enter
                    />
                    <Button size="large" className="search-btn" onClick={handleSearch}>
                        Search
                    </Button>
                </div> */}
                <Link
                    to={highestRatedCompany?.id ? `/company-detail/${highestRatedCompany.id}` : '#'}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    className="company-spotlight"
                >
                    <div className="company-spotlight-img">
                        {/* <img src={publicUserDetails?.avatar || '/assets/background_colour.jpg'} alt="Company Avatar" /> */}
                        {publicUserDetails?.avatar ? (
                            <img src={publicUserDetails?.avatar} />
                        ) : (
                            <p className='no-avatar'><UserOutlined /></p>
                        )}
                    </div>
                    <div className="company-spotlight-info">
                        {screenWidth < 1100 ? (
                            <h3>{highestRatedCompany?.companyName || 'Company Name Not Available'}</h3>
                        ) : (
                            <h2>{highestRatedCompany?.companyName || 'Company Name Not Available'}</h2>
                        )}
                        <div className='company-spotlight-info-location'>
                            <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                                <EnvironmentOutlined /> {highestRatedCompany?.address?.split(',')[0] || 'City Not Available'}
                            </Link>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Rate: {
                                            starSize: screenWidth < 1100 ? 10 : 20,
                                            starBg: '#B0B7BD',
                                        },
                                    },
                                    token: {
                                        marginXS: 3
                                    }
                                }}
                            >
                                {highestRatedCompany ? (
                                    <Rate
                                        style={{ height: 'fit-content' }}
                                        disabled
                                        defaultValue={highestRatedCompany.avgRating || 0}
                                    />
                                ) : (
                                    <p>Loading rating...</p>
                                )}
                            </ConfigProvider>
                            <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                                {matchedPostings.filter(posting => posting.userId === highestRatedCompany?.id).length || 0} công việc <DownOutlined />
                            </Link>
                        </div>
                        <p>
                            {publicUserDetails?.description
                                ? new DOMParser().parseFromString(publicUserDetails.description, 'text/html').body.textContent
                                : 'Description not available'}
                        </p>
                    </div>
                </Link>
            </div>
            <div className="slide_right">
                <div className="today_dashboard">
                    <p>Today: <b>{`${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`}</b></p>
                    <p>
                        Total Job: <b>{matchedPostings.length}</b> <span>|</span> <br/> Today new jobs: <b>
                            {
                                matchedPostings.filter(posting => {
                                    const updatedAt = new Date(posting.updatedAt);
                                    const today = new Date();
                                    // Normalize both dates to UTC
                                    const utcUpdatedAt = new Date(Date.UTC(updatedAt.getUTCFullYear(), updatedAt.getUTCMonth(), updatedAt.getUTCDate()));
                                    const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
                                    return utcUpdatedAt.getTime() === utcToday.getTime();
                                }).length
                            }
                        </b>
                    </p>
                </div>
                <div className="image_background">
                    <img src="/assets/background_home.png" alt="" />
                </div>
            </div>
        </div>
    )
}
