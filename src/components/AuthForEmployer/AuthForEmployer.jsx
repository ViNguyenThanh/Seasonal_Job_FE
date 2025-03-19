import React, { useEffect, useState } from 'react'
import './AuthForEmployer.css'
import { AimOutlined, EnvironmentOutlined, HomeFilled, IdcardOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import background_employer from '/assets/background_employer.gif'
import logo from '/assets/logo.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Checkbox, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import google from '/assets/google.png'

const AuthForEmployer = ({ comp }) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [checked, setChecked] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    const navigate = useNavigate()


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            companyName: '',
            phoneNumber: '',
            city: '',
            district: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email"
            ).required('* Required'),
            password: Yup.string().min(6, "* Password must be at least 6 characters or more").required("* Required"),
            confirmPassword:
                comp === "Register"
                    ? Yup.string()
                        .oneOf([Yup.ref("password"), null], "Confirm Password must match Password")
                        .required("* Please enter your confirm password")
                    : Yup.string(),
            companyName: comp === "Register"
                ? Yup.string()
                    .max(60, "* Company Name cannot be longer than 60 characters")
                    .required("* Required")
                : Yup.string(),
            phoneNumber:
                comp === "Register"
                    ? Yup.string()
                        // .matches(`[^a-zA-Z]+`, "Numbers only")
                        .matches(/^\S+$/, "* Phone numbers cannot contain spaces")
                        .matches(/^\d+$/, "* Numbers only")
                        .matches(`^[0][1-9]*`, "* Phone number must start with 0")
                        .max(10, "* Phone number must be 10 digits")
                        .min(10, "* Phone number must be 10 digits")
                        .required("* Required")
                    : Yup.string(),
            city: comp === "Register"
                ? Yup.string()
                    .notOneOf(["0"], "* Province/City must be selected")
                    .required("* Required")
                : Yup.string(),
            district: comp === "Register"
                ? Yup.string()
                    .notOneOf(["0"], "* District must be selected")
                    .required("* Required")
                : Yup.string(),
        }),
        onSubmit: async (values) => {
            if (comp === "Register" && !checked) {
                setShowCheckboxError(true);
                return; // Dừng submit nếu checkbox chưa được chọn
            }
            alert(`email: ${values.email}`);
        }
    });

    const onChange = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) setShowCheckboxError(false); // Xóa lỗi khi check lại
    };


    // link trang để lấy api Tỉnh Thành, Quận Huyện, Phường Xã
    // https://esgoo.net/api-lay-thong-tin-tinh-thanh-quan-huyen-phuong-xa-viet-nam-bv5.htm

    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);

    useEffect(() => {
        // Fetching the list of Cities (Tỉnh Thành)
        fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then((response) => response.json())
            .then((cityData) => {
                if (cityData.error === 0) {
                    setCityList(cityData.data);
                    // console.log(cityData.data);
                }
            });
    }, []);
    useEffect(() => {
        const selectedCity = cityList.find(city => city.full_name === formik.values.city);
        if (selectedCity) {
            fetch(`https://esgoo.net/api-tinhthanh/2/${selectedCity.id}.htm`)
                .then((response) => response.json())
                .then((districtData) => {
                    if (districtData.error === 0) {
                        setDistrictList(districtData.data);
                        formik.setFieldValue('district', '0'); // Reset District về 0
                    }
                });
        } else {
            setDistrictList([]); // Xóa danh sách quận huyện nếu không có thành phố nào được chọn
            formik.setFieldValue('district', '0'); // Reset District về 0
        }
    }, [formik.values.city]);

    return (
        <div className='auth-employer-whole-container'>
            <div className="auth-employer-container">

                <img src={background_employer} className='auth-employer-background-img' />

                <button className='home-btn' onClick={() => navigate("/")}><HomeFilled /></button>

                <div className="auth-employer-left">

                </div>

                <div className="auth-employer-right">
                    <div className="welcome-employer">
                        <div className="welcome-employer-text">
                            <h1>HI! WELCOME {comp === "Register" ? "" : "BACK"} TO</h1>
                            <p>This is Employer Site</p>
                        </div>
                        <img src={logo} />
                    </div>

                    <form onSubmit={formik.handleSubmit} className='auth-employer-form'>
                        <div className='employer-info'>
                            <p className='title'>Email *</p>
                            <Form.Item
                                validateStatus={formik.errors.email && formik.touched.email ? "error" : ""}
                                help={formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                            >
                                <Input
                                    className='input'
                                    size="large"
                                    placeholder="Email"
                                    prefix={<MailOutlined />}
                                    id="email"
                                    name="email"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </Form.Item>
                        </div>

                        <div className='employer-info'>
                            <p className='title'>Password *</p>
                            <Form.Item
                                validateStatus={formik.errors.password && formik.touched.password ? "error" : ""}
                                help={formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                            >
                                <Input.Password
                                    className='input'
                                    size="large"
                                    placeholder="Password"
                                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                    prefix={<LockOutlined />}
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </Form.Item>
                            {comp === "Login" && (
                                <div className='forgot-password'>
                                    <p onClick={() => navigate("/forgot-password")}>Forgot password?</p>
                                </div>
                            )}
                        </div>

                        {comp === "Register" && (
                            <>
                                <div className='employer-info'>
                                    <p className='title'>Confirm Password *</p>
                                    <Form.Item
                                        validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? "error" : ""}
                                        help={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ""}
                                    >
                                        <Input.Password
                                            className='input'
                                            size="large"
                                            placeholder="Password"
                                            visibilityToggle={{ visible: confirmPasswordVisible, onVisibleChange: setConfirmPasswordVisible }}
                                            prefix={<LockOutlined />}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="confirmPassword"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmPassword}
                                        />
                                    </Form.Item>
                                </div>

                                <h3>Employer Information</h3>

                                <div className='employer-info'>
                                    <p className='title'>Company Name *</p>
                                    <Form.Item
                                        validateStatus={formik.errors.companyName && formik.touched.companyName ? "error" : ""}
                                        help={formik.errors.companyName && formik.touched.companyName ? formik.errors.companyName : ""}
                                    >
                                        <Input
                                            className='input'
                                            size="large"
                                            placeholder="Company Name"
                                            prefix={<IdcardOutlined />}
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.companyName}
                                        />
                                    </Form.Item>
                                </div>

                                <div className='employer-info'>
                                    <p className='title'>Phone Number *</p>
                                    <Form.Item
                                        validateStatus={formik.errors.phoneNumber && formik.touched.phoneNumber ? "error" : ""}
                                        help={formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : ""}
                                    >
                                        <Input
                                            className='input'
                                            size="large"
                                            placeholder="Phone Number"
                                            prefix={<PhoneOutlined style={{ transform: 'rotate(90deg)' }} />}
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="text"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phoneNumber}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="employer-address">
                                    <p className='title'>Address *</p>

                                    <div className="employer-address-select">
                                        <Form.Item
                                            validateStatus={formik.errors.city && formik.touched.city ? "error" : ""}
                                            help={formik.errors.city && formik.touched.city ? formik.errors.city : ""}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                    margin: '0% 0 1%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                                placeholder="Select Province/City"
                                                value={formik.values.city || undefined}
                                                onChange={(value) => formik.setFieldValue("city", value)}
                                                onBlur={() => formik.setFieldTouched("city", true)}
                                            // options={cityList.map((city) => ({
                                            //     label: city.full_name,
                                            //     value: city.full_name,
                                            // }))}
                                            >
                                                <Select.Option value="0" disabled>
                                                    Select Province/City
                                                </Select.Option>

                                                {/* Danh sách tỉnh/thành từ API */}
                                                {cityList.map((city) => (
                                                    <Select.Option key={city.full_name} value={city.full_name}>
                                                       <EnvironmentOutlined />  {city.full_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <div className="employer-address-select">
                                        <Form.Item
                                            validateStatus={formik.errors.district && formik.touched.district ? "error" : ""}
                                            help={formik.errors.district && formik.touched.district ? formik.errors.district : ""}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                    margin: '0% 0 1%',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                placeholder="Select District"
                                                value={formik.values.district || undefined}
                                                onChange={(value) => formik.setFieldValue("district", value)}
                                                onBlur={() => formik.setFieldTouched("district", true)}
                                                // options={districtList.map((district) => ({
                                                //     label: district.full_name,
                                                //     value: district.full_name,
                                                // }))}
                                                disabled={!formik.values.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành
                                            >
                                                <Select.Option value="0" disabled>
                                                    Select District
                                                </Select.Option>

                                                {/* Danh sách quận/huyện dựa trên tỉnh đã chọn */}
                                                {districtList.map((district) => (
                                                    <Select.Option key={district.full_name} value={district.full_name}>
                                                        <AimOutlined /> {district.full_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>

                                <Checkbox checked={checked} onChange={onChange} className="employer-checkbox">
                                    I have read and agree to the
                                    <span className='condition' onClick={() => navigate("/terms-and-conditions")}> Terms & Conditions</span> and
                                    <span className='condition' onClick={() => navigate("/privacy-policy")}> Privacy Policy</span> provided
                                </Checkbox>
                                {showCheckboxError && <p className="checkbox-error-text">* Please agree to the terms</p>}
                            </>
                        )}

                        <button type="submit">
                            {comp === "Login" ? "Sign In" : "Sign Up"}
                        </button>

                    </form>

                    {comp === "Register" ? (
                        <div className="already-account-or-not">
                            <p>
                                Already have an account?
                                <span
                                    onClick={() => {
                                        navigate("/login-for-employer")
                                        window.scrollTo(0, 0);
                                    }}> Sign In now
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="already-account-or-not">
                            <p>
                                Do not have an account?
                                <span
                                    onClick={() => {
                                        navigate("/register-for-employer")
                                        window.scrollTo(0, 0);
                                    }}> Sign Up now
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthForEmployer