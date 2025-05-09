/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './EmployerProfile.css'
import { Button, DatePicker, Form, Image, Input, message, Modal, Rate, Select, Upload } from 'antd'
import { EditOutlined, EnvironmentOutlined, EyeOutlined, FormOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
const { TextArea } = Input;
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Giao diện mặc định
import { useLocation, useNavigate } from 'react-router-dom';
import { userApi } from '../../../apis/user.request';
import { getToken, getUserFromToken } from '../../../utils/Token';
import { Api } from '../../../utils/BaseUrlServer';
import { login } from '../../../redux/actions/auth.action';
import store from "../../../store/ReduxStore";
import actionsType from '../../../redux/actions/action.type';
import { serviceApi } from '../../../apis/service.request';
import { formatDate } from '../../../utils/formatDate';



const EmployerProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = getToken(); // Get the token
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        const { id } = decodedToken; // Extract user ID from the token

        const response = await userApi.getUserById(id); // Fetch the profile data
        const data = response.data.data;
        setUserId(id);

        // console.log("Fetched Employer Profile Data:", data); // Log the fetched data

        setProfileData({
          avatar: data.avatar || '',
          companyName: data.companyName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          // dob: data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '-- None --', // Properly format dateOfBirth
          dob: data.dateOfBirth, // Properly format dateOfBirth
          city: data.address ? data.address.split(',')[0].trim() : '-- None --',
          district: data.address ? data.address.split(',')[1]?.trim() || '-- None --' : '-- None --',
          description: data.description || '-- None --',
        });

        if (data.Reviews.length > 0) {
          const average = data.Reviews.reduce((total, review) => total + review.rating, 0) / data.Reviews.length;
          const newAverating = parseFloat(average.toFixed(2));
          // console.log(newAverating);
          setAverageRating(newAverating);
          setReviews(data.Reviews);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        message.error("Failed to fetch profile data.");
      }
    };

    fetchProfileData();
  }, []);

  const [profileData, setProfileData] = useState({
    avatar: '',
    companyName: 'CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ NHÂN LỰC TRÍ VIỆT',
    email: 'truongthiquynhgiang@example.com',
    phoneNumber: '0123456789',
    dob: '01/01/2000',
    city: 'Tỉnh Tây Ninh',
    district: 'Huyện Dương Minh Châu',
    description: 'CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ NHÂN LỰC TRÍ VIỆT chuyên cung cấp các dịch vụ nhân sự chất lượng cao, bao gồm tuyển dụng, đào tạo và cung cấp nguồn nhân lực cho các doanh nghiệp tại Việt Nam, với đội ngũ nhân viên giàu kinh nghiệm và chuyên nghiệp.'
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

  // const handleChange = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);

  //   // Kiểm tra nếu không có ảnh trong fileList
  //   if (newFileList.length === 0) {
  //     setProfileData(prev => ({
  //       ...prev,
  //       avatar: '', // Đặt avatar thành chuỗi rỗng khi không có ảnh
  //     }));
  //   } else if (newFileList.length > 0 && newFileList[0].status === "done") {
  //     getBase64(newFileList[0].originFileObj).then(base64 => {
  //       setProfileData(prev => ({
  //         ...prev,
  //         avatar: base64
  //       }));
  //     });
  //   }
  // };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // If a new file is selected, update the preview
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      getBase64(newFileList[0].originFileObj).then((base64) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: base64, // Update the avatar preview
        }));
      });
    } else {
      setProfileData((prev) => ({
        ...prev,
        avatar: '', // Clear the avatar preview if no file is selected
      }));
    }
  };


  /* Modal Review */
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    formik.setValues({
      companyName: profileData.companyName || '',
      email: profileData.email || '',
      phoneNumber: profileData.phoneNumber || '',
      dob: profileData.dob ? dayjs(profileData.dob).toDate() : null,
      gender: profileData.gender || '',
      city: profileData.city || '',
      district: profileData.district || '',
      description: profileData.description || '',
    });

    // Preload the current avatar into the fileList
    const initialFileList = profileData.avatar
      ? [
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: profileData.avatar, // Use the current avatar URL
        },
      ]
      : [];

    setFileList(initialFileList); // Update the fileList state
    setConfirmVisible(true); // Open the modal
  };


  // Đóng modal
  const closeConfirm = () => {
    setConfirmVisible(false);
    // setFileList([
    //   // {
    //   //   uid: '-1',
    //   //   name: 'avatar.png',
    //   //   status: 'done',
    //   //   url: profileData.avatar,
    //   // }
    // ]);

    setFileList(
      profileData.avatar
        ? [
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: profileData.avatar, // Use the current avatar URL
          },
        ]
        : []
    );

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
      companyName: '',
      email: '',
      phoneNumber: '',
      dob: '',
      city: '',
      district: '',
      description: '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
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
        .required("* Required"),
      email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "* Invalid Email")
        .required("* Required"),
      phoneNumber: Yup.string()
        // .matches(`[^a-zA-Z]+`, "Numbers only")
        .matches(/^\S+$/, "* Phone numbers cannot contain spaces")
        .matches(/^\d+$/, "* Numbers only")
        .matches(`^[0][1-9]*`, "* Phone number must start with 0")
        .max(10, "* Phone number must be 10 digits")
        .min(10, "* Phone number must be 10 digits")
        .required("* Required"),
      dob: Yup.date()
        // .nullable(),
        .required("* Required"),
      city: Yup.string()
        .notOneOf(["0"], "* Province/City must be selected")
        .required("* Required"),
      district: Yup.string()
        .notOneOf(["0"], "* District must be selected")
        .required("* Required"),
      description: Yup.string()
        // .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        .test("not-empty", "* Required", value => {
          const div = document.createElement("div");
          div.innerHTML = value || "";
          const plainText = div.textContent || div.innerText || ""; // Chuyển HTML thành văn bản thuần túy
          return plainText.trim() !== ""; // Kiểm tra nếu chuỗi không rỗng
        })

        // khi ko bắt lỗi Required thì không cho người dùng nhập khoảng trắng(dấu cách) không
        // .test("no-leading-space", "* No spaces at the beginning", value => {
        //   const div = document.createElement("div");
        //   div.innerHTML = value || "";
        //   const plainText = div.textContent || div.innerText || "";
        //   return !/^\s/.test(plainText);
        // })
        .test("no-question-mark", '* Cannot contain "?" character', value => !/\?/.test(value || "")),
      // .required("* Required"),
    }),
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
          companyName: values.companyName.trim(),
          phoneNumber: values.phoneNumber,
          dateOfBirth: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
          address: `${values.city}, ${values.district}`,
          description: values.description.trim(),
          avatar: avatarUrl, // Use the uploaded avatar URL
        };

        // console.log("Update Data Sent to Backend:", updateData);

        // Send the profile update request
        const api = Api(); // Create an Axios instance
        const response = await api.put(`/users/update/${userId}`, updateData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.status === 200) {
          // console.log("Update Response:", response.data);

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

        // console.log("Login Response:", loginResponse); // Debugging log

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

  const [serviceDate, setServiceDate] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { user } = getUserFromToken();
        const res = await serviceApi.getServices();
        if (res.data.length > 0) {
          const existService = res.data.filter(service => service.userId === user.id && service.status === 'active');
          // console.log(existService);

          if (existService.length > 0) {
            // B1: Tìm ngày tạo sớm nhất
            const earliestDate = new Date(
              existService.reduce((minDate, service) => {
                return new Date(service.createdAt) < new Date(minDate)
                  ? service.createdAt
                  : minDate;
              }, existService[0].createdAt)
            );

            // B2: Tính tổng số tháng từ description
            const totalMonths = existService.reduce((sum, service) => {
              const months = parseInt(service.description, 10);
              return sum + (isNaN(months) ? 0 : months);
            }, 0);

            // B3: Tính ngày hết hạn
            const expiredDate = new Date(earliestDate);
            expiredDate.setMonth(expiredDate.getMonth() + totalMonths);

            setServiceDate({
              earliestDate: earliestDate.toISOString(),
              totalMonths,
              expiredDate: expiredDate.toISOString()
            });
            console.log("Ngày bắt đầu:", earliestDate.toISOString());
            console.log("Tổng số tháng:", totalMonths);
            console.log("Ngày hết hạn:", expiredDate.toISOString());
          }
        }

      } catch (error) {
        console.log(error);
      }
    }
    fetchService()
  }, [])

  return (
    <div className='employer-profile-container'>

      <button className='employer-change-pw-btn' onClick={showChangePasswordModal}><SettingOutlined /></button>

      <Modal
        title={<p className="employer-change-pw-title"><SettingOutlined /> Change Password</p>}
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
        <div className="employer-change-pw-content">
          <div className="modal-employer-field">
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

          <div className="modal-employer-field">
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

          <div className="modal-employer-field">
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

      <button className='employer-edit-profile-btn' onClick={showConfirmModal}><FormOutlined /></button>

      <Modal
        title={<p className='employer-edit-profile-title'>  <EditOutlined /> &#160;Edit Profile </p>}
        open={confirmVisible}
        onCancel={closeConfirm}
        footer={[
          <Button key="no" onClick={closeConfirm} size='large'>Cancel</Button>,
          <Button key="yes" type="primary" size='large' /*onClick={handleConfirm}*/ onClick={formik.handleSubmit} loading={confirmLoading}>
            Save
          </Button>
        ]}
        width={1000}
      >
        <div className="employer-edit-profile-content">
          <div className="modal-employer-avatar">
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
          <div className="modal-employer-double-field">
            <div className="modal-employer-field">
              <p><span>*</span> Name: </p>
              <Form.Item
                validateStatus={formik.errors.companyName && formik.touched.companyName ? "error" : ""}
                help={formik.errors.companyName && formik.touched.companyName ? formik.errors.companyName : ""}
              >
                <Input
                  className='input'
                  size="large"
                  placeholder="Company Name"
                  id="companyName"
                  name="companyName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}
                />
              </Form.Item>
            </div>
            <div className="modal-employer-field">
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
          <div className="modal-employer-double-field">
            <div className="modal-employer-field">
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
            <div className="modal-employer-field">
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
                  // defaultPickerValue={dayjs().subtract(18, 'year')}
                  onChange={(date) => {
                    formik.setFieldValue('dob', date ? date.toDate() : null); // Chuyển đổi thành đối tượng Date
                  }}
                  onBlur={() => formik.setFieldTouched('dob', true)}
                  disabledDate={(current) => current && current.isAfter(dayjs(), 'day')} // Không cho chọn ngày trong tương lai
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal-employer-double-field">
            <div className="modal-employer-field">
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
            <div className="modal-employer-field">
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
          <div className="modal-employer-description">
            <p><span>*</span> Company Description: </p>
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


      <div className="employer-profile-left">

        <div className="employer-identity">
          {/* <img src={profileData.avatar} /> */}
          {profileData.avatar ? (
            <img src={profileData.avatar} />
          ) : (
            <p className='no-avatar'><UserOutlined /></p>
          )}
          <div className="employer-name-star">
            <p>{profileData.companyName}</p>
            <div><Rate allowHalf value={averageRating} disabled /></div>
          </div>
        </div>

        {serviceDate && (
          <div className="employer-premium-card">
            <p className="premium-title">
              ✨ Premium Account
            </p>
            <p className="premium-date">
              Effective Date: {formatDate(serviceDate?.earliestDate)}
            </p>
            <p className="premium-date">
              Expiry Date: {formatDate(serviceDate?.expiredDate)}
            </p>
          </div>
        )}

        <div className="employer-view-rating-btn">
          <button onClick={() => navigate('/employer/employer-ratings', { state: userId }, window.scrollTo(0, 0))}>
            <EyeOutlined /> &#160;View Review
          </button>
        </div>
      </div>

      <div className="employer-profile-right">
        <div className="employer-info">
          <p className='employer-email'><MailOutlined /> {profileData.email}</p>
          <p><GiftOutlined /> {profileData.dob ? dayjs(profileData.dob).format("DD/MM/YYYY") : "-- None --"}</p>
        </div>
        <div className="employer-info">
          <p><EnvironmentOutlined />
            {profileData.city && profileData.city !== "0"
              ? profileData.district && profileData.district !== "0"
                ? `${profileData.city}, ${profileData.district}`
                : profileData.city
              : "-- None --"}
          </p>
          <p><PhoneOutlined rotate={90} /> {profileData.phoneNumber || "-- None --"} </p>
        </div>
        <div className='employer-description'>
          <p> <IdcardOutlined /> Company Description: </p>
          {/* <p>{profileData.description || "-- None --"}</p> */}
          {(() => {
            const div = document.createElement("div");
            div.innerHTML = profileData.description || "";
            const text = div.textContent?.trim();

            // return text
            //   ? <div className='employer-description-content' dangerouslySetInnerHTML={{ __html: profileData.description }} style={{ whiteSpace: 'pre-wrap' }} /> // white-space: pre-wrap trong CSS để giữ nguyên khoảng trắng
            //   : <p>-- None --</p>;
            return text && text !== "-- None --" ? (
              <div className='employer-description-content' dangerouslySetInnerHTML={{ __html: profileData.description }} style={{ whiteSpace: 'pre-wrap' }} />
            ) : (
              <p>-- None --</p>
            );
          })()}
        </div>
      </div>
    </div>
  )
}

export default EmployerProfile