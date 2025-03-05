import React, { useState } from "react";
import "./FindingWorker.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Select, Space, Button, Slider, Card, Radio, Checkbox, Row, Col } from "antd";
import { SearchOutlined, EnvironmentOutlined, ContainerOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import { Flex } from 'antd';
import { ArrowRightOutlined } from "@ant-design/icons";
import { FilterOutlined } from "@ant-design/icons";
import { Pagination } from 'antd';

const { Option } = Select;

const FindingWorker = () => {
    // State for candidate data
    const [candidates, setCandidates] = useState([
        {
            name: "Jane Cooper",
            title: "Senior UX Designer",
            location: "New York",
            experience: "3 Years experience",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            name: "John Doe",
            title: "Software Engineer",
            location: "San Francisco",
            experience: "5 Years experience",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            name: "Alice Smith",
            title: "Product Manager",
            location: "Los Angeles",
            experience: "7 Years experience",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            name: "Bob Johnson",
            title: "Data Scientist",
            location: "Chicago",
            experience: "4 Years experience",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        },
        {
            name: "Eve Adams",
            title: "Marketing Specialist",
            location: "Miami",
            experience: "6 Years experience",
            avatar: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
            isSaved: false
        }
    ]);

    const handleSaveClick = (index) => {
        const newCandidates = [...candidates];
        newCandidates[index].isSaved = !newCandidates[index].isSaved;
        setCandidates(newCandidates);
    };

    // Slider
    const [radius, setRadius] = useState(32);
    const handleSliderChange = (value) => {
        setRadius(value);
    };

    // Radio Candidate Level
    const styleRadio = {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    };
    const [valueCandidateLevel, setValueCandidateLevel] = useState(1);
    const onChangeCandidateLevel = (e) => {
        setValueCandidateLevel(e.target.value);
    };
    // Radio Experience
    const [valueExperience, setValueExperience] = useState(4);
    const onChangeExperience = (e) => {
        setValueExperience(e.target.value);
    };

    // Checkbox Education
    const onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };
    const plainOptions = ['All', 'High School', 'Intermediate', 'Graduation', 'Master Degree', 'Bachelor Degree'];
    const styleCheckboxGroup = {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    };
    const checkboxStyle = {
        fontSize: '18px',
    };

    // Radio Gender
    const [valueGender, setValueGender] = useState(1);
    const onChangeGender = (e) => {
        setValueGender(e.target.value);
    }

    return (
        <div className="finding-worker-whole-container">
            <Header />
            <div className="finding-worker-container">
                <div className="search-filter-layer1">
                    <p className="ebc-p">Find Workers</p>
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
                                    height: '50px'
                                }}>Find Job</Button>
                            </Flex>
                        </Space.Compact>
                    </div>
                </div>

                <Row justify="space-between" align="middle" style={{ marginTop: '30px' }}>
                    <Col>
                        <Button type="primary" icon={<FilterOutlined />} style={{ padding: '20px', marginLeft: '30px' }}>
                            Filter
                        </Button>
                    </Col>
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

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={7}>
                        <div className="filter-open-layer">
                            <p className="ebc-p">Location Radius: <span style={{ color: '#187bcd' }}>{radius} miles</span></p>
                            <Slider
                                defaultValue={32}
                                onChange={handleSliderChange}
                                style={{ width: '100%' }}
                            />

                            <p className="ebc-p2">Candidate Level</p>
                            <Radio.Group
                                style={styleRadio}
                                onChange={onChangeCandidateLevel}
                                value={valueCandidateLevel}
                            >
                                <Radio value={1} style={{ fontSize: '18px' }}>Entry Level</Radio>
                                <Radio value={2} style={{ fontSize: '18px' }}>Mid Level</Radio>
                                <Radio value={3} style={{ fontSize: '18px' }}>Expert Level</Radio>
                            </Radio.Group>

                            <p className="ebc-p2">Experiences</p>
                            <Radio.Group
                                style={styleRadio}
                                onChange={onChangeExperience}
                                value={valueExperience}
                            >
                                <Radio value={1} style={{ fontSize: '18px' }}>Freshers</Radio>
                                <Radio value={2} style={{ fontSize: '18px' }}>1 - 2 Years</Radio>
                                <Radio value={3} style={{ fontSize: '18px' }}>2 - 4 Years</Radio>
                                <Radio value={4} style={{ fontSize: '18px' }}>4 - 6 Years</Radio>
                                <Radio value={5} style={{ fontSize: '18px' }}>6 - 8 Years</Radio>
                                <Radio value={6} style={{ fontSize: '18px' }}>8 - 10 Years</Radio>
                                <Radio value={7} style={{ fontSize: '18px' }}>10 - 15 Years</Radio>
                                <Radio value={8} style={{ fontSize: '18px' }}>15+ Years</Radio>
                            </Radio.Group>

                            <p className="ebc-p2">Education</p>
                            <Checkbox.Group style={styleCheckboxGroup} defaultValue={['Graduation']} onChange={onChange}>
                                {plainOptions.map(option => (
                                    <Checkbox key={option} value={option} style={checkboxStyle}>
                                        {option}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>

                            <p className="ebc-p2">Gender</p>
                            <Radio.Group
                                style={styleRadio}
                                onChange={onChangeGender}
                                value={valueGender}
                            >
                                <Radio value={1} style={{ fontSize: '18px' }}>Male</Radio>
                                <Radio value={2} style={{ fontSize: '18px' }}>Female</Radio>
                                <Radio value={3} style={{ fontSize: '18px' }}>Other</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col xs={24} md={17}>
                        <div style={{ marginTop: '30px' }}>
                            {candidates.map((candidate, index) => (
                                <Flex key={index} gap="middle" align="start" vertical style={{ marginBottom: '20px' }}>
                                    <Card
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        <Card.Meta
                                            avatar={<img alt="example" src={candidate.avatar} style={{ width: 96, height: 96, borderRadius: "10px" }} />}
                                            title={candidate.name}
                                            description={
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <p style={{ marginTop: '-15px' }}>{candidate.title}</p>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <Button
                                                                type={candidate.isSaved ? "primary" : "default"}
                                                                shape="rectangle"
                                                                style={{ width: '18%', height: '40px' }}
                                                                onClick={() => handleSaveClick(index)}
                                                            >
                                                                <BookOutlined />
                                                            </Button>
                                                            <Button
                                                                type="primary"
                                                                className="view-profile-button"
                                                                style={{ width: '180px', height: '40px' }}
                                                            >
                                                                View Profile <ArrowRightOutlined />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <span><EnvironmentOutlined /> {candidate.location}</span>
                                                        <span><ClockCircleOutlined /> {candidate.experience}</span>
                                                    </div>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Flex>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Pagination defaultCurrent={1} total={50} />
                        </div>
                    </Col>
                </Row>
            </div>
            <Footer />
        </div>
    );
};

export default FindingWorker;