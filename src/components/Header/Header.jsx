import React, { useEffect, useState } from 'react'
import './Header.css'
import logo from '/assets/logo.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Badge, Button, Dropdown, message, Space } from 'antd'
import { AuditOutlined, BellOutlined, CreditCardOutlined, FileOutlined, LogoutOutlined, MenuOutlined, ProfileOutlined, UserOutlined, } from '@ant-design/icons';
import { getUserFromToken } from '../../utils/Token'
import { userApi } from '../../apis/user.request'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/auth.action'


const Header = () => {
    const dispatch = useDispatch()
    const { user } = getUserFromToken();
    const [userInfor, setUserInfo] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                if (user) {
                    const res = await userApi.getUserById(user.id);
                    setUserInfo(res.data.data);
                    // console.log(res.data.data);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getUserInfo();
    }, []);

    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = () => {
        navigate("/");
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }

    const [showHeader, setShowHeader] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);

    const controlHeader = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY < lastScrollY) { // Kiểm tra nếu người dùng cuộn lên. Nếu đúng, header sẽ được hiển thị
                setShowHeader(true)
            } else if (window.scrollY < 10) { // để khi component Header được gọi ở trang mới thì Header sẽ được hiện ra lần đầu tiên // nói cách khác, kiểm tra nếu người dùng ở gần đầu trang (khoảng cách cuộn từ trên cùng ít hơn 10px), header sẽ được hiển thị 
                setShowHeader(true)
            } else {
                setShowHeader(false)
            }
            setIsDropdownVisible(false);
        }
        setLastScrollY(window.scrollY)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader)

            return () => {
                window.removeEventListener('scroll', controlHeader)
            }
        }

    }, [lastScrollY])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 650);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    // const menu = (
    //     <Menu
    //         items={[
    //             { key: '1', label: <div onClick={() => { navigate("/finding-job"); window.scrollTo(0, 0); }}>All Jobs</div> },
    //             { key: '2', label: 'Resume & CV' },
    //             { key: '3', label: <div onClick={() => { navigate("/finding-company"); window.scrollTo(0, 0); }}>Companies</div> },
    //             { key: 'divider', type: 'divider' },
    //             { key: '4', label: <div onClick={() => { navigate("/login-for-employer"); window.scrollTo(0, 0); }}>For Employer</div> },
    //             { key: '5', label: <div onClick={() => { navigate("/login-for-worker"); window.scrollTo(0, 0); }}>Sign In / Sign Up</div> },
    //         ]}
    //     />
    // );
    const menuItems = [
        { key: '1', label: <div onClick={() => { navigate("/finding-job"); window.scrollTo(0, 0); }}>All Jobs</div> },
        { key: '2', label: 'Resume & CV' },
        { key: '3', label: <div onClick={() => { navigate("/finding-company"); window.scrollTo(0, 0); }}>Companies</div> },
        { key: 'divider', type: 'divider' },
        { key: '4', label: <div onClick={() => { navigate("/employer-home"); window.scrollTo(0, 0); }}>For Employer</div> },
        { key: '5', label: <div onClick={() => { navigate("/login-for-worker"); window.scrollTo(0, 0); }}>Sign In / Sign Up</div> },
    ];
    // Nếu có user, bỏ các mục key: 'divider', key: '4', key: '5' ra khỏi menuItems
    useEffect(() => {
        if (user && userInfor.role === "user") {
            const updatedMenuItems = menuItems.filter(item => item.key !== 'divider' && item.key !== '4' && item.key !== '5');
            // Cập nhật lại menuItems nếu có user
            menuItems.length = 0;
            menuItems.push(...updatedMenuItems);
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logout("token"));
        message.success("Logout successfully!");
        navigate("/");
    }

    const itemsUser = [
        {
            label: "Profile",
            key: '1',
            icon: <UserOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            // onClick: () => { navigate('/admin/admin-home') },
        },
        {
            label: "CV attachment",
            key: '2',
            icon: <FileOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            // onClick: handleLogout,
        },
        {
            label: "Applications",
            key: '3',
            icon: <AuditOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            // onClick: handleLogout,
        },
        {
            label: "My jobs",
            key: '4',
            icon: <ProfileOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            // onClick: handleLogout,
        },
        {
            label: "Wallet & transaction",
            key: '5',
            icon: <CreditCardOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            // onClick: handleLogout,
        },
        {
            label: "Log out",
            key: '6',
            icon: <LogoutOutlined style={{ fontSize: '16px' }} />,
            style: { fontSize: '16px' },
            onClick: handleLogout,
        },
    ];

    return (
        <div className={`header-whole-container ${showHeader ? 'show' : ''}`} >
            <div className={`header-container ${showHeader ? 'show-down' : ''}`}>
                <div className="header-left">
                    {!isMobile && (
                        <img src={logo} className='header-logo' onClick={handleClick} />
                    )}
                    {/* <img src={logo} className='header-logo' onClick={handleClick} /> */}
                    {(isMobile && (!user || userInfor.role === 'employer')) ? (
                        <div className="header-left">
                            <img src={logo} className='header-logo' onClick={handleClick} />
                        </div>
                    ) : null}
                    {!isMobile && (
                        <div style={{ border: '1px solid white', height: '35px', margin: '0 3%' }}></div>
                    )}
                    {/* <li
                        onClick={() => {
                            navigate("/")
                            window.scrollTo(0, 0);
                        }}
                        className={location.pathname == "/" ? "active" : ""}
                    >
                        All Jobs
                    </li>
                    <li>Resume & CV</li>
                    <li>Companies</li> */}
                    {isMobile ? (
                        <div className={`dropdown-btn ${user && userInfor.role === 'user' ? 'user-logged-in' : ''}`}>
                            {user && userInfor.role === 'user' ? (
                                <>
                                    <Dropdown menu={{ items: /*menu.props.items*/ menuItems }} trigger={['click']} placement="bottomRight">
                                        <Button icon={<MenuOutlined />} type="primary" />
                                    </Dropdown>
                                    <img src={logo} className='header-logo' onClick={handleClick} />
                                    <div>
                                        {/* <Badge size='default' style={{ marginRight: '15px' }} count={1}>
                                            <Avatar style={{ marginRight: '10px', backgroundColor: '#4096ff8a' }} size={'large'} shape="square" icon={<BellOutlined />} />
                                        </Badge> */}
                                        <Dropdown menu={{ items: itemsUser }} trigger={['click']} className='dropdown' placement='bottom'
                                            open={isDropdownVisible} // Kiểm soát trạng thái dropdown
                                            onOpenChange={(visible) => setIsDropdownVisible(visible)} // Cập nhật trạng thái
                                        >
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    <Avatar
                                                        src={userInfor.avatar ? userInfor.avatar : 'https://cdn-media.sforum.vn/storage/app/media/THANHAN/avatar-trang-98.jpg'}
                                                        style={{ cursor: "pointer", width: '40px', height: '40px', marginRight: '15px' }}
                                                    />
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>

                                </>
                            ) : (
                                <Dropdown menu={{ items: /*menu.props.items*/ menuItems }} trigger={['click']} placement="bottomRight">
                                    <Button icon={<MenuOutlined />} type="primary" />
                                </Dropdown>
                            )}
                        </div>
                    ) : (
                        <>
                            <li
                                onClick={() => {
                                    navigate("/finding-job")
                                    window.scrollTo(0, 0);
                                }}
                                className={location.pathname === '/finding-job' ? 'active' : ''}
                            >
                                All Jobs
                            </li>
                            {/* <li>Resume & CV</li> */}
                            <li
                                onClick={() => {
                                    navigate("/finding-company")
                                    window.scrollTo(0, 0);
                                }}
                                className={location.pathname === '/finding-company' ? 'active' : ''}
                            >
                                Companies
                            </li>
                        </>
                    )}
                </div>
                {/* <div className="header-right">
                    <li>For Employer</li>
                    <div style={{border: '1px solid white', height: '35px', margin: '0 3%'}}></div>
                    <li>Sign in / Sign Up</li>
                </div> */}
                {!isMobile && (
                    <div className="header-right">
                        <li
                            onClick={() => {
                                navigate("/employer-home")
                                window.scrollTo(0, 0);
                            }}
                        >
                            For Employer
                        </li>
                        <div style={{ border: '1px solid white', height: '35px', margin: '0 3%' }}></div>
                        {user && userInfor.role === "user" ? (
                            <div className='header-right-items'>
                                {/* <Badge size='default' style={{ marginRight: '15px' }} count={1}>
                                    <Avatar style={{ marginRight: '10px', backgroundColor: '#4096ff8a' }} size={'large'} shape="square" icon={<BellOutlined />} />
                                </Badge> */}
                                <Dropdown menu={{ items: itemsUser }} trigger={['click']} className='dropdown' placement='bottom'
                                    open={isDropdownVisible} // Kiểm soát trạng thái dropdown
                                    onOpenChange={(visible) => setIsDropdownVisible(visible)} // Cập nhật trạng thái
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <Avatar
                                                src={userInfor.avatar ? userInfor.avatar : 'https://cdn-media.sforum.vn/storage/app/media/THANHAN/avatar-trang-98.jpg'}
                                                style={{ cursor: "pointer", width: '40px', height: '40px', marginRight: '15px' }}
                                            />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        ) : (
                            <li
                                onClick={() => {
                                    navigate("/login-for-worker")
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Sign in / Sign Up
                            </li>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header