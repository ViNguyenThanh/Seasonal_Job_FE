// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./FindingCompany.css";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Breadcrumb, Button, Flex, Space, Select, Row, Col, Typography, Tag, Pagination } from 'antd';
const { Title, Paragraph } = Typography;
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined } from '@ant-design/icons';

const { Option } = Select;

const FindingCompany = () => {
    const [companies] = useState([
        {
            id: 1,
            company: "Reddit",
            title: "Marketing Officer",
            location: "United Kingdom of Great Britain",
            salary: "$30K-$35K",
            duration: "Full Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: true,
        },
        {
            id: 2,
            company: "Google",
            title: "Software Engineer",
            location: "United States",
            salary: "$100K-$120K",
            duration: "Full Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: false,
        },
        {
            id: 3,
            company: "Microsoft",
            title: "Data Analyst",
            location: "Canada",
            salary: "$70K-$80K",
            duration: "Part Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: true,
        },
        {
            id: 4,
            company: "Amazon",
            title: "Product Manager",
            location: "Germany",
            salary: "$90K-$110K",
            duration: "Full Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: false,
        },
        {
            id: 5,
            company: "Apple",
            title: "UX Designer",
            location: "Australia",
            salary: "$80K-$95K",
            duration: "Contract",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: true,
        },
        {
            id: 6,
            company: "Tesla",
            title: "HR Specialist",
            location: "France",
            salary: "$50K-$60K",
            duration: "Full Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: false,
        },
        {
            id: 7,
            company: "Netflix",
            title: "Content Strategist",
            location: "United States",
            salary: "$85K-$100K",
            duration: "Full Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: true,
        },
        {
            id: 8,
            company: "Spotify",
            title: "Music Curator",
            location: "Sweden",
            salary: "$60K-$75K",
            duration: "Part Time",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: false,
        },
        {
            id: 9,
            company: "Adobe",
            title: "Graphic Designer",
            location: "United Kingdom",
            salary: "$70K-$85K",
            duration: "Contract",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isFeatured: true,
        },
    ]);
    return (
        <div className='finding-company-whole-container'>
            <Header />
            <div className="finding-job-container">
                <div className="search-filter-layer1">
                    <div className="header-title">
                        <p className="ebc-p">Find Company</p>
                        <Breadcrumb
                            className="breadcrumb"
                            items={[
                                {
                                    title: <a href="/">Home</a>,
                                },
                                {
                                    title: 'Find Company',
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
                            <Flex gap="small" wrap>
                                <Button type="primary" style={{
                                    height: '50px', borderRadius: '5px', width: '100px'
                                }}>Find Company</Button>
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

                <div className="list-company">
                    <div className="list-company-container">
                        <Row gutter={[16, 16]} justify="center">
                            {companies.map((company) => (
                                <Col key={company.id} xs={24} sm={12} md={12} lg={8}>
                                    <a href={`/company/${company.id}`} className="list-company-card-link">
                                        <div className="list-company-card">
                                            <div className="list-company-detail1">
                                                <img
                                                    alt={company.company}
                                                    src={company.avatar}
                                                    className="company-image"
                                                />
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <Title level={5} style={{ margin: 0 }}>{company.company}</Title>
                                                        {company.isFeatured && <Tag color="red">Featured</Tag>}
                                                    </div>
                                                    <Paragraph style={{ color: 'grey', margin: 0 }}>
                                                        <EnvironmentOutlined /> {company.location}
                                                    </Paragraph>
                                                </div>
                                            </div>
                                            <Title level={3} style={{ marginTop: '15px' }}>{company.title}</Title>
                                            <Paragraph style={{ color: 'grey' }}>
                                                {company.duration} <span>⦁</span> {company.salary}
                                            </Paragraph>
                                        </div>
                                    </a>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <Pagination defaultCurrent={1} total={50} />
                </div>
            </div>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
}

export default FindingCompany;