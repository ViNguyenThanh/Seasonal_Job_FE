import React, { useState } from 'react'
import './AuthForWorker.css'
import { HomeFilled, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import background_worker from '/assets/background_worker.gif'
import logo from '/assets/logo.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import google from '/assets/google.png'

const AuthForWorker = ({ comp }) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [checked, setChecked] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullname: comp === "Register"
        ? Yup.string()
          .matches(
            /^[^0-9]*$/,
            "* Full Name cannot be entered in numbers"
          )
          .matches(
            /^[^!@#$%^&*(),.?":;{}|<>]*$/,
            "* Full name cannot contain special characters"
          )
          .matches(
            /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/,
            "* Each word must have its first letter capitalized"
          )

          .max(30, "* Full Name cannot be longer than 30 characters")
          .required("* Required")
        : Yup.string(),
      email: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email"
      ).required('* Required'),
      password: Yup.string().min(6, "* Password must be at least 6 characters or more").required("* Required"),
      confirmPassword:
        comp === "Register"
          ? Yup.string()
            .oneOf([Yup.ref("password"), null], "Confirm Password must match Password")
            .required("* Please enter your confirm password")
          : Yup.string()
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


  return (
    <div className='auth-worker-whole-container'>
      <div className="auth-worker-container">

        <img src={background_worker} className='auth-worker-background-img' />

        <button className='home-btn' onClick={() => navigate("/")}><HomeFilled /></button>

        <div className="auth-worker-left">
          <div className="welcome-worker">
            <h1>HI! WELCOME {comp === "Register" ? "" : "BACK"} TO</h1>
            <img src={logo} />
          </div>
          <form onSubmit={formik.handleSubmit} className='auth-worker-form'>
            {comp === "Register" && (
              <div className='worker-info'>
                <p className='title'>Fullname *</p>
                <Form.Item
                  validateStatus={formik.errors.fullname && formik.touched.fullname ? "error" : ""}
                  help={formik.errors.fullname && formik.touched.fullname ? formik.errors.fullname : ""}
                >
                  <Input
                    className='input'
                    size="large"
                    placeholder="Fullname"
                    prefix={<UserOutlined />}
                    id="fullname"
                    name="fullname"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullname}
                  />
                </Form.Item>
              </div>
            )}

            <div className='worker-info'>
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

            <div className='worker-info'>
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
              <div className='forgot-password'>
                <p onClick={() => navigate("/forgot-password")}>Forgot password?</p>
              </div>
            )}

            {comp === "Register" && (
              <div className='worker-info'>
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
            )}
            {comp === "Register" && (
              <>
                <Checkbox checked={checked} onChange={onChange} className="worker-checkbox">
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

          <button className='log-in-gg-btn' onClick={() => navigate("/")}>
            <img src={google} />
            Log in with Google
          </button>


          {comp === "Register" ? (
            <div className="already-account-or-not">
              <p>
                Already have an account?
                <span
                  onClick={() => {
                    navigate("/login-for-worker")
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
                    navigate("/register-for-worker")
                    window.scrollTo(0, 0);
                  }}> Sign Up now
                </span>
              </p>
            </div>
          )}

        </div>
        <div className="auth-worker-right">

        </div>
      </div>
    </div>
  )
}

export default AuthForWorker