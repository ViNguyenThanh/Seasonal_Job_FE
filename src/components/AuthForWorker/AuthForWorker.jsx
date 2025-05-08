import React, { useState } from 'react'
import './AuthForWorker.css'
import { ExclamationCircleOutlined, HomeFilled, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import background_worker from '/assets/background_worker.gif'
import logo from '/assets/logo.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Checkbox, Form, Input, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import google from '/assets/google.png'
import store from "../../store/ReduxStore";
import { authApi } from '../../apis/auth.request';
import { login } from '../../redux/actions/auth.action';
import { useDispatch } from 'react-redux';

const AuthForWorker = ({ comp }) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [checked, setChecked] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()


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
      email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email")
        .required('* Required'),
      password: Yup.string().min(6, "* Password must be at least 6 characters or more").required("* Required"),
      confirmPassword:
        comp === "Register"
          ? Yup.string()
            .oneOf([Yup.ref("password"), null], "* Confirm Password must match Password")
            .required("* Please enter your confirm password")
          : Yup.string()
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
            role: "worker",
            fullName: values.fullname
          })
          if (user.status == 201) {
            message.destroy()
            message.success("Register successfully! Check your email to verify account");
            navigate("/login-for-worker");
          }
          // console.log(user);
        } else if (comp === "Login") {
          await dispatch(login({
            email: values.email,
            password: values.password
          }))
          const authState = store.getState().authReducer;

          if (authState.payload) {
            if (authState.payload.role === "worker") {
              message.destroy()
              message.success("Login successfully!");
              navigate("/");
            }else{
              message.destroy()
              message.error("You are not a worker! Can't log in here");
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
    // console.log('checked = ', e.target.checked);

    setChecked(e.target.checked);
    if (e.target.checked) setShowCheckboxError(false); // Xóa lỗi khi check lại
  };


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
      setTimeout(() => {
        message.success("Your request to reset the password has been submitted successfully! Please check your email to proceed.");

        // Xử lý khi bấm Change Password
        setConfirmLoading(false);
        setConfirmVisible(false);
        formikForgotPassword.resetForm();
      }, 2000);
    }
  });

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
                  title={<p className='worker-forgot-pw-title'>  <ExclamationCircleOutlined /> &#160;Forgot Password </p>}
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
                  <div className="worker-forgot-pw-content">
                    <div className='worker-forgot-pw-field'>
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