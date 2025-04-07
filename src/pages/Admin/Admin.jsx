import React, { useState } from 'react'
import {
    HomeFilled,
    SnippetsOutlined,
    ProductOutlined,
    BaiduOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, Space, message, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css'
import logo from '/assets/logo.png'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/auth.action';

const { Header, Sider, Content } = Layout;

const items = [
    {
        key: "home",
        icon: <HomeFilled />,
        label: "Trang chủ",
        route: "admin-home",
    },
    {
        key: "pet",
        icon: <BaiduOutlined />,
        label: "Quản lý thú cưng",
        children: [
            {
                key: "pet-list",
                label: "Danh sách thú cưng",
                route: "manage-pet",
            },
            {
                key: "pet-adoption",
                label: "Đơn xin nhận nuôi",
                route: "adopted-management",
            },
        ]
    },
    {
        key: "product",
        icon: <ProductOutlined />,
        label: "Quản lý sản phẩm",
        route: "manage-product",
    },
    {
        key: "news",
        icon: <SnippetsOutlined />,
        label: "Quản lý đơn hàng",
        route: "manage-order",
    }
]

const customTheme = {
    components: {
        Menu: {
            itemColor: "var(--color-font-admin)",
            itemBg: "var(--color-bg-admin)",
            itemSelectedColor: "var(--color-font-admin-active)",
            itemSelectedBg: "var(--color-bg-admin)",
            itemHoverBg: "var(--color-bg-admin)"
        }
    },
};

const siderStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
};


export default function Admin() {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();

    const isAdminHome = location.pathname === '/admin/admin-home';

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
            navigate(selectedItem.route);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        message.success("Đăng xuất thành công");
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
        <div className="admin-whole-container">
            <Layout hasSider className='admin-container'>
                <ConfigProvider theme={{
                    components: {
                        Layout: {
                            bodyBg: '#dfedff',
                            siderBg: '#dfedff',
                            lightTriggerBg: '#dfedff',
                        }
                    },
                }}>
                    <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
                        <div className="header-admin">
                            {!collapsed ? <img src={logo} className='logo' /> : <></>}
                        </div>
                        <Menu
                            mode="inline"
                            // selectedKeys={[selectedKey]}
                            defaultSelectedKeys={[selectedKey]}
                            style={{ height: '100%', outline: "none" }}
                            onClick={handleMenuClick}
                            items={items}

                        />
                    </Sider>

                    <Layout style={{
                        marginInlineStart: collapsed ? "80px" : '200px',
                    }}>
                        <Header
                            style={{
                                padding: 0,
                                // background: colorBgContainer,
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
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
                        <Content
                        // style={{
                        //     margin: isAdminHome ? '0' : '24px 16px',
                        //     padding: 24,
                        //     minHeight: 590,
                        //     background: isAdminHome ? 'none' : colorBgContainer,
                        //     borderRadius: isAdminHome ? '0' : borderRadiusLG,
                        // }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </ConfigProvider>
            </Layout>
        </div>

    )
}
