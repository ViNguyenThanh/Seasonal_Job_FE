import React, { useState } from 'react';
import './SupportStaffJobGroup.css';
import { Table, Input, Button, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng sang trang chi tiết

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
    { title: 'Employer', dataIndex: 'employer', key: 'employer' },
];

export default function SupportStaffJobGroup() {
    const [searchTitle, setSearchTitle] = useState('');
    const [searchEmployer, setSearchEmployer] = useState('');
    const navigate = useNavigate(); // Dùng để điều hướng

    // Hàm lọc dữ liệu
    const getFilteredData = () => {
        return jobData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTitle.toLowerCase());
            const employerMatch = item.employer.toLowerCase().includes(searchEmployer.toLowerCase());
            return titleMatch && employerMatch;
        });
    };

    // Hàm chuyển đến trang chi tiết của job khi click vào một dòng
    const handleRowClick = (record) => {
        navigate(`/support-staff/manage-jobExecute/${record.id}`); // Điều hướng sang trang chi tiết với ID job
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
                    <Input
                        placeholder="Search by employer"
                        value={searchEmployer}
                        onChange={(e) => setSearchEmployer(e.target.value)}
                    />
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
