import React, { useState } from 'react'
import './AuthForManagementTeam.css'
import background_management_team from '/assets/background_management_team.jpg'
import admin_img from '/assets/image_admin_login.png'
import support_staff_img from '/assets/image_support_staff_login.png'
import logo from '/assets/logo.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Form, Input, message, Modal } from 'antd'
import { ExclamationCircleOutlined, HomeFilled, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import store from "../../store/ReduxStore";
import { login } from '../../redux/actions/auth.action';
import { useDispatch } from 'react-redux';
import { userApi } from '../../apis/user.request'

const AuthForManagementTeam = ({ comp }) => {

  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email"
      ).required('* Required'),
      password: Yup.string().min(6, "* Password must be at least 6 characters or more").required("* Required"),
    }),
    onSubmit: async (values) => {
      message.loading('Please wait a moment...')
      try {
        await dispatch(login({
          email: values.email,
          password: values.password
        }))
        const authState = store.getState().authReducer;

        if (authState.payload) {
          if (authState.payload.role === "admin" && comp === "Admin") {
            message.destroy()
            message.success("Login successfully!");
            navigate("/admin/dashboard");
          } else if (authState.payload.role === "support staff" && comp === "SupportStaff") {
            message.destroy()
            message.success("Login successfully!");
            navigate("/support-staff/manage-complaints");
          } else if (authState.payload.role === "worker" || authState.payload.role === "employer") {
            message.destroy()
            message.error("Employer and worker can't log in here");
            localStorage.removeItem("token");
          } else {
            message.destroy()
            message.error("You don't have permission to log in here");
          }
        } else {
          message.destroy()
          message.error(authState.error.message);
        }
      } catch (error) {
        message.destroy()
        message.error(error.response.data.message);
      }
    }
  });

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
    <div className={`auth-management-team-whole-container ${comp === "Admin" ? "" : "support-staff"}`}>
      <div className="auth-management-team-container">

        {/* <img src={background_management_team} className='auth-management-team-bg-img' /> */}

        <button className='home-btn' onClick={() => navigate("/")}><HomeFilled /></button>

        <div className="auth-management-team-left">

          <div className="welcome-management-team">
            <h1>Login {comp === "Admin" ? "Admin" : "Support Staff"} Site</h1>
            <img src={logo} />
          </div>

          <form onSubmit={formik.handleSubmit} className='auth-management-team-form'>

            <div className='management-team-info'>
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

            <div className='management-team-info'>
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

            <div className='forgot-password'>
              <p
                // onClick={() => navigate("/forgot-password")}
                onClick={showConfirmModal}
              >
                Forgot password?
              </p>
            </div>
            <Modal
              title={<p className='management-team-forgot-pw-title'>  <ExclamationCircleOutlined /> &#160;Forgot Password </p>}
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
              <div className="management-team-forgot-pw-content">
                <div className='management-team-forgot-pw-field'>
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

            <button type="submit">
              Sign In
            </button>

          </form>

        </div>
        <div className="auth-management-team-right">
          {/* {comp === "Admin" ? (
            <img src={admin_img} className='auth-management-team-admin-img' />
          ) : (
            <img src={support_staff_img} className='auth-management-team-support-staff-img' />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default AuthForManagementTeam