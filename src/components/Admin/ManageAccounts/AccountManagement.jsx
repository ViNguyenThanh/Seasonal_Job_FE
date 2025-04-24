import React, { useState } from 'react';
import './AccountManagement.css';
import { Table, Tabs, Input, Tag, Button, Space, message, Select } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

// Dữ liệu giả Worker
const workerData = [
  { key: '1', no: 1, fullName: 'Nguyen Van A', email: 'vana@example.com', role: 'worker', address: 'Hanoi', phoneNumber: '0901234567', isVerified: true },
  { key: '2', no: 2, fullName: 'Tran Thi B', email: 'thib@example.com', role: 'worker', address: 'HCM City', phoneNumber: '0902345678', isVerified: false },
  { key: '3', no: 3, fullName: 'Le Van C', email: 'lvc@example.com', role: 'worker', address: 'Da Nang', phoneNumber: '0911111111', isVerified: true },
  { key: '4', no: 4, fullName: 'Pham Thi D', email: 'ptd@example.com', role: 'worker', address: 'Can Tho', phoneNumber: '0922222222', isVerified: false },
  { key: '5', no: 5, fullName: 'Hoang Van E', email: 'hve@example.com', role: 'worker', address: 'Hue', phoneNumber: '0933333333', isVerified: true },
  { key: '6', no: 6, fullName: 'Nguyen Thi F', email: 'ntf@example.com', role: 'worker', address: 'Vinh', phoneNumber: '0944444444', isVerified: false },
];

// Dữ liệu giả Employer
const employerData = [
  { key: '1', no: 1, companyName: 'Tech Corp', email: 'hr@techcorp.com', role: 'employer', address: 'Da Nang', phoneNumber: '0912345678', isVerified: true },
  { key: '2', no: 2, companyName: 'Green Farm', email: 'contact@greenfarm.vn', role: 'employer', address: 'Can Tho', phoneNumber: '0934567890', isVerified: false },
  { key: '3', no: 3, companyName: 'Blue Ocean', email: 'blue@ocean.vn', role: 'employer', address: 'Hanoi', phoneNumber: '0977777777', isVerified: true },
  { key: '4', no: 4, companyName: 'FastTech', email: 'info@fasttech.com', role: 'employer', address: 'HCM', phoneNumber: '0988888888', isVerified: true },
];

// Common columns
const verifiedColumn = {
  title: 'Verified',
  dataIndex: 'isVerified',
  key: 'isVerified',
  render: (isVerified) =>
    isVerified ? <Tag color="green">Verified</Tag> : <Tag color="red">Unverified</Tag>,
};

const actionColumn = {
  title: 'Action',
  key: 'action',
  render: (_, record) => (
    <Space>
      <Button type="primary" size="small" onClick={() => message.info(`Update ${record.email}`)}>Update</Button>
      <Button danger size="small" onClick={() => message.warning(`Banned ${record.email}`)}>Ban</Button>
    </Space>
  ),
};

const workerColumns = [
  { title: 'No.', dataIndex: 'no', key: 'no' },
  { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  verifiedColumn,
  actionColumn,
];

const employerColumns = [
  { title: 'No.', dataIndex: 'no', key: 'no' },
  { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  verifiedColumn,
  actionColumn,
];

export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState('worker');
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  const getFilteredData = (data, isWorker = true) => {
    return data.filter(item => {
      const nameMatch = isWorker
        ? item.fullName.toLowerCase().includes(searchName.toLowerCase())
        : item.companyName.toLowerCase().includes(searchName.toLowerCase());
      const phoneMatch = item.phoneNumber.includes(searchPhone);
      const addressMatch = filterAddress ? item.address === filterAddress : true;
      return nameMatch && phoneMatch && addressMatch;
    });
  };

  const uniqueAddresses = [...new Set([...workerData, ...employerData].map(item => item.address))];

  return (
    <div className="account-management-container">
      <div className="account-management-content">
        <h1>Quản lý tài khoản người dùng</h1>

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
              <Select
                placeholder="Filter by address"
                allowClear
                style={{ width: 200 }}
                value={filterAddress || undefined}
                onChange={(value) => setFilterAddress(value || '')}
              >
                {uniqueAddresses.map((addr) => (
                  <Option key={addr} value={addr}>{addr}</Option>
                ))}
              </Select>
            </div>
            <Table
              columns={workerColumns}
              dataSource={getFilteredData(workerData, true)}
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
              <Select
                placeholder="Filter by address"
                allowClear
                style={{ width: 200 }}
                value={filterAddress || undefined}
                onChange={(value) => setFilterAddress(value || '')}
              >
                {uniqueAddresses.map((addr) => (
                  <Option key={addr} value={addr}>{addr}</Option>
                ))}
              </Select>
            </div>
            <Table
              columns={employerColumns}
              dataSource={getFilteredData(employerData, false)}
              pagination={{ pageSize: 4 }}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
