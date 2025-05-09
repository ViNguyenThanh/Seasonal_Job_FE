/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./FindingCompany.css";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Breadcrumb, Button, Flex, Space, Select, Row, Col, Typography, Tag, Pagination, Rate, Input } from 'antd';
import { userApi } from "../../apis/user.request"; // Import the userApi
const { Title, Paragraph } = Typography;
import { SearchOutlined, EnvironmentOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { Spin, Empty, ConfigProvider } from 'antd';

const { Option } = Select;

const FindingCompany = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [filteredCompanies, setFilteredCompanies] = useState(companies);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });

    const applyFilters = (companyName, city, district) => {
        let filtered = companies;

        if (companyName) {
            filtered = filtered.filter((company) =>
                company.companyName.toLowerCase().includes(companyName.toLowerCase())
            );
        }

        if (city) {
            filtered = filtered.filter((company) =>
                company.address.split(',')[0].toLowerCase().includes(city.toLowerCase())
            );
        }

        if (district) {
            filtered = filtered.filter((company) =>
                company.address.split(',')[1]?.trim().toLowerCase().includes(district.toLowerCase())
            );
        }

        setFilteredCompanies(filtered);
    };

    useEffect(() => {
        // Fetch the companies from the API
        userApi.getUserCompanies()
            .then(response => {
                console.log("API Response:", response.data); // Log the API response
                if (Array.isArray(response.data.data)) {
                    setCompanies(response.data.data); // Update the companies state with the API data
                    setFilteredCompanies(response.data.data); // Automatically populate the filtered list
                } else {
                    console.error("API did not return an array:", response.data);
                    setCompanies([]); // Fallback to an empty array
                    setFilteredCompanies([]); // Clear the filtered list
                }
            })
            .catch(error => {
                console.error("Error fetching companies:", error); // Log any errors
                setCompanies([]); // Fallback to an empty array
                setFilteredCompanies([]); // Clear the filtered list
            });
    }, []);

    useEffect(() => {
        setLoading(true); // Start loading
        userApi.getUserCompanies()
            .then(async (response) => {
                if (Array.isArray(response.data.data)) {
                    const companiesWithCreatedAt = await Promise.all(
                        response.data.data.map(async (company) => {
                            const userResponse = await userApi.getPublicUserById(company.id); // Fetch user data by company ID
                            console.log(`Fetched user data for company ID ${company.id}:`, userResponse.data); // Log the user data
                            return {
                                ...company,
                                avatar: userResponse.data.data.avatar, // Include avatar
                                createdAt: userResponse.data.createdAt, // Add the createdAt field
                            };
                        })
                    );
                    setCompanies(companiesWithCreatedAt); // Update the companies state
                    setFilteredCompanies(companiesWithCreatedAt); // Update the filtered list
                } else {
                    setCompanies([]); // Fallback to an empty array
                    setFilteredCompanies([]); // Clear the filtered list
                }
            })
            .catch((error) => {
                console.error("Error fetching companies:", error); // Log any errors
                setCompanies([]); // Fallback to an empty array
                setFilteredCompanies([]); // Clear the filtered list
            })
            .finally(() => {
                setLoading(false); // Stop loading
            });
    }, []);

    useEffect(() => {
        userApi.getUserCompanies()
            .then(response => {
                if (Array.isArray(response.data.data)) {
                    const companiesWithRatings = response.data.data.map(company => ({
                        ...company,
                        avgRating: company.avgRating || 0, // Ensure avgRating is always defined
                    }));
                    setCompanies(companiesWithRatings);
                    setFilteredCompanies(companiesWithRatings);
                } else {
                    setCompanies([]);
                    setFilteredCompanies([]);
                }
            })
            .catch(error => {
                console.error("Error fetching companies:", error);
                setCompanies([]);
                setFilteredCompanies([]);
            });
    }, []);

    return (
        <Spin spinning={loading}
            tip="Loading..."
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
        >
            <div className='finding-company-whole-container'>
                <Header />
                <div className="finding-job-container">
                    <div className="search-filter-layer1">
                        <div className="header-title">
                            <p className="ebc-p">Find Company</p>
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
                                                    <span style={{ marginLeft: '5px' }}>Find Company</span>
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </ConfigProvider>
                        </div>
                        <div className="search-filter-layer2">
                            <Space.Compact size="large" className="custom-space-compact">
                                <Input
                                    placeholder="Search Company / Employers..."
                                    prefix={<SearchOutlined className="custom-icon" />}
                                    allowClear
                                    style={{
                                        width: '90%',
                                        height: '50px',
                                        borderColor: 'white',
                                    }}
                                    value={selectedCompany || ''} // Bind the input value to the state
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedCompany(value); // Update the state with user input
                                        applyFilters(value, selectedCity, selectedDistrict); // Apply cumulative filters
                                    }}
                                    onPressEnter={() => {
                                        applyFilters(selectedCompany, selectedCity, selectedDistrict); // Trigger search on Enter key press
                                    }}
                                />

                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select City"
                                    prefix={<HomeOutlined className="custom-icon" />}
                                    style={{
                                        width: '60%',
                                        height: '50px',
                                    }}
                                    onSearch={(value) => {
                                        setSelectedCity(value); // Update state
                                        applyFilters(selectedCompany, value, selectedDistrict); // Apply cumulative filters
                                    }}
                                    value={selectedCity} // Bind state
                                    onChange={(value) => {
                                        setSelectedCity(value); // Update state
                                        applyFilters(selectedCompany, value, selectedDistrict); // Apply cumulative filters
                                    }}
                                    filterOption={false} // Disable default filtering to rely on custom logic
                                >
                                    {[...new Set(companies.map((company) => company.address.split(',')[0]))]
                                        .filter((city) => city.toLowerCase().includes(selectedCity?.toLowerCase() || ''))
                                        .map((city, index) => (
                                            <Option key={index} value={city}>
                                                {city}
                                            </Option>
                                        ))}
                                </Select>

                                <Select
                                    showSearch
                                    placeholder="Select District"
                                    allowClear
                                    prefix={<EnvironmentOutlined className="custom-icon" />}
                                    style={{
                                        width: '60%',
                                        height: '50px',
                                    }}
                                    onSearch={(value) => {
                                        setSelectedDistrict(value); // Update state
                                        applyFilters(selectedCompany, selectedCity, value); // Apply cumulative filters
                                    }}
                                    value={selectedDistrict} // Bind state
                                    onChange={(value) => {
                                        setSelectedDistrict(value); // Update state
                                        applyFilters(selectedCompany, selectedCity, value); // Apply cumulative filters
                                    }}
                                    filterOption={false} // Disable default filtering to rely on custom logic
                                >
                                    {[...new Set(companies.map((company) => company.address.split(',')[1]?.trim()))]
                                        .filter((district) => district?.toLowerCase().includes(selectedDistrict?.toLowerCase() || ''))
                                        .map((district, index) => (
                                            <Option key={index} value={district}>
                                                {district}
                                            </Option>
                                        ))}
                                </Select>

                                <Flex gap="small" wrap>
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />} // Add the reset icon
                                        style={{
                                            height: '50px',
                                            borderRadius: '5px',
                                            width: '100px',
                                        }}
                                        onClick={() => {
                                            setFilteredCompanies(companies); // Reset the company data to show all companies
                                            setSelectedCompany(null); // Clear the company input
                                            setSelectedCity(null); // Clear the city input
                                            setSelectedDistrict(null); // Clear the district input
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
                                onChange={(value) => {
                                    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
                                        if (value === 'latest') {
                                            return new Date(b.createdAt) - new Date(a.createdAt);
                                        } else {
                                            return new Date(a.createdAt) - new Date(b.createdAt);
                                        }
                                    });
                                    setFilteredCompanies(sortedCompanies);
                                }}
                            />
                            <Select
                                defaultValue="12perpage"
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
                                onChange={(value) => {
                                    const pageSize = value === '12perpage' ? 12 : 24;
                                    setPagination({ ...pagination, pageSize });
                                }}
                            />
                        </Col>
                    </Row>

                    <div className="list-company">
                        <div className="list-company-container">
                            {filteredCompanies.length === 0 ? (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                                    <Empty description="No Data" />
                                </div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {filteredCompanies.map((company) => (
                                        <Col key={company.id} xs={24} sm={12} md={12} lg={8}>
                                            <a href={`/company-detail/${company.id}`} className="list-company-card-link">
                                                <div className="list-company-card">
                                                    <div className="list-company-detail1">
                                                        <img
                                                            alt={company.companyName}
                                                            src={company.avatar || "https://i.pinimg.com/736x/27/e0/74/27e074008b1d54fb474224de9102651b.jpg"} // Use avatar if available
                                                            className="company-image"
                                                        />
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <Title level={5} style={{ margin: 0 }} className="findingcomapany-title">
                                                                    {company.companyName}
                                                                </Title>
                                                            </div>
                                                            <Paragraph style={{ color: 'grey', margin: 0 }}>
                                                                <EnvironmentOutlined /> {company.address}
                                                            </Paragraph>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                                                <Rate disabled defaultValue={company.avgRating} style={{ fontSize: '14px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                        <Pagination
                            current={pagination.current}
                            total={filteredCompanies.length}
                            pageSize={pagination.pageSize}
                            onChange={(page, pageSize) => {
                                setPagination({ current: page, pageSize });
                            }}
                        />
                    </div>
                </div>
                <div style={{ height: '100px' }}></div>
                <Footer />
            </div>
        </Spin>
    );
}

export default FindingCompany;