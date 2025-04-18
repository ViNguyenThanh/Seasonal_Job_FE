import React, { useEffect, useState } from 'react'
import './WorkerProfile.css'
import { Button, DatePicker, Form, Image, Input, message, Modal, Rate, Select, Upload } from 'antd'
import { EditOutlined, EnvironmentOutlined, EyeOutlined, FormOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
const { TextArea } = Input;
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Giao diện mặc định
import { useLocation, useNavigate } from 'react-router-dom';


const WorkerProfile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    // avatar: avatar,
    avatar: '',
    fullname: 'Trương Thị Quỳnh Giang',
    email: 'truongthiquynhgiang@example.com',
    phoneNumber: '0123456789',
    dob: '01/01/2000',
    gender: 'Female',
    city: 'Tỉnh Tây Ninh',
    district: 'Huyện Dương Minh Châu',
    description: `I am an energetic individual with experience in seasonal jobs such as sales, customer service support, and gift wrapping during holidays. I have also worked in production environments with high workloads and participated in event organization, assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure, and quickly adjust to job demands.`
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

    // Kiểm tra nếu không có ảnh trong fileList
    if (newFileList.length === 0) {
      setProfileData(prev => ({
        ...prev,
        avatar: '', // Đặt avatar thành chuỗi rỗng khi không có ảnh
      }));
    } else if (newFileList.length > 0 && newFileList[0].status === "done") {
      getBase64(newFileList[0].originFileObj).then(base64 => {
        setProfileData(prev => ({
          ...prev,
          avatar: base64
        }));
      });
    }
  };


  /* Modal Review */
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    formik.setValues({
      fullname: profileData.fullname || '',
      email: profileData.email || '',
      phoneNumber: profileData.phoneNumber || '',
      dob: profileData.dob ? dayjs(profileData.dob).toDate() : null,
      gender: profileData.gender || '',
      city: profileData.city || '',
      district: profileData.district || '',
      description: profileData.description || '',
    });
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
    validationSchema: Yup.object({
      fullname: Yup.string()
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
      gender: Yup.string()
        // .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "* You must be at least 18 years old"),
        .required("* Required"),
      city: Yup.string()
        .notOneOf(["0"], "* Province/City must be selected")
        .required("* Required"),
      district: Yup.string()
        .notOneOf(["0"], "* District must be selected")
        .required("* Required"),
      description: Yup.string()
        // .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        // .test("not-empty", "* Required", value => {
        //   const div = document.createElement("div");
        //   div.innerHTML = value || "";
        //   const plainText = div.textContent || div.innerText || ""; // Chuyển HTML thành văn bản thuần túy
        //   return plainText.trim() !== ""; // Kiểm tra nếu chuỗi không rỗng
        // })

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
    onSubmit: (values) => {
      setConfirmLoading(true);
      setTimeout(() => {
        message.success('Edit profile successfully!');
        // Xử lý khi bấm Yes
        setConfirmLoading(false);
        setConfirmVisible(false);

        // Kiểm tra nếu chỉ có dấu cách hoặc chuỗi trống thì thay thế bằng "-- None --"
        const cleanedDescription = values.description.trim().length === 0 ? "-- None --" : values.description;

        setProfileData({
          ...values,
          description: cleanedDescription,
          email: 'truongthiquynhgiang@example.com', // Email giả định vì bị disable
          avatar: fileList[0]?.url || fileList[0]?.thumbUrl || profileData.avatar, // thêm dòng này để cập nhật ảnh
        });

        formik.resetForm();
      }, 2000);
    },
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

  return (
    <div className='worker-profile-container'>

      <button className='worker-edit-profile-btn' onClick={showConfirmModal}><FormOutlined /></button>

      <Modal
        title={<p className='worker-edit-profile-title'>  <EditOutlined /> &#160;Edit Profile </p>}
        open={confirmVisible}
        onCancel={closeConfirm}
        footer={[
          <Button key="no" onClick={closeConfirm} size='large'>No</Button>,
          <Button key="yes" type="primary" size='large' /*onClick={handleConfirm}*/ onClick={formik.handleSubmit} loading={confirmLoading}>
            Yes
          </Button>
        ]}
        width={1000}
      >
        <div className="worker-edit-profile-content">
          <div className="modal-worker-avatar">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              maxCount={1}
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
            <p>{profileData.fullname}</p>
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