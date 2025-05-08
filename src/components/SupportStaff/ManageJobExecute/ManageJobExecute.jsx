import React, { useEffect, useState } from 'react';
import './ManageJobExecute.css';
import { Table, Input, Breadcrumb, Button, Tag, Modal, message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { jobExecuteApi } from '../../../apis/job-execute.request';
import { userApi } from '../../../apis/user.request';

// Dữ liệu giả Job Execute
const jobExecuteData = [
    { key: '1', id: '301', assignedDate: '2025-04-20', jobRequirement: 'Setup security zones', workProcess: 50, processCompleted: 50, userName: 'Nguyen Van A' },
    { key: '2', id: '302', assignedDate: '2025-04-21', jobRequirement: 'Manage info desk', workProcess: 50, processCompleted: 50, userName: 'Tran Thi B' },
];

export default function ManageJobExecute() {
    const [searchRequirement, setSearchRequirement] = useState('');
    const { jobGroupId, jobPostingId } = useParams();
    const [jobExecutes, setJobExecutes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchJobExecute = async () => {
            try {
                const res = await jobExecuteApi.getJobExecuteByJobPostingId(jobPostingId);
                console.log(res.data);
                if (res.data.message === "No job execute for this job posting") {
                    setJobExecutes([]);
                } else {
                    const newJobExecutes = await Promise.all(res.data.data.map(async (item) => {
                        const userRes = await userApi.getPublicUserById(item.userId);
                        return {
                            key: item.id, // key cho Table
                            id: item.id,
                            assignedDate: item.assigned_at,
                            jobRequirement: item.note,
                            workProcess: item.work_process,
                            processCompleted: item.processComplete,
                            userName: userRes?.data?.data?.fullName || userRes?.data?.data?.companyName
                        };
                    }))
                    setJobExecutes(newJobExecutes);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJobExecute()
    }, [])
    const getFilteredData = () => {
        return /*jobExecuteData*/jobExecutes.length > 0 ? jobExecutes.filter(item =>
            item.userName.toLowerCase().includes(searchRequirement.toLowerCase())
        ) : [];
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
    };

    const jobExecuteColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Assigned Date', dataIndex: 'assignedDate', key: 'assignedDate' },
        { title: 'User Name', dataIndex: 'userName', key: 'userName' },
        { title: 'Job Requirement', dataIndex: 'jobRequirement', key: 'jobRequirement' },
        {
            title: 'Work Process', dataIndex: 'workProcess', key: 'workProcess',
            render: (value) => (
                <Tag color={value === 100 ? 'green' : 'blue'}>
                    {value}%
                </Tag>
            ),
        },
        {
            title: 'Process Completed',
            dataIndex: 'processCompleted',
            key: 'processCompleted',
            render: (value) => (
                <Tag color={value === 100 ? 'green' : 'blue'}>
                    {value}%
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'edit',
            render: (_, record) => (
                <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
                    Edit
                </Button>
            ),
        },
    ];

    const handleSave = async () => {
        message.loading('Updating...');
        try {
            const payload = {
                processComplete: editingRecord.processCompleted
            };
            await jobExecuteApi.updateJobExecute(editingRecord.id, payload);
            message.destroy();
            message.success('Update successful!');
            setJobExecutes(prev =>
                prev.map(j =>
                    j.id === editingRecord.id ? { ...j, processCompleted: payload.processComplete } : j
                )
            );
            setIsModalVisible(false);
        } catch (error) {
            console.error('Update failed:', error);
            message.destroy();
            message.error('Update failed!');
        }
    }
    return (
        <div className="job-execute-container">
            <div className="job-execute-content">
                <h1>Manage Job Executes</h1>
                <Breadcrumb style={{ marginBottom: '16px' }}>
                    <Breadcrumb.Item
                        onClick={() => navigate(`/support-staff/manage-jobExecute`)}>List Job Groups</Breadcrumb.Item>
                    <Breadcrumb.Item
                        onClick={() => navigate(`/support-staff/manage-jobExecute/${jobGroupId}`, { state: location.state })}>{location.state.title}</Breadcrumb.Item>
                    <Breadcrumb.Item>{location.state.jobPosting.title}</Breadcrumb.Item>
                </Breadcrumb>

                {/* Tìm kiếm theo Job Requirement */}
                <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                    <Input
                        placeholder="Search by name"
                        value={searchRequirement}
                        onChange={(e) => setSearchRequirement(e.target.value)}
                    />
                </div>

                <Table
                    columns={jobExecuteColumns}
                    dataSource={getFilteredData()}
                    pagination={{ pageSize: 4 }}
                    rowClassName="clickable-row"
                />

                <Modal
                    title="Edit Job Execute progress completed"
                    open={isModalVisible}
                    onOk={handleSave}
                    onCancel={() => setIsModalVisible(false)}
                    okText="Save"
                >
                    <div className='modal-create-update-sstaff'>
                        <Input
                            disabled
                            className='input-account'
                            placeholder="Assigned Date"
                            value={editingRecord ? editingRecord.assignedDate : ''}
                            onChange={(e) => setEditingRecord({ ...editingRecord, assignedDate: e.target.value })}
                        />
                        <Input
                            disabled
                            className='input-account'
                            placeholder="User Name"
                            value={editingRecord ? editingRecord.userName : ''}
                            onChange={(e) => setEditingRecord({ ...editingRecord, userName: e.target.value })}
                        />
                        <Input
                            disabled
                            className='input-account'
                            placeholder="Job Requirement"
                            value={editingRecord ? editingRecord.jobRequirement : ''}
                            onChange={(e) => setEditingRecord({ ...editingRecord, jobRequirement: e.target.value })}
                        />
                        <Input
                            disabled
                            className='input-account'
                            placeholder="Work Process"
                            type="number"
                            value={editingRecord ? editingRecord.workProcess : ''}
                            onChange={(e) => setEditingRecord({ ...editingRecord, workProcess: e.target.value })}
                        />
                        <Input
                            className='input-account'
                            placeholder="Process Completed"
                            type="number"
                            value={editingRecord ? editingRecord.processCompleted : ''}
                            onChange={(e) => setEditingRecord({ ...editingRecord, processCompleted: e.target.value })}
                        />
                    </div>
                </Modal>
            </div>
        </div>
    );
}