import React, { useState } from 'react'
import './ResetPassword.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, message, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userApi } from '../../apis/user.request';
const ResetPassword = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, '* Password must be at least 6 characters')
        .required('* Required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], '* Confirm Password must match Password')
        .required('* Please enter your confirm password'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const token = searchParams.get('token');
      try {
        if (token) {
          const res = await userApi.resetPassword({ token, newPassword: values.newPassword });
          setLoading(false);
          message.success('Reset password successfully!');
          navigate('/');
        }
      } catch (error) {
        setLoading(false);
        if (error.response.status === 404 || error.response.status === 400) {
          message.error(error.response.data.message);
        } else {
          message.error("Can't reset password");
        }
        console.log(error);
      }
    },
  });

  return (
    <div className='reset-pw-whole-container'>
      <div className="reset-pw-container">
        <h1>Reset Password</h1>

        <form onSubmit={formik.handleSubmit} className="reset-pw-form">
          <div className="reset-pw-field">
            <p className="title"><span>*</span> New Password</p>
            <Form.Item
              validateStatus={formik.errors.newPassword && formik.touched.newPassword ? 'error' : ''}
              help={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''}
            >
              <Input.Password
                className="input"
                size="large"
                placeholder="Enter new password"
                prefix={<LockOutlined />}
                name="newPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                disabled={loading}
              />
            </Form.Item>
          </div>

          <div className="reset-pw-field">
            <p className="title"><span>*</span> Confirm New Password </p>
            <Form.Item
              validateStatus={formik.errors.confirmNewPassword && formik.touched.confirmNewPassword ? 'error' : ''}
              help={formik.errors.confirmNewPassword && formik.touched.confirmNewPassword ? formik.errors.confirmNewPassword : ''}
            >
              <Input.Password
                className="input"
                size="large"
                placeholder="Confirm new password"
                prefix={<LockOutlined />}
                name="confirmNewPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmNewPassword}
                disabled={loading}
              />
            </Form.Item>
          </div>

          <div className="change-pw-btn">
            <button type="submit" onClick={formik.handleSubmit} disabled={loading}>
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword