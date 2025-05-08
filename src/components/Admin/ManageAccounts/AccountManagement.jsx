import React, { useEffect, useState } from 'react';
import './AccountManagement.css';
import { EditOutlined, StopOutlined } from '@ant-design/icons';
import { Table, Tabs, Input, Tag, Button, Space, message, Select, Modal, Popconfirm } from 'antd';
import { userApi } from '../../../apis/user.request';
import { authApi } from '../../../apis/auth.request';

const { TabPane } = Tabs;

// Dữ liệu giả Worker
const workerData = [
  { key: '1', no: 1, fullName: 'Đào Lan Ngọc', email: 'lanngoc@gmail.com', status: 'active', address: 'Số 123, Phố Nguyễn Trãi, Quận Thanh Xuân, Hà Nội', phoneNumber: '0987654321', isVerified: true },
  { key: '2', no: 2, fullName: 'Trần Thị Mai', email: 'thimai@gmail.com', status: 'banned', address: 'Số 45, Đường Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh', phoneNumber: '0934567890', isVerified: false },
  { key: '3', no: 3, fullName: 'Lê Quang Hiếu', email: 'hieuq@gmail.com', status: 'banned', address: 'Số 67, Phố Hải Châu, Quận Hải Châu, Đà Nẵng', phoneNumber: '0912345678', isVerified: true },
  { key: '4', no: 4, fullName: 'Đào Lan Ngọc', email: 'ngocdl2110@gmail.com', status: 'active', address: 'Số 30, Đường Lý Thái Tổ, Quận Ninh Kiều, Cần Thơ', phoneNumber: '0923456789', isVerified: false },
  { key: '5', no: 5, fullName: 'Hoàng Anh Tú', email: 'tuanh@gmail.com', status: 'banned', address: 'Số 101, Đường Lê Lợi, Quận Thành phố Huế, Thừa Thiên Huế', phoneNumber: '0945678901', isVerified: true },
  { key: '6', no: 6, fullName: 'Nguyễn Lan Chi', email: 'chi.nguyen@gmail.com', status: 'active', address: 'Số 89, Phố Trường Chinh, Thành phố Vinh, Nghệ An', phoneNumber: '0909876543', isVerified: false },
];

// Dữ liệu giả Employer
const employerData = [
  { key: '1', no: 1, companyName: 'Tech Corp', email: 'employer@gmail.com', status: 'active', address: 'Da Nang', phoneNumber: '0912345678', isVerified: true },
  { key: '2', no: 2, companyName: 'Green Farm', email: 'contact@gmail.com', status: 'active', address: 'Can Tho', phoneNumber: '0934567890', isVerified: false },
  { key: '3', no: 3, companyName: 'Blue Ocean', email: 'blue@gmail.com', status: 'active', address: 'Hanoi', phoneNumber: '0977777777', isVerified: true },
  { key: '4', no: 4, companyName: 'FastTech', email: 'info@gmail.com', status: 'active', address: 'HCM', phoneNumber: '0988888888', isVerified: true },
];

const supportStaffData = [
  { key: '1', no: 1, fullName: 'Cao Huỳnh Anh Kiệt', email: 'sjcp123sstaff@gmail.com', status: 'active', address: 'Da Nang', phoneNumber: '0912345678', isVerified: true },
  { key: '2', no: 2, fullName: 'Nguyễn Thị Mai', email: 'mai.nt@gmail.com', status: 'banned', address: 'Da Nang', phoneNumber: '0934567890', isVerified: false },
];

const statusColumn = {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  render: (status) =>
    status === 'active' ? <Tag color="blue">Active</Tag> :
      status === 'banned' ? <Tag color="red">Banned</Tag> : <Tag color="default">Pending</Tag>,
};

const verifiedColumn = {
  title: 'Verified',
  dataIndex: 'isVerified',
  key: 'isVerified',
  render: (isVerified) =>
    isVerified ? <Tag color="green">Verified</Tag> : <Tag color="red">Unverified</Tag>,
};

