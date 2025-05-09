import React, { useEffect, useState } from 'react';
import './ManageJobExecute.css';
import { Table, Input, Breadcrumb, Button, Tag, Modal, message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
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
    const [isModalViewVisible, setIsModalViewVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchJobExecute = async () => {
            try {
                const res = await jobExecuteApi.getJobExecuteByJobPostingId(jobPostingId);
                // console.log(res.data);
                if (res.data.message === "No job execute for this job posting") {
                    setJobExecutes([]);
                } else {
                    let number = 0;
                    const newJobExecutes = await Promise.all(res.data.data.map(async (item, index) => {
                        const userRes = await userApi.getPublicUserById(item.userId);
                        if (userRes.data.data.role === "worker") {
                            number += 1
                            return {
                                key: item.id,
                                no: number,
                                id: item.id,
                                assignedDate: item.assigned_at,
                                jobRequirement: item.note,
                                workProcess: item.work_process,
                                processCompleted: item.processComplete,
                                userName: userRes?.data?.data?.fullName || '',
                                reason: item.reason
                            };
                        }
                    }))
                    setJobExecutes(newJobExecutes.filter(Boolean));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJobExecute()
    }, [])
    const getFilteredData = () => {
        return /*jobExecuteData*/jobExecutes.length > 0 ? jobExecutes.filter(item =>
            item?.userName?.toLowerCase().includes(searchRequirement.toLowerCase())
        ) : [];
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
        setIsModalViewVisible(true);
    };

    const jobExecuteColumns = [
        { title: 'No.', dataIndex: 'no', key: 'no' },
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
                location.state.jobGroup.status === "active" ? (
                    <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                ) : (
                    <Button icon={<EyeOutlined />} type="link" onClick={() => handleView(record)}></Button>
                )
            ),
        },
    ];

    const handleSave = async () => {
        message.loading('Updating...');
        try {
            console.log(editingRecord);
            
            if(editingRecord.workProcess < editingRecord.processCompleted) {
                message.destroy();
                message.error('Process completed must be less than work process');
                return
            }
            if(editingRecord.processCompleted < editingRecord.workProcess && !editingRecord.reason) {
                message.destroy();
                message.error('Reason is required when process completed is less than work process');
                return
            }
            
            const payload = {
                processComplete: editingRecord.processCompleted,
                reason: editingRecord.processCompleted === editingRecord.workProcess ? '' : editingRecord.reason
            };
            await jobExecuteApi.updateJobExecute(editingRecord.id, payload);
            message.destroy();
            message.success('Update successful!');
            setJobExecutes(prev =>
                prev.map(j =>
                    j.id === editingRecord.id ? { ...j, processCompleted: payload.processComplete, reason: payload.reason } : j
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
                        onClick={() => navigate(`/support-staff/manage-jobExecute/${jobGroupId}`, { state: { jobGroup: location.state } })}>{location.state.jobGroup.title}</Breadcrumb.Item>
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
                    onCancel={() => {
                        setIsModalVisible(false)
                        setIsModalViewVisible(false);
                    }}
                    okText={isModalViewVisible ? 'OK' : 'Save'}
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
                            value={editingRecord ? editingRecord.workProcess : 0}
                            onChange={(e) => setEditingRecord({ ...editingRecord, workProcess: e.target.value })}
                        />
                        <Input
                            className='input-account'
                            placeholder="Process Completed"
                            type="number"
                            max={editingRecord.workProcess}
                            min={0}
                            disabled={isModalViewVisible}
                            value={editingRecord ? editingRecord.processCompleted : 0}
                            onChange={(e) => setEditingRecord({ ...editingRecord, processCompleted: Number(e.target.value) })}
                        />
                        {editingRecord.workProcess > editingRecord.processCompleted &&
                            <Input
                                className='input-account'
                                placeholder="Reason"
                                type="text"
                                disabled={isModalViewVisible}
                                value={editingRecord ? editingRecord.reason : ''}
                                onChange={(e) => setEditingRecord({ ...editingRecord, reason: e.target.value})}
                            />
                        }
                    </div>
                </Modal>
            </div>
        </div>
    );
}