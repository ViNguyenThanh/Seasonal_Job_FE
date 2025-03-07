import React, { useEffect, useState } from 'react'
import './Header.css'
import logo from '/assets/logo.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons';


const Header = () => {

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


    const menu = (
        <Menu
            items={[
                { key: '1', label: <div onClick={handleClick}>All Jobs</div> },
                { key: '2', label: 'Resume & CV' },
                { key: '3', label: 'Companies' },
                { key: 'divider', type: 'divider' },
                { key: '4', label: 'For Employer' },
                { key: '5', label: 'Sign in / Sign Up' },
            ]}
        />
    );


    return (
        <div className={`header-whole-container ${showHeader ? 'show' : ''}`} >
            <div className={`header-container ${showHeader ? 'show-down' : ''}`}>
                <div className="header-left">
                    <img src={logo} className='header-logo' onClick={handleClick} />
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
                        <div className="dropdown-btn">
                            <Dropdown menu={{ items: menu.props.items }} trigger={['click']} placement="bottomRight">
                                <Button icon={<MenuOutlined />} type="primary" />
                            </Dropdown>
                        </div>
                    ) : (
                        <>
                            <li
                                onClick={handleClick}
                                className={location.pathname === '/' ? 'active' : ''}
                            >
                                All Jobs
                            </li>
                            <li>Resume & CV</li>
                            <li>Companies</li>
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
                        <li>For Employer</li>
                        <div style={{ border: '1px solid white', height: '35px', margin: '0 3%' }}></div>
                        <li>Sign in / Sign Up</li>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header