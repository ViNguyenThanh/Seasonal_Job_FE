import React, { useState } from 'react';
import './SupportStaffJobPosting.css';
import { Table, Input, Breadcrumb } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

// Dữ liệu giả Job Posting
const jobPostingData = [
    { key: '1', id: '201', title: 'Event Security Staff Recruitment For Songkran Festival 2025', participantCount: 4 },
    { key: '2', id: '202', title: 'Information Desk Staff Recruitment For Songkran Festival 2025', participantCount: 2 },
];

// Cột cho Job Posting
const jobPostingColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Job Title', dataIndex: 'title', key: 'title' },
    { title: 'Participants', dataIndex: 'participantCount', key: 'participantCount' },
];

export default function SupportStaffJobPosting() {
    const [searchTitle, setSearchTitle] = useState('');
    const { jobGroupId } = useParams();
    const navigate = useNavigate();

    const getFilteredData = () => {
        return jobPostingData.filter(item =>
            item.title.toLowerCase().includes(searchTitle.toLowerCase())
        );
    };

    const handleRowClick = (record) => {
        navigate(`/support-staff/manage-jobExecute/${jobGroupId}/${record.id}`);
    };

    return (
        <div className="job-posting-execute-container">
            <div className="job-posting-execute-content">
                <h1>Manage Job Postings</h1>
                <Breadcrumb style={{ marginBottom: '16px' }}>
                    <Breadcrumb.Item
                        onClick={() => navigate(`/support-staff/manage-jobExecute`)}>List Job Groups</Breadcrumb.Item>
                    <Breadcrumb.Item>Fashion show 2025</Breadcrumb.Item>
                </Breadcrumb>

                {/* Tìm kiếm theo tên job */}
                <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                    <Input
                        placeholder="Search by job title"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </div>

                <Table
                    columns={jobPostingColumns}
                    dataSource={getFilteredData()}
                    pagination={{ pageSize: 4 }}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    rowClassName="clickable-row"
                />
            </div>
        </div>
    );
}