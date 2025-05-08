/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './WorkerProfile.css'
import { Button, DatePicker, Form, Image, Input, message, Modal, Rate, Select, Upload } from 'antd'
import { EditOutlined, EnvironmentOutlined, EyeOutlined, FormOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SettingOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
const { TextArea } = Input;
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Giao diện mặc định
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/Token';
import { Api } from '../../../utils/BaseUrlServer';
import { login } from '../../../redux/actions/auth.action';
import store from "../../../store/ReduxStore";
import actionsType from '../../../redux/actions/action.type';


const WorkerProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken(); // Get the token
        if (!token) {
          console.error("No token found");
          return;
        }

        let decodedToken;
        try {
          decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        } catch (error) {
          console.error("Failed to decode token:", error);
          return;
        }

        const { id, role } = decodedToken || {}; // Extract id and role

        if (!id || role !== "worker") {
          console.error("Invalid token or unauthorized role");
          return;
        }

        const api = Api(); // Create an Axios instance
        const response = await api.get(`/users/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data);

        // Update the profileData and fileList
        setProfileData((prevData) => ({
          ...prevData,
          avatar: response.data.data.avatar || '', // Ensure avatar URL is set
          fullname: response.data.data.fullName,
          email: response.data.data.email,
          phoneNumber: response.data.data.phoneNumber,
          dob: response.data.data.dateOfBirth,
          gender: response.data.data.sex
            ? response.data.data.sex.charAt(0).toUpperCase() + response.data.data.sex.slice(1)
            : "-- None --",
          city: response.data.data.address
            ? response.data.data.address.split(",")[0].trim()
            : "-- None --",
          district: response.data.data.address
            ? response.data.data.address.split(",")[1]?.trim() || "-- None --"
            : "-- None --",
          description: response.data.data.description || "-- None --",
        }));

        // Initialize fileList with the current avatar
        if (response.data.data.avatar) {
          setFileList([
            {
              uid: '-1',
              name: 'avatar.png',
              status: 'done',
              url: response.data.data.avatar, // Use the current avatar URL
            },
          ]);
        }

        // Save the user ID for later use
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [profileData, setProfileData] = useState({
    // avatar: avatar,
    avatar: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    city: '',
    district: '',
    description: ``
  });

  /* Upload ảnh */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'avatar.png',
    //   status: 'done',
    //   url: profileData.avatar,
    // }
  ]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length === 0) {
      // Clear the avatar if no file is uploaded
      setProfileData((prevData) => ({
        ...prevData,
        avatar: '', // Clear the avatar
      }));
    } else if (newFileList.length > 0 && newFileList[0].status === "done") {
      try {
        const uploadedFile = newFileList[0].response; // Assuming the backend returns the uploaded file info
        const avatarUrl = uploadedFile?.avatar || ''; // Extract the avatar URL from the response

        setProfileData((prevData) => ({
          ...prevData,
          avatar: avatarUrl, // Update the avatar URL in the state
        }));

        message.success("Avatar updated successfully!");
      } catch (error) {
        console.error("Error processing upload response:", error);
        message.error("Failed to process uploaded avatar.");
      }
    }
  };


  /* Modal Review */
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    formik.setValues({
      avatar: profileData.avatar || avatar,
      fullname: profileData.fullname || '',
      email: profileData.email || '',
      phoneNumber: profileData.phoneNumber || '',
      dob: profileData.dob ? dayjs(profileData.dob).toDate() : null,
      gender: profileData.gender || '',
      city: profileData.city || '',
      district: profileData.district || '',
      description: profileData.description || '',
    });

    // Reinitialize fileList with the current avatar
    if (profileData.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: profileData.avatar, // Use the current avatar URL
        },
      ]);
    } else {
      setFileList([]); // Clear fileList if no avatar exists
    }

    setConfirmVisible(true);
  };

  // Đóng modal
  const closeConfirm = () => {
    setConfirmVisible(false);
    setFileList([
      // {
      //   uid: '-1',
      //   name: 'avatar.png',
      //   status: 'done',
      //   url: profileData.avatar,
      // }
    ]);
  };

  // Xử lý khi bấm Yes
  /*const handleConfirm = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setConfirmVisible(false);
      formikReview.resetForm();
      setStarValue(5);
    }, 2000);
  }*/

  /* formik */
  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      phoneNumber: '',
      dob: '',
      gender: '',
      city: '',
      district: '',
      description: '',
    },
    onSubmit: async (values) => {
      setConfirmLoading(true);
      try {
        let avatarUrl = profileData.avatar;

        // Upload the avatar if a new file is selected
        if (fileList.length > 0 && fileList[0].originFileObj) {
          const formData = new FormData();
          formData.append("avatar", fileList[0].originFileObj);

          const api = Api(); // Create an Axios instance
          const uploadResponse = await api.put(`/users/update/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include the token if required
            },
          });

          if (uploadResponse.status === 200) {
            avatarUrl = uploadResponse.data.data.avatar; // Get the uploaded avatar URL
          } else {
            throw new Error("Failed to upload avatar");
          }
        }

        // Prepare the profile update data
        const updateData = {
          avatar: avatarUrl, // Use the uploaded avatar URL
          fullname: values.fullname,
          dateOfBirth: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
          gender: values.gender && values.gender.toLowerCase() !== "-- none --" ? values.gender.toLowerCase() : null,
          address: `${values.city}, ${values.district}`,
          phoneNumber: values.phoneNumber,
          description: values.description ? values.description.trim() : null,
        };

        console.log("Update Data Sent to Backend:", updateData);

        // Send the profile update request
        const api = Api(); // Create an Axios instance
        const response = await api.put(`/users/update/${userId}`, updateData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.status === 200) {
          console.log("Update Response:", response.data);

          // Show success message
          message.success("Profile updated successfully!");

          // Delay the page refresh to allow the message to appear
          setTimeout(() => {
            window.location.reload(); // Refresh the page
          }, 1500); // 1.5 seconds delay
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        message.error("Failed to update profile.");
      } finally {
        setConfirmLoading(false);
      }
    }
  });

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
            // formik.setFieldValue('district', '0'); // Reset District về 0
          }
        });
    } else {
      setDistrictList([]); // Xóa danh sách quận huyện nếu không có thành phố nào được chọn
      formik.setFieldValue('district', '0'); // Reset District về 0
    }
  }, [formik.values.city]);

  const location = useLocation();
  const averageRating = location.state?.averageRating || 0;


  /* Modal Change Password */
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [confirmChangePasswordLoading, setConfirmChangePasswordLoading] = useState(false);

  const showChangePasswordModal = () => {
    setChangePasswordVisible(true);
  };

  const closeChangePasswordModal = () => {
    setChangePasswordVisible(false);
  };

  // Formik for Change Password
  const formikChangePassword = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(6, '*Old Password must be at least 6 characters or more')
        .required('* Required'),
      newPassword: Yup.string()
        .min(6, '* Password must be at least 6 characters or more')
        .notOneOf([Yup.ref('oldPassword'), null], '*New Password cannot be the same as Old Password')
        .required('* Required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], '* Confirm New Password must match New Password')
        .required('* Please enter your confirm New Password')
    }),

    // onSubmit: (values) => {
    //   setConfirmChangePasswordLoading(true);
    //   setTimeout(() => {
    //     message.success("Password changed successfully!");

    //     // Xử lý khi bấm Change Password
    //     setConfirmChangePasswordLoading(false);
    //     setChangePasswordVisible(false);
    //     formikChangePassword.resetForm();
    //   }, 2000);
    // }

    onSubmit: async (values) => {
      setConfirmChangePasswordLoading(true);
      try {
        // Step 1: Verify the old password using the login action
        const loginPayload = { email: profileData.email, password: values.oldPassword };
        const loginResponse = await store.dispatch(login(loginPayload));

        console.log("Login Response:", loginResponse); // Debugging log

        if (loginResponse?.type === actionsType.AUTH_LOGIN_SUCCESS) {
          // Step 2: If old password is correct, update the password
          const api = Api(); // Create an Axios instance
          const response = await api.put(`/users/update/${userId}`, {
            password: values.newPassword
          }, {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include the token
            },
          });

          if (response.status === 200) {
            message.success("Password changed successfully!");
            setChangePasswordVisible(false);
            formikChangePassword.resetForm();
          } else {
            throw new Error(response.data?.message || "Failed to change password");
          }
        } else {
          // Step 3: If old password is incorrect, show an error message
          message.error("Incorrect Old Password");
        }
      } catch (error) {
        console.error("Error changing password:", error);
        message.error(error.response?.data?.message || "Failed to change password. Please try again.");
      } finally {
        setConfirmChangePasswordLoading(false);
      }
    }
  });

  return (
    <div className='worker-profile-container'>

      <button className='worker-change-pw-btn' onClick={showChangePasswordModal}><SettingOutlined /></button>

      <Modal
        title={<p className="worker-change-pw-title"><SettingOutlined /> Change Password</p>}
        open={changePasswordVisible}
        onCancel={closeChangePasswordModal}
        footer={[
          <Button key="no" onClick={closeChangePasswordModal} size="large"> Cancel </Button>,
          <Button
            key="yes"
            type="primary"
            size="large"
            onClick={formikChangePassword.handleSubmit}
            loading={confirmChangePasswordLoading}
          >
            Change Password
          </Button>
        ]}
        width={500}
      >
        <div className="worker-change-pw-content">
          <div className="modal-worker-field">
            <p><span>*</span> Old Password: </p>
            <Form.Item
              validateStatus={formikChangePassword.errors.oldPassword && formikChangePassword.touched.oldPassword ? 'error' : ''}
              help={formikChangePassword.errors.oldPassword && formikChangePassword.touched.oldPassword ? formikChangePassword.errors.oldPassword : ''}
            >
              <Input.Password
                className='input'
                size="large"
                placeholder="Old Password"
                id="oldPassword"
                name="oldPassword"
                onChange={formikChangePassword.handleChange}
                onBlur={formikChangePassword.handleBlur}
                value={formikChangePassword.values.oldPassword}
              />
            </Form.Item>
          </div>

          <div className="modal-worker-field">
            <p><span>*</span> New Password: </p>
            <Form.Item
              validateStatus={formikChangePassword.errors.newPassword && formikChangePassword.touched.newPassword ? 'error' : ''}
              help={formikChangePassword.errors.newPassword && formikChangePassword.touched.newPassword ? formikChangePassword.errors.newPassword : ''}
            >
              <Input.Password
                className='input'
                size="large"
                placeholder="New Password"
                id="newPassword"
                name="newPassword"
                onChange={formikChangePassword.handleChange}
                onBlur={formikChangePassword.handleBlur}
                value={formikChangePassword.values.newPassword}
              />
            </Form.Item>
          </div>

          <div className="modal-worker-field">
            <p><span>*</span> Confirm New Password: </p>
            <Form.Item
              validateStatus={formikChangePassword.errors.confirmNewPassword && formikChangePassword.touched.confirmNewPassword ? 'error' : ''}
              help={formikChangePassword.errors.confirmNewPassword && formikChangePassword.touched.confirmNewPassword ? formikChangePassword.errors.confirmNewPassword : ''}
            >
              <Input.Password
                className='input'
                size="large"
                placeholder="Confirm New Password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                onChange={formikChangePassword.handleChange}
                onBlur={formikChangePassword.handleBlur}
                value={formikChangePassword.values.confirmNewPassword}
              />
            </Form.Item>
          </div>
        </div>
      </Modal>

      <button className='worker-edit-profile-btn' onClick={showConfirmModal}><FormOutlined /></button>

      <Modal
        title={<p className='worker-edit-profile-title'>  <EditOutlined /> &#160;Edit Profile </p>}
        open={confirmVisible}
        onCancel={closeConfirm}
        footer={[
          <Button key="no" onClick={closeConfirm} size='large'>Cancel</Button>,
          <Button key="yes" type="primary" size='large' onClick={formik.handleSubmit} loading={confirmLoading}>
            Save
          </Button>
        ]}
        width={1000}
      >

        <div className="worker-edit-profile-content">
          <div className="modal-worker-avatar">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
              beforeUpload={() => false} // Disable the default POST request
            >
              {fileList.length >= 1 ? null : (
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              )}
            </Upload>

            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </div>
          <div className="modal-worker-double-field">
            <div className="modal-worker-field">
              <p><span>*</span> Name: </p>
              <Form.Item
                validateStatus={formik.errors.fullname && formik.touched.fullname ? "error" : ""}
                help={formik.errors.fullname && formik.touched.fullname ? formik.errors.fullname : ""}
              >
                <Input
                  className='input'
                  size="large"
                  placeholder="Fullname"
                  id="fullname"
                  name="fullname"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullname}
                />
              </Form.Item>
            </div>
            <div className="modal-worker-field">
              <p><span>*</span> Email: </p>
              <Form.Item
                validateStatus={formik.errors.email && formik.touched.email ? "error" : ""}
                help={formik.errors.email && formik.touched.email ? formik.errors.email : ""}
              >
                <Input
                  className='input'
                  size="large"
                  // value="truongthiquynhgiang@example.com"
                  disabled
                  placeholder="Email"
                  id="email"
                  name="email"
                  type="text"
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal-worker-trible-field">
            <div className="modal-worker-field">
              <p><span>*</span> Phone Number: </p>
              <Form.Item
                validateStatus={formik.errors.phoneNumber && formik.touched.phoneNumber ? "error" : ""}
                help={formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : ""}
              >
                <Input
                  className='input'
                  size="large"
                  placeholder="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                />
              </Form.Item>
            </div>
            <div className="modal-worker-field">
              <p><span>*</span> Date of Birth: </p>
              <Form.Item
                validateStatus={formik.errors.dob && formik.touched.dob ? "error" : ""}
                help={formik.errors.dob && formik.touched.dob ? formik.errors.dob : ""}
              >
                <DatePicker
                  className='input dob'
                  size="large"
                  format="DD/MM/YYYY"
                  value={formik.values.dob ? dayjs(formik.values.dob) : null}
                  defaultPickerValue={dayjs().subtract(18, 'year')}
                  onChange={(date) => {
                    formik.setFieldValue('dob', date ? date.toDate() : null); // Chuyển đổi thành đối tượng Date
                  }}
                  onBlur={() => formik.setFieldTouched('dob', true)}
                  disabledDate={(current) => {
                    // Không cho chọn ngày sau ngày hôm nay - 18 năm
                    const eighteenYearsAgo = new Date();
                    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                    return current && current.isAfter(eighteenYearsAgo, 'day');
                  }}
                />
              </Form.Item>
            </div>
            <div className="modal-worker-field">
              <p className='gender'><span>*</span> Gender: </p>
              <Form.Item
                validateStatus={formik.errors.gender && formik.touched.gender ? "error" : ""}
                help={formik.errors.gender && formik.touched.gender ? formik.errors.gender : ""}
              >
                <Select
                  style={{
                    width: '100%',
                    margin: '0% 0 1%',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  placeholder="Select Gender"
                  showSearch
                  value={formik.values.gender || undefined}  // Sử dụng Formik để lấy giá trị
                  onChange={(value) => formik.setFieldValue("gender", value || "")}  //Đảm bảo giá trị khi sử dụng allowClear là một chuỗi rỗng khi null hoặc undefined
                  onBlur={() => formik.setTouched({ gender: true })}
                  allowClear
                >
                  <Select.Option value="0" disabled>
                    Select Gender
                  </Select.Option>
                  <Select.Option value="Any">Any</Select.Option>
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="modal-worker-double-field">
            <div className="modal-worker-field">
              <p className='city'><span>*</span> City: </p>
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
                  // placeholder={
                  //   <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  //     <EnvironmentOutlined />
                  //     Select Province/City
                  //   </span>
                  // }
                  value={formik.values.city || undefined}
                  onChange={(value) => {
                    formik.setFieldValue("city", value);
                    formik.setFieldValue("district", '0'); // Reset district về '0' khi city thay đổi
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  allowClear
                >
                  <Select.Option value="0" disabled>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

                      Select Province/City
                    </span>
                  </Select.Option>

                  {/* Danh sách tỉnh/thành từ API */}
                  {cityList.map((city) => (
                    <Select.Option key={city.full_name} value={city.full_name}>
                      {city.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="modal-worker-field">
              <p className='district'><span>*</span> District: </p>
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
                  disabled={!formik.values.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành
                  allowClear
                >
                  <Select.Option value="0" disabled>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Select District
                    </span>
                  </Select.Option>

                  {/* Danh sách quận/huyện dựa trên tỉnh đã chọn */}
                  {districtList.map((district) => (
                    <Select.Option key={district.full_name} value={district.full_name}>
                      {district.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="modal-worker-description">
            <p>About Me: </p>
            {/* <p><span>*</span> About Me: </p> */}
            <Form.Item
              validateStatus={formik.errors.description && formik.touched.description ? "error" : ""}
              help={formik.errors.description && formik.touched.description ? formik.errors.description : ""}
            >
              {/* <TextArea
                className='input'
                size="large"
                placeholder="Input a description about yourself..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                value={formik.values.description}
                style={{ height: 150, resize: 'none' }}
              /> */}
              <ReactQuill
                theme="snow"
                value={formik.values.description}
                onChange={(value) => formik.setFieldValue("description", value)}
                // onChange={(value) => {
                //   formik.setFieldValue("description", value);
                //   formik.setFieldTouched("description", true, true); // Đánh dấu là đã 'touched' + validate ngay lập tức
                // }}
                onBlur={() => formik.setFieldTouched("description", true)}
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </Form.Item>
          </div>
        </div>
      </Modal>


      <div className="worker-profile-left">

        <div className="worker-identity">
          {/* <img src={profileData.avatar} /> */}
          {profileData.avatar ? (
            <img src={profileData.avatar} />
          ) : (
            <p className='no-avatar'><UserOutlined /></p>
          )}
          <div className="worker-name-star">
            <p>{profileData.fullname || "Loading..."}</p>
            <div><Rate defaultValue={averageRating} allowHalf disabled /></div>
          </div>
        </div>

        <div className="worker-view-rating-btn">
          <button onClick={() => navigate('/worker/worker-ratings', window.scrollTo(0, 0))}>
            <EyeOutlined /> &#160;View Review
          </button>
        </div>
      </div>

      <div className="worker-profile-right">
        <div className="worker-info">
          <p className='worker-email'><MailOutlined /> {profileData.email}</p>
          <p><UserSwitchOutlined /> {profileData.gender || "-- None --"}  </p>
        </div>
        <div className="worker-info">
          <p><EnvironmentOutlined />
            {profileData.city && profileData.city !== "0"
              ? profileData.district && profileData.district !== "0"
                ? `${profileData.city}, ${profileData.district}`
                : profileData.city
              : "-- None --"}
          </p>
          <p><PhoneOutlined rotate={90} /> {profileData.phoneNumber || "-- None --"} </p>
        </div>
        <div className="worker-info">
          <p><GiftOutlined /> {profileData.dob ? dayjs(profileData.dob).format("DD/MM/YYYY") : "-- None --"}</p>
        </div>
        <div className='worker-description'>
          <p> <IdcardOutlined /> About me: </p>
          {/* <p>{profileData.description || "-- None --"}</p> */}
          {(() => {
            const div = document.createElement("div");
            div.innerHTML = profileData.description || "";
            const text = div.textContent?.trim();

            // return text
            //   ? <div className='worker-description-content' dangerouslySetInnerHTML={{ __html: profileData.description }} style={{ whiteSpace: 'pre-wrap' }} /> // white-space: pre-wrap trong CSS để giữ nguyên khoảng trắng
            //   : <p>-- None --</p>;
            return text && text !== "-- None --" ? (
              <div className='worker-description-content' dangerouslySetInnerHTML={{ __html: profileData.description }} style={{ whiteSpace: 'pre-wrap' }} />
            ) : (
              <p>-- None --</p>
            );
          })()}
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile