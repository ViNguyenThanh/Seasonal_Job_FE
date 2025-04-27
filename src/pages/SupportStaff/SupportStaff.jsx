import React, { useState } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    ProfileOutlined,
    CommentOutlined
} from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, Space, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './SupportStaff.css'
import logo from '/assets/logo.png'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/auth.action';

const { Header, Sider, Content } = Layout;

const theme = {
    components: {
        Menu: {
            colorText: '#ffffff',
            itemSelectedColor: '#ffffff',
        }
    }
};

const items = [
    {
        key: "complaint",
        icon: <CommentOutlined />,
        label: "Manage Complaints",
        route: "manage-complaints",
    },
    {
        key: "jobexecute",
        icon: <ProfileOutlined />,
        label: "Manage Job Execute",
        route: "manage-jobExecute",
    }
]

const siderStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    backgroundColor: '#003366',
};

const headerStyle = {
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    // backgroundColor: '#f1f9ff',  // Light blue background for header
    backgroundColor: '#ffffff',
};

export default function SupportStaff() {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();

    const selectedKey = items.find((item) =>
        location.pathname.includes(item.route)
    )?.key;

    const handleMenuClick = (e) => {
        let selectedItem;
        items.forEach((item) => {
            if (item.key === e.key) {
                selectedItem = item;
            }
            if (item.children) {
                item.children.forEach((child) => {
                    if (child.key === e.key) {
                        selectedItem = child;
                    }
                })
            }
        })
        if (selectedItem?.route) {
            navigate(`/support-staff/${selectedItem.route}`);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        message.success("Log out successfully!");
        navigate("/")
    }

    const listDropdown = [
        {
            label: "Log out",
            key: '1',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <div className="support-staff-whole-container">
            <ConfigProvider theme={theme}> {/* Áp dụng theme ở đây */}
                <Layout hasSider className='support-staff-container'>
                    <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
                        <div className="header-support-staff">
                            {!collapsed ? <img src={logo} className='logo' /> : <></>}
                        </div>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[selectedKey]}
                            style={{
                                height: '100%',
                                outline: 'none',
                                backgroundColor: '#003366',
                            }}
                            onClick={handleMenuClick}
                            items={items}
                        />
                    </Sider>

                    <Layout style={{
                        marginInlineStart: collapsed ? "80px" : '200px',
                        backgroundColor: '#dfedff',
                    }}>
                        <Header
                            style={headerStyle}
                        // style={{
                        //     padding: 0,
                        //     // background: colorBgContainer,
                        //     display: 'flex',
                        //     justifyContent: 'space-betwee n'
                        // }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown menu={{ items: listDropdown }} trigger={['click']} className='dropdown' >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar
                                            src={
                                                "https://cdn-media.sforum.vn/storage/app/media/THANHAN/avatar-trang-98.jpg"
                                            }
                                            style={{ cursor: "pointer", width: '40px', height: '40px', marginRight: '20px' }}
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Header>
                        <Content>
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </div>

    )
}