export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState('worker');
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [supportStaffs, setSupportStaffs] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await userApi.getAllUsers();
        // console.log(res.data);
        if (res.data.data.length > 0) {
          const newWorkers = res.data.data
            .filter(user => user.role === 'worker')
            .map(user => ({ ...user, key: user.id }));

          const newEmployers = res.data.data
            .filter(user => user.role === 'employer')
            .map(user => ({ ...user, key: user.id }));

          const newSupportStaffs = res.data.data
            .filter(user => user.role === 'support staff')
            .map(user => ({ ...user, key: user.id }));

          setWorkers(newWorkers);
          setEmployers(newEmployers);
          setSupportStaffs(newSupportStaffs);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }
    fetchAccounts()
  }, []);

  const getFilteredData = (data, isWorker = true) => {
    return data.filter(item => {
      const nameMatch = isWorker
        ? item.fullName.toLowerCase().includes(searchName.toLowerCase())
        : item.companyName.toLowerCase().includes(searchName.toLowerCase());
      const phoneMatch = (item.phoneNumber || '').includes(searchPhone);
      return nameMatch && phoneMatch;
    });
  };

  const handleEdit = (record) => {
    setModalData(record);
    setIsModalVisible(true);
    setIsCreateAccount(false);
  };

  const handleCreateAccount = () => {
    setModalData(null);
    setIsModalVisible(true);
    setIsCreateAccount(true);
  };

  const handleSave = async () => {
    message.loading('Saving...');
    try {
      if (isCreateAccount) {
        const payload = {
          ...modalData,
          role: 'support staff',
        };
        await authApi.register(payload);
        message.destroy();
        message.success('Support staff account created successfully');
        setSupportStaffs(prev => [...prev, { ...payload, id: Date.now(), status: 'pending', isVerified: false }]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving account:', error);
      message.destroy();
      message.error('Failed to save support staff account');
    }
  };

  const handleBan = async (record) => {
    try {
      const res = await userApi.banUser(record.id);
      const updateUserStatus = (list) =>
        list.map(user =>
          user.id === record.id ? { ...user, status: 'banned' } : user
        );

      if (record.role === 'worker') {
        setWorkers(prev => updateUserStatus(prev));
      } else if (record.role === 'employer') {
        setEmployers(prev => updateUserStatus(prev));
      } else if (record.role === 'support staff') {
        setSupportStaffs(prev => updateUserStatus(prev));
      }

      message.success('Ban successfully!');
    } catch (error) {
      message.error('Ban failed!');
    }
  }

  const sstaffActionColumn = {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space>
        {/* <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => handleEdit(record)}></Button> */}
        <Popconfirm
          title="Are you sure to ban this Account?"
          onConfirm={() => handleBan(record)}
        >
          <Button icon={<StopOutlined />} danger size="small"></Button>
        </Popconfirm>
      </Space>
    ),
  };

  const supportStaffColumns = [
    {
      title: 'No.', dataIndex: 'no', key: 'no',
      render: (_, record, index) => (
        <div>{index + 1}</div>
      )
    },
    { title: 'full name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    statusColumn,
    {
      title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber',
      render: (_, record) => (
        <div>{record.phoneNumber ? record.phoneNumber : 'N/A'}</div>
      )
    },
    {
      title: 'Address', dataIndex: 'address', key: 'address',
      render: (_, record) => (
        <div>{record.address ? record.address : 'N/A'}</div>
      )
    },
    verifiedColumn,
    sstaffActionColumn,
  ];

  const actionColumn = {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Popconfirm
        title="Are you sure to ban this Account?"
        onConfirm={() => handleBan(record)}
      >
        <Button icon={<StopOutlined />} danger size="small"></Button>
      </Popconfirm>
    ),
  };

  const workerColumns = [
    {
      title: 'No.', dataIndex: 'no', key: 'no',
      render: (_, record, index) => (
        <div>{index + 1}</div>
      )
    },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    statusColumn,
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <div>{record.address ? record.address : 'N/A'}</div>
      )
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (_, record) => (
        <div>{record.phoneNumber ? record.phoneNumber : 'N/A'}</div>
      )
    },
    verifiedColumn,
    actionColumn,
  ];

  const employerColumns = [
    {
      title: 'No.', dataIndex: 'no', key: 'no',
      render: (_, record, index) => (
        <div>{index + 1}</div>
      )
    },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    statusColumn,
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <div>{record.address ? record.address : 'N/A'}</div>
      )
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (_, record) => (
        <div>{record.phoneNumber ? record.phoneNumber : 'N/A'}</div>
      )
    },
    verifiedColumn,
    actionColumn,
  ];

  return (
    <div className="account-management-container">
      <div className="account-management-content">
        <h1>Manage Accounts</h1>

        <Tabs type="card" activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Worker" key="worker">
            <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
              <Input
                placeholder="Search by full name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <Table
              columns={workerColumns}
              dataSource={getFilteredData(/*workerData*/workers, true)}
              pagination={{ pageSize: 4 }}
            />
          </TabPane>

          <TabPane tab="Employer" key="employer">
            <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 14 }}>
              <Input
                placeholder="Search by company name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <Table
              columns={employerColumns}
              dataSource={getFilteredData(/*employerData*/employers, false)}
              pagination={{ pageSize: 4 }}
            />
          </TabPane>

          <TabPane tab="Support Staff" key="supportStaff">
            <div className="search" style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
              <Input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
              <Input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <Button type="primary" onClick={handleCreateAccount}>Create Account</Button>
            <Table columns={supportStaffColumns} dataSource={getFilteredData(/*supportStaffData*/supportStaffs)} pagination={{ pageSize: 4 }} />
          </TabPane>
        </Tabs>

        {/* Modal for Create Account */}
        <Modal
          title={!isCreateAccount ? 'Edit Support Staff Account' : 'Create Support Staff Account'}
          open={isModalVisible}
          onOk={handleSave}
          onCancel={() => setIsModalVisible(false)}
        >
          <div className='modal-create-update-sstaff'>
            <Input
              className='input-account'
              placeholder="Full Name"
              value={modalData ? modalData.fullName : ''}
              onChange={(e) => setModalData({ ...modalData, fullName: e.target.value })}
            />
            <Input
              className='input-account'
              placeholder="Email"
              disabled={!isCreateAccount}
              value={modalData ? modalData.email : ''}
              onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
            />
            {isCreateAccount && (
              <>
                <Input.Password
                  className='input-account'
                  placeholder="Password"
                  value={modalData ? modalData.password : ''}
                  onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                />
              </>
            )}
            <Input
              className='input-account'
              placeholder="Phone Number"
              value={modalData ? modalData.phoneNumber : ''}
              onChange={(e) => setModalData({ ...modalData, phoneNumber: e.target.value })}
            />
            <Input
              className='input-account'
              placeholder="Address"
              value={modalData ? modalData.address : ''}
              onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
