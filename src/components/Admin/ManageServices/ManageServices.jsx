import React, { useEffect, useState } from 'react';
import './ManageServices.css';
import { Table, Input, Button, Space, Tag, Modal, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import { serviceApi } from '../../../apis/service.request';

export default function ManageServices() {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPrice, setSearchPrice] = useState('');
    const [services, setServices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [editStatus, setEditStatus] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await serviceApi.getServices(); // Gọi API
                console.log(res.data);

                if (res.data.length > 0) {
                    const newServices = res.data.map((item, index) => ({
                        key: item.id,
                        no: index + 1,
                        userId: item.userId,
                        name: item.name,
                        email: item.User?.email || 'N/A',
                        price: parseFloat(item.price).toLocaleString('vi-VN'),
                        description: item.description,
                        status: item.status,
                    }));
                    setServices(newServices);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                setServices([]);
            }
        };
        fetchServices();
    }, []);

    const getFilteredData = () => {
        return services.filter(item => {
            const emailMatch = item.email.toLowerCase().includes(searchEmail.toLowerCase());
            const priceMatch = item.price.toString().includes(searchPrice);
            return emailMatch && priceMatch;
        });
    };

    const handleEdit = async (record) => {
        setModalData(record);
        setIsModalVisible(true);
        setEditStatus(record.status);
    }

    const handleDelete = async (record) => {
        message.loading('Deleting...');
        try {
            await serviceApi.deleteService(record.key);
            setServices(services.filter(item => item.key !== record.key));
            message.destroy();
            message.success('Delete successfully!');
        } catch (error) {
            console.error('Error deleting service:', error);
            message.destroy();
            message.error('Delete failed!');
        }
    }


    const handleUpdateStatus = async () => {
        try {
            message.loading('Updating...');
            await serviceApi.updateService(modalData.key, { status: editStatus });
            const updatedList = services.map(item =>
                item.key === modalData.key ? { ...item, status: editStatus } : item
            );
            setServices(updatedList);
            setIsModalVisible(false);
            message.destroy();
            message.success('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            message.destroy();
            message.error('Update failed!');
        }
    };

    const columns = [
        { title: 'No.', dataIndex: 'no', key: 'no' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Service Name', dataIndex: 'name', key: 'name' },
        { title: 'Price (VND)', dataIndex: 'price', key: 'price' },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <div>{description} Months</div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => handleEdit(record)}></Button>
                    <Popconfirm
                        title="Are you sure to delete this service?"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button icon={<DeleteOutlined />} danger size="small"></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="account-management-container">
            <div className="account-management-content">
                <h1>Manage Services</h1>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
                    <Input
                        placeholder="Search by User Email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Search by Price"
                        value={searchPrice}
                        onChange={(e) => setSearchPrice(e.target.value)}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={getFilteredData()}
                    pagination={{ pageSize: 5 }}
                />
            </div>

            <Modal
                title="Service Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                    <Button key="save" type="primary" onClick={handleUpdateStatus}>
                        Save
                    </Button>
                ]}
            >
                {modalData && (
                    <div>
                        <p><strong>User:</strong> {modalData.email}</p>
                        <p><strong>Service Name:</strong> {modalData.name}</p>
                        <p><strong>Price:</strong> {modalData.price}</p>
                        <p><strong>Description:</strong> {modalData.description}</p>

                        <div style={{ marginTop: 16 }}>
                            <p><strong>Status:</strong></p>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                style={{ padding: '5px', width: '50%' }}
                            >
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
