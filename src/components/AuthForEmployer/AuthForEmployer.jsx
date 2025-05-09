import React, { useEffect, useState } from 'react'
import './AuthForEmployer.css'
import { AimOutlined, EnvironmentOutlined, ExclamationCircleOutlined, HomeFilled, IdcardOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import background_employer from '/assets/background_employer.gif'
import logo from '/assets/logo.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Checkbox, Form, Input, message, Modal, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../apis/auth.request';
import { login } from '../../redux/actions/auth.action';
import store from "../../store/ReduxStore";
import { useDispatch } from 'react-redux';
import { userApi } from '../../apis/user.request';

const AuthForEmployer = ({ comp }) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [checked, setChecked] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()


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
                        .oneOf([Yup.ref("password"), null], "* Confirm Password must match Password")
                        .required("* Please enter your confirm password")
                    : Yup.string(),
            companyName: comp === "Register"
                ? Yup.string()
                    .test('no-leading-space', '* No spaces at the beginning', value => {
                        return value ? !/^\s/.test(value) : false;
                    })
                    .test('no-extra-space', '* No extra spaces allowed', value => {
                        return value ? !/ {2,}/.test(value) : false;
                    })
                    .test('no-question-mark', '* Cannot contain "?" character', value => {
                        return value ? !/\?/.test(value) : false;
                    })
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
            message.open({
                type: 'loading',
                content: 'Please wait a moment',
            })
            try {
                if (comp === "Register") {
                    if (!checked) {
                        message.destroy()
                        setShowCheckboxError(true);
                        return; // Dừng submit nếu checkbox chưa được chọn
                    }
                    const user = await authApi.register({
                        email: values.email,
                        password: values.password,
                        address: values.city + ", " + values.district,
                        companyName: values.companyName,
                        phoneNumber: values.phoneNumber,
                        role: "employer",
                    })
                    if (user.status == 201) {
                        message.destroy()
                        message.success("Register successfully! Check your email to verify account");
                        navigate("/login-for-employer");
                    }
                    // console.log(user);
                } else if (comp === "Login") {
                    await dispatch(login({
                        email: values.email,
                        password: values.password
                    }))
                    const authState = store.getState().authReducer;

                    if (authState.payload) {
                        if (authState.payload.role === "employer") {
                            message.destroy()
                            message.success("Login successfully!");
                            navigate("/employer-home");
                        } else {
                            message.destroy()
                            message.error("You are not a employer! Can't log in here");
                            localStorage.removeItem("token");
                        }
                    } else {
                        message.destroy()
                        message.error(authState.error.message);
                    }
                }
            } catch (error) {
                console.log(error);
                message.destroy()
                message.error(error.response.data.message);
            }
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

    /* Modal Forgot Password */
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showConfirmModal = () => {
        formikForgotPassword.setValues({
            email: '',
        });
        formikForgotPassword.setTouched({
            email: false,
        });

        setConfirmVisible(true);
    };

    const closeConfirm = () => {
        setConfirmVisible(false);
    };

    const formikForgotPassword = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email"
            ).required('* Required'),
        }),
        onSubmit: (values) => {
            setConfirmLoading(true);
            try {
                const res = userApi.forgetPassword(values);
                message.success("Your request to reset the password has been submitted successfully! Please check your email to proceed.");

                // Xử lý khi bấm Change Password
                setConfirmLoading(false);
                setConfirmVisible(false);
                formikForgotPassword.resetForm();
            } catch (error) {
                if (error.response.status === 404 || error.response.status === 400) {
                    message.error(error.response.data.message);
                } else {
                    message.error("Can't send email");
                }
                setConfirmLoading(false);
                setConfirmVisible(false);
                formikForgotPassword.resetForm();
            }
        }
    });

    return (
        <div className='auth-employer-whole-container'>
            <div className="auth-employer-container">

                <img src={background_employer} className='auth-employer-background-img' />

                <button className='home-btn' onClick={() => navigate("/employer-home")}><HomeFilled /></button>

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
                        </div>

                        {comp === "Login" && (
                            <>
                                <div className='forgot-password'>
                                    <p
                                        // onClick={() => navigate("/forgot-password")}
                                        onClick={showConfirmModal}
                                    >
                                        Forgot password?
                                    </p>
                                </div>

                                <Modal
                                    title={<p className='employer-forgot-pw-title'>  <ExclamationCircleOutlined /> &#160;Forgot Password </p>}
                                    open={confirmVisible}
                                    onCancel={closeConfirm}
                                    footer={[
                                        <Button key="no" onClick={closeConfirm} size='large'>Cancel</Button>,
                                        <Button key="yes" type="primary" size='large' onClick={formikForgotPassword.handleSubmit} loading={confirmLoading}>
                                            Send Request
                                        </Button>
                                    ]}
                                    width={500}
                                >
                                    <div className="employer-forgot-pw-content">
                                        <div className='employer-forgot-pw-field'>
                                            <p className='title'> <span>*</span> Email</p>
                                            <Form.Item
                                                validateStatus={formikForgotPassword.errors.email && formikForgotPassword.touched.email ? "error" : ""}
                                                help={formikForgotPassword.errors.email && formikForgotPassword.touched.email ? formikForgotPassword.errors.email : ""}
                                            >
                                                <Input
                                                    className='input'
                                                    size="large"
                                                    placeholder="Input your Email..."
                                                    id="email"
                                                    name="email"
                                                    type="text"
                                                    onChange={formikForgotPassword.handleChange}
                                                    onBlur={formikForgotPassword.handleBlur}
                                                    value={formikForgotPassword.values.email}
                                                />
                                            </Form.Item>
                                        </div>

                                        <p className="reset-password-guideline">
                                            After sending your request, please check your email for instructions on how to reset your password.
                                        </p>
                                    </div>
                                </Modal>
                            </>
                        )}

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
                                                // placeholder="Select Province/City"
                                                placeholder={
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <EnvironmentOutlined />
                                                        Select Province/City
                                                    </span>
                                                }
                                                value={formik.values.city || undefined}
                                                // onChange={(value) => formik.setFieldValue("city", value)}
                                                onChange={(value) => {
                                                    formik.setFieldValue("city", value);
                                                    formik.setFieldValue("district", '0'); // Reset district về '0' khi city thay đổi
                                                }}
                                                onBlur={() => formik.setFieldTouched("city", true)}
                                                // options={cityList.map((city) => ({
                                                //     label: city.full_name,
                                                //     value: city.full_name,
                                                // }))}
                                                showSearch
                                                allowClear
                                            >
                                                <Select.Option value="0" disabled>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <EnvironmentOutlined />
                                                        Select Province/City
                                                    </span>
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
                                                // placeholder="Select District"
                                                placeholder={
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <AimOutlined />
                                                        Select Province/City
                                                    </span>
                                                }
                                                value={formik.values.district || undefined}
                                                onChange={(value) => formik.setFieldValue("district", value)}
                                                onBlur={() => formik.setFieldTouched("district", true)}
                                                // options={districtList.map((district) => ({
                                                //     label: district.full_name,
                                                //     value: district.full_name,
                                                // }))}
                                                disabled={!formik.values.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành
                                                showSearch
                                                allowClear
                                            >
                                                <Select.Option value="0" disabled>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <AimOutlined />
                                                        Select District
                                                    </span>
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
                                    I have read and agree to the <span
                                        className='condition'
                                        // onClick={() => navigate("/terms-and-conditions")}
                                        onClick={() => window.open("/terms-and-conditions", "_blank", "noopener,noreferrer")}
                                    >
                                        Terms & Conditions
                                    </span> and <span
                                        className='condition'
                                        // onClick={() => navigate("/privacy-policy")}
                                        onClick={() => window.open("/privacy-policy", "_blank", "noopener,noreferrer")}
                                    >
                                        Privacy Policy
                                    </span> provided
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