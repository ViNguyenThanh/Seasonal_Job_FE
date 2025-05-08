/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './Slide.css'
import { Button, Col, ConfigProvider, Input, Rate, Row, Select } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { jobGroupApi } from '../../../apis/job-group.request';
import { jobApi } from '../../../apis/job.request';
import { useNavigate } from 'react-router-dom';

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

    const handleSearch = () => {
        navigate(
            `/finding-job?location=${encodeURIComponent(searchLocation)}&title=${encodeURIComponent(searchTitle)}`
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

                // Extract unique locations from matchedPostings
                const uniqueLocations = [...new Set(matched.map(posting => posting.location))].map(location => ({
                    value: location,
                    label: location
                }));

                // Extract unique job titles
                const uniqueTitles = [...new Set(matched.map(posting => posting.title))];

                // Update states
                setLocations(uniqueLocations);
                setMatchedPostings(matched);
                setFilteredTitles(uniqueTitles); // Initialize with all titles
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
                <div className="location-search">
                    <Select
                        prefix={<EnvironmentOutlined />}
                        size='large'
                        className='select-location'
                        showSearch
                        placeholder="Select a location"
                        optionFilterProp="label"
                        options={locations} // Use the dynamically populated locations
                        onChange={(value) => setSearchLocation(value)} // Update location state
                    />
                    <Select
                        className='select-location'
                        placeholder="Job title"
                        showSearch
                        prefix={<SearchOutlined className="custom-search-icon" />}
                        size='large'
                        value={searchTitle || undefined} // Set to undefined if searchTitle is empty
                        onSearch={handleSearchChange} // Track user input
                        onChange={(value) => setSearchTitle(value)} // Update title state
                        filterOption={false} // Disable default filtering
                    >
                        {filteredTitles.map((title, index) => (
                            <Option key={index} value={title}>
                                {title}
                            </Option>
                        ))}
                    </Select>
                    <Button size='large' className="search-btn" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <div className="company-spotlight">
                    <div className="company-spotlight-img">
                        <img src="/assets/background_colour.jpg" alt="" />
                    </div>
                    <div className="company-spotlight-info">
                        {screenWidth < 1100 ? (
                            <h3>TAM VIET INTERNATIONAL INVESTMENT & TRADING JOINT STOCK COMPANY</h3> // Thay h2 bằng h4 khi màn hình nhỏ
                        ) : (
                            <h2>TAM VIET INTERNATIONAL INVESTMENT & TRADING JOINT STOCK COMPANY</h2>
                        )}
                        <div className='company-spotlight-info-location'>
                            <Link><EnvironmentOutlined /> Ho Chi Minh</Link>
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
                                <Rate style={{ height: 'fit-content' }} disabled defaultValue={2} />
                            </ConfigProvider>
                            <Link>12 công việc <DownOutlined /></Link>
                        </div>
                        <p>Tam Viet operates in the medical field with the foundation of: pharmaceuticals, medical services</p>
                    </div>
                </div>
            </div>
            <div className="slide_right">
                <div className="today_dashboard">
                    <p>Today: <b>19/2/2025</b></p>
                    <p>Total Job: <b>100+</b> | Today new jobs: <b>10</b></p>
                </div>
                <div className="image_background">
                    <img src="/assets/background_home.png" alt="" />
                </div>
            </div>
        </div>
    )
}
