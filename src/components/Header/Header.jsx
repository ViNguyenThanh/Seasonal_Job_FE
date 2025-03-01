import React, { useEffect, useState } from 'react'
import './Header.css'
import logo from '/assets/logo.png'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/");
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
    const [showHeader, setShowHeader] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);



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

    return (
        <div className={`header-whole-container ${showHeader ? 'show' : ''}`} >
            <div className={`header-container ${showHeader ? 'show-down' : ''}`}>
                <div className="header-left">
                    <img src={logo} className='header-logo' onClick={handleClick} />
                    <li>All Jobs</li>
                    <li>Resume & CV</li>
                    <li>Companies</li>
                </div>
                <div className="header-right">
                    <li>For Employer</li>
                    <li>Sign in / Sign Up</li>
                </div>
            </div>
        </div>
    )
}

export default Header