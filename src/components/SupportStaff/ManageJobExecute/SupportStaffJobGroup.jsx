import React, { useEffect, useState } from 'react';
import './SupportStaffJobGroup.css';
import { Table, Input, Button, Tag, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng sang trang chi tiết
import { jobGroupApi } from '../../../apis/job-group.request';

// Dữ liệu giả Job Execute
const jobData = [
    { key: '1', id: '101', title: 'Fashion Show 2025', status: 'active', employer: 'Nguyễn Minh Tú' },
    { key: '2', id: '102', title: 'Even Art Job', status: 'active', employer: 'Trần Thị Mai' },
    { key: '3', id: '103', title: 'Web Development Project', status: 'active', employer: 'Lê Quang Hiếu' },
    { key: '4', id: '104', title: 'Digital Marketing Campaign', status: 'active', employer: 'Phạm Thùy Hằng' },
];

// Cột cho Job Execute
const jobColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'No. Jobs', dataIndex: 'numberOfJobPosting', key: 'numberOfJobPosting' },
    {
        title: 'Paid',
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (value) => (
            <Tag color={value ? 'blue' : 'red'}>
                {value ? 'Is paid' : 'Not paid'}
            </Tag>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value) => (
            <Tag color={value === 'active' ? 'blue' : value === 'inactive' ? 'red' : 'green'}>
                {value}
            </Tag>
        ),
    },
];

export default function SupportStaffJobGroup() {
    const [searchTitle, setSearchTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [jobGroups, setJobGroups] = useState([]);
    const navigate = useNavigate(); // Dùng để điều hướng

    useEffect(() => {
        const fetchJobGroups = async () => {
            try {
                const res = await jobGroupApi.getAllJobGroups('', '');
                // console.log(res.data);

                if (res.data.data.length > 0) {
                    const newJobGroups = res.data.data.map(jobGroup => {
                        return {
                            key: jobGroup.id,
                            id: jobGroup.id,
                            title: jobGroup.title,
                            isPaid: jobGroup.isPaid,
                            status: jobGroup.status,
                            numberOfJobPosting: jobGroup.JobPostings.length,
                            jobPostings: jobGroup.JobPostings,
                            createdAt: jobGroup.createdAt
                        }
                    });
                    console.log(newJobGroups);
                    

                    const sorted = newJobGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setJobGroups(sorted);
                }
            } catch (error) {
                console.error('Failed to fetch job groups', error);
            }
        }
        fetchJobGroups();
    }, [])

    // Hàm lọc dữ liệu
    const getFilteredData = () => {
        return /*jobData*/jobGroups.length > 0 ? jobGroups.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTitle.toLowerCase());
            const statusMatch = filterStatus === 'all' || item.status === filterStatus;
            return titleMatch && statusMatch;
        }) : [];
    };

    // Hàm chuyển đến trang chi tiết của job khi click vào một dòng
    const handleRowClick = (record) => {
        navigate(`/support-staff/manage-jobExecute/${record.id}`, { state: record }); // Điều hướng sang trang chi tiết với ID job
    };

    return (
        <div className="job-group-execute-container">
            <div className="job-group-execute-content">
                <h1>Manage Job Executions</h1>

                {/* Tìm kiếm theo title và employer */}
                <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                    <Input
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                    <Select
                        value={filterStatus}
                        onChange={(value) => setFilterStatus(value)}
                        style={{ width: 200 }}
                    >
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                    </Select>

                </div>

                <Table
                    columns={jobColumns}
                    dataSource={getFilteredData()}
                    pagination={{ pageSize: 4 }}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                />
            </div>
        </div>
    );
}
