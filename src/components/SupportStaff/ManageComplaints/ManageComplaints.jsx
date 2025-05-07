import React, { useEffect, useState } from 'react';
import './ManageComplaints.css';
import { EyeOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';
import { Table, Input, Button, Space, message, Modal, Popconfirm, Tag, Image } from 'antd';
import { complaintApi } from '../../../apis/complaint.request';
import { userApi } from '../../../apis/user.request';

// Dữ liệu giả Complaints
const complaintData = [
    { key: '1', no: 1, email: 'lanngoc@gmail.com', type: 'Job Execute Edit Request', description: 'At the Job Posting "Even Art" of Job Group "Fashion Show 2025", Due to the deadline for editing the completion progress of the worker, I would like to change the progress of worker "Dao Lan Ngoc" on April 27, 2025 to 25%.', images: ['https://res.cloudinary.com/do9g6j7jw/image/upload/v1745703038/file_qrswcb.png', 'https://res.cloudinary.com/do9g6j7jw/image/upload/v1745575877/file_leiguu.png'], status: 'pending' },
    { key: '2', no: 2, email: 'ngocdl2110@example.com', type: 'Job Execute Edit Request', description: 'Sending unwanted messages', images: ['image3.jpg'], status: 'rejected' },
    { key: '3', no: 3, email: 'ngocdl2110@example.com', type: 'Job Execute Edit Request', description: 'Inappropriate behavior', images: [], status: 'pending' },
    { key: '4', no: 4, email: 'ngocdl2110@example.com', type: 'Job Execute Edit Request', description: 'Harassing other users', images: ['image4.jpg'], status: 'accepted' },
];

export default function ComplaintManagement() {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchType, setSearchType] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await complaintApi.getComplaints();
                // console.log(res);
                if (res.data.data.length > 0) {
                    const sortedComplaints = res.data.data.sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateB - dateA; // Sắp xếp theo ngày tăng dần
                    })
                    const newComplaints = sortedComplaints.map((item, index) => {
                        return {
                            key: item.id,
                            no: index + 1,
                            email: item.User.email,
                            type: item.type,
                            description: item.description,
                            images: item.image
                                ? (typeof item.image === 'string' ? JSON.parse(item.image) : item.image)
                                : [],
                            status: item.status
                        }
                    });
                    console.log(newComplaints);
                    
                    setComplaints(newComplaints);
                }
            } catch (error) {
                setComplaints([]);
                console.error('Error fetching complaints:', error);
            }
        }
        fetchComplaints();
    }, []);

    const getFilteredData = () => {
        return /*complaintData*/complaints.length > 0 ? complaints.filter(item => {
            const emailMatch = item.email.toLowerCase().includes(searchEmail.toLowerCase());
            const typeMatch = item.type.toLowerCase().includes(searchType.toLowerCase());
            return emailMatch && typeMatch;
        }) : [];
    };

    const handleViewDetails = (record) => {
        setModalData(record);
        setIsModalVisible(true);
    };

    const actionColumn = {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space>
                <Button
                    icon={<EyeOutlined />}
                    type=""
                    size="small"
                    onClick={() => handleViewDetails(record)}
                >
                </Button>
            </Space>
        ),
    };

    // Cột cho Complaints
    const complaintColumns = [
        { title: 'No.', dataIndex: 'no', key: 'no' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                if (status === 'pending') color = 'blue';
                if (status === 'accepted') color = 'green';
                if (status === 'rejected') color = 'red';

                return <Tag color={color}>{status}</Tag>;
            },
        },
        actionColumn,
    ];

    const handleSave = (status) => {
        const updatedComplaintData = complaintData.map((item) => {
            if (item.key === modalData.key) {
                return { ...item, status }; // Update status to 'Accepted' or 'Rejected'
            }
            return item;
        });
        // Here, you would update the complaintData with the new status
        message.success(`Complaint ${status.toLowerCase()} for ${modalData.email}`);
        setIsModalVisible(false); // Close the modal
    };

    return (
        <div className="account-management-container">
            <div className="account-management-content">
                <h1>Manage Complaints</h1>

                <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                    <Input
                        placeholder="Search by email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Search by type"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    />
                </div>

                <Table
                    columns={complaintColumns}
                    dataSource={getFilteredData()}
                    pagination={{ pageSize: 4 }}
                />
            </div>

            {/* Modal for View Complaint Details */}
            <Modal
                title="Complaint Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    modalData?.status === 'pending' && (
                        <Button
                            key="accept"
                            icon={<CheckOutlined />}
                            type="primary"
                            onClick={() => handleSave('accepted')}
                        >
                            Accept
                        </Button>
                    ),
                    modalData?.status === 'pending' && (
                        <Button
                            key="reject"
                            icon={<StopOutlined />}
                            danger
                            onClick={() => handleSave('rejected')}
                        >
                            Reject
                        </Button>
                    ),
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                ]}
            >
                <div>
                    <p><strong>Email:</strong> {modalData?.email}</p>
                    <p><strong>Type:</strong> {modalData?.type}</p>
                    <p><strong>Description:</strong></p>
                    <p>
                        {modalData?.description?.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>

                    {modalData?.type !== 'WITHDRAWAL' && modalData?.images?.length > 0 && (
                        <div>
                            <strong>Images:</strong>
                            <div>
                                {modalData?.images?.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        style={{ width: '50px', height: '50px', marginRight: '8px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
