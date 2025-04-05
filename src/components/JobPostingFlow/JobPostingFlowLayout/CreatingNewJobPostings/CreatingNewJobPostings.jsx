import React, { useEffect, useRef, useState } from 'react'
import './CreatingNewJobPostings.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Collapse, Form, Input, InputNumber, Rate, Select } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;

const CreatingNewJobPostings = ({ numberOfJobPostings, jobPostings, setJobPostings, setCheckErrorJobPostings }) => {
  const [cityList, setCityList] = useState([]);
  // bỏ => nếu không district không riêng biệt index với các field city khác nhau
  // const [districtList, setDistrictList] = useState([]);
  const [districtList, setDistrictList] = useState({}); // Lưu district theo index
  const [wardList, setWardList] = useState({});  // Lưu ward theo index
  const [activeKeys, setActiveKeys] = useState([]);  // Khai báo activeKeys
  // const previousDistrictValue = useRef(null);
  // const previousCityValue = useRef(null);
  const handleCollapseChange = (key) => {
    setActiveKeys(key);
  };

  const renderJobPostingForm = (index) => {
    // Khởi tạo Formik cho từng job posting
    const formik = useFormik({
      initialValues: {
        jobPostingName: jobPostings[index]?.jobPostingName || '',
        address: jobPostings[index]?.address || '',
        city: jobPostings[index]?.city || '',
        district: jobPostings[index]?.district || '',
        ward: jobPostings[index]?.ward || '',
        numberOfPeople: jobPostings[index]?.numberOfPeople || '',
        salary: jobPostings[index]?.salary || '',
        jobType: jobPostings[index]?.jobType || '',
        // specialSkills: jobPostings[index]?.specialSkills || '',
        rating: jobPostings[index]?.rating || '',
        gender: jobPostings[index]?.gender || '',
        descriptionJobPosting: jobPostings[index]?.descriptionJobPosting || '',
      },
      validationSchema: Yup.object({
        jobPostingName: Yup.string()
          .test('no-leading-space', '* No spaces at the beginning', value => {
            return value ? !/^\s/.test(value) : false;
          })
          .test('no-extra-space', '* No extra spaces allowed', value => {
            return value ? !/ {2,}/.test(value) : false;
          })
          .test('no-question-mark', '* Cannot contain "?" character', value => {
            return value ? !/\?/.test(value) : false;
          })
          .test('capitalize-words', '* Each word must start with an uppercase letter', value => {
            if (!value) return false;

            return value.split(' ').every(word => {
              // Nếu từ rỗng thì bỏ qua
              if (!word) return true;

              const firstChar = word.charAt(0); // Lấy ký tự đầu tiên của từ
              const firstCharUpper = firstChar.toUpperCase(); // Chuyển sang chữ hoa
              const firstCharLower = firstChar.toLowerCase(); // Chuyển sang chữ thường

              // Nếu ký tự đầu tiên là chữ cái (A-Z, a-z, hoặc có dấu như Ầ, Ế, Ư, Đ)
              if (/[A-Za-zÀ-Ỹà-ỹ]/.test(firstChar)) {
                return firstChar === firstCharUpper; // Phải viết hoa
              }

              return true; // Nếu không phải chữ cái, bỏ qua
            });
          })
          .max(120, "* Job Group Name cannot be longer than 120 characters")
          .required("* Required"),
        address: Yup.string()
          .test('no-leading-space', '* No spaces at the beginning', value => {
            return value ? !/^\s/.test(value) : false;
          })
          .test('no-extra-space', '* No extra spaces allowed', value => {
            return value ? !/ {2,}/.test(value) : false;
          })
          .matches(/^[\p{L}0-9\s\-\/,.:()#]+$/u, '* Only valid characters are allowed: - / , . : () #')
          .required("* Required"),
        city: Yup.string()
          .notOneOf(["0"], "* Province/City must be selected")
          .required("* Required"),
        district: Yup.string()
          .notOneOf(["0"], "* District must be selected")
          .required("* Required"),
        ward: Yup.string()
          .notOneOf(["0"], "* Ward must be selected")
          .required("* Required"),
        numberOfPeople: Yup.number()
          .required("* Required"),
        salary: Yup.number()
          .min(1000, "* Must be greater than 1000 VND.")
          .required("* Required"),
        jobType: Yup.string()
          .matches(
            /^[^0-9]*$/,
            "* Job Type cannot be entered in numbers"
          )
          .matches(
            /^[^!@#$%^&*(),.?":;{}|<>]*$/,
            "* Job Type cannot contain special characters"
          )
          .matches(
            /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/,
            "* Each word must have its first letter capitalized"
          )
          .max(120, "* Job Type cannot be longer than 120 characters"),
        // specialSkills: Yup.string(),
        rating: Yup.number()
          // .min(0.5, "* You must rate at least 0.5 star")
          .required("* Required"),
        gender: Yup.string(),
        descriptionJobPosting: Yup.string().required("* Required"),
      }),

      onSubmit: (values) => {
        // Handle form submission for individual job posting
        console.log(`Job posting ${index + 1} submitted:`, values);
        alert(`district: ${values.district}`);
      },
    });

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
      if (formik.values.city) {
        const selectedCity = cityList.find((city) => city.full_name === formik.values.city);
        if (selectedCity) {
          fetch(`https://esgoo.net/api-tinhthanh/2/${selectedCity.id}.htm`)
            .then((response) => response.json())
            .then((districtData) => {
              if (districtData.error === 0) {
                // bỏ => nếu không district không riêng biệt index với các field city khác nhau
                // setDistrictList(districtData.data);
                setDistrictList((prevDistrictLists) => ({
                  ...prevDistrictLists,
                  [index]: districtData.data, // Lưu danh sách quận cho job posting này
                }));
                // bỏ cái này vì bấm next hay previous thì khi về lại file nè giá trị bị set về 0
                //formik.setFieldValue('district', '0'); 
              }
            });
        }
      }
      else {
        // bỏ => nếu không district không riêng biệt index với các field city khác nhau
        // setDistrictList([]); // Xóa danh sách quận huyện nếu không có thành phố nào được chọn
        setDistrictList((prevDistrictLists) => ({
          ...prevDistrictLists,
          [index]: [], // Nếu không có thành phố nào được chọn, xóa danh sách quận cho job posting này
        }));
        formik.setFieldValue('district', '0');
      }
    }, [formik.values.city, cityList, index]); // Re-run when city or cityList changes

    useEffect(() => {
      const selectedDistrict = districtList[index]?.find(district => district.full_name === formik.values.district);
      if (selectedDistrict) {
        fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`)
          .then((response) => response.json())
          .then((wardData) => {
            if (wardData.error === 0) {
              // Lưu ward theo index của job posting
              setWardList((prevWardLists) => ({
                ...prevWardLists,
                [index]: wardData.data, // Lưu theo index của job posting
              }));
              // formik.setFieldValue('ward', '0'); // Reset Ward khi district thay đổi
            }
          });
      }
      else {
        setWardList((prevWardLists) => ({
          ...prevWardLists,
          [index]: [], // Lưu theo index của job posting
        }));
        // formik.setFieldValue('ward', '0');
      }
    }, [formik.values.district, districtList, index]); // Khi district thay đổi

    useEffect(() => {
      if (formik.errors.jobPostingName || formik.errors.address || formik.errors.salary) {
        setCheckErrorJobPostings(true);
      } else {
        setCheckErrorJobPostings(false);
      }
      setJobPostings((prevJobPostings = []) => { // Đảm bảo prevJobPostings là một mảng
        const updatedJobPostings = [...prevJobPostings];
        updatedJobPostings[index] = formik.values;
        return updatedJobPostings;
      });
    }, [formik.values, index, formik.errors]);

    return (
      <form onSubmit={formik.handleSubmit} className='creating-new-job-postings-form'>
        <div className='job-postings-field'>
          <p className='title'><span>*</span> Job Posting Name: </p>
          <Form.Item
            validateStatus={formik.errors.jobPostingName && formik.touched.jobPostingName ? "error" : ""}
            help={formik.errors.jobPostingName && formik.touched.jobPostingName ? formik.errors.jobPostingName : ""}
          >
            <Input
              className='input'
              size="large"
              placeholder="Input Job Posting Name here..."
              id="jobPostingName"
              name="jobPostingName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobPostingName}
            />
          </Form.Item>
        </div>

        <div className='job-postings-field'>
          <p className='title'><span>*</span> Address (House number): </p>
          <Form.Item
            validateStatus={formik.errors.address && formik.touched.address ? "error" : ""}
            help={formik.errors.address && formik.touched.address ? formik.errors.address : ""}
          >
            <Input
              className='input'
              size="large"
              placeholder="Input Address here..."
              id="address"
              name="address"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
          </Form.Item>
        </div>

        <div className='job-postings-info'>
          <div className="job-postings-address">
            <p className='title'><span>*</span> City: </p>
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
                // onChange={(value) => formik.setFieldValue("city", value)}
                onChange={(value) => {
                  formik.setFieldValue("city", value);
                  formik.setFieldValue("district", '0'); // Reset district về '0' khi city thay đổi
                  formik.setFieldValue("ward", '0');
                }}
                onBlur={() => formik.setFieldTouched("city", true)}
                allowClear
              >
                <Select.Option value="0" disabled>
                  Select Province/City
                </Select.Option>

                {/* Danh sách tỉnh/thành từ API */}
                {cityList.map((city) => (
                  <Select.Option key={city.full_name} value={city.full_name}> {city.full_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className='job-postings-address'>
            <p className='title'><span>*</span> District: </p>
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
                // onChange={(value) => formik.setFieldValue("district", value)}
                onChange={(value) => {
                  formik.setFieldValue("district", value);
                  formik.setFieldValue("ward", '0');
                }}
                onBlur={() => formik.setFieldTouched("district", true)}
                // disabled={!formik.values.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành
                disabled={!formik.values.city || formik.values.city === '0'}
                allowClear
              >
                <Select.Option value="0" disabled>
                  Select District
                </Select.Option>

                {/* Danh sách quận/huyện dựa trên tỉnh đã chọn */}
                {/* thêm [index]? để district riêng biệt index với các field city khác nhau */}
                {districtList[index]?.map((district) => (
                  <Select.Option key={district.full_name} value={district.full_name}>
                    {district.full_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className='job-postings-address'>
            <p className='title'><span>*</span> Ward: </p>
            <Form.Item
              validateStatus={formik.errors.ward && formik.touched.ward ? "error" : ""}
              help={formik.errors.ward && formik.touched.ward ? formik.errors.ward : ""}
            >
              <Select
                style={{
                  width: '100%',
                  margin: '0% 0 1%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                placeholder="Select Ward"
                value={formik.values.ward || undefined}
                onChange={(value) => formik.setFieldValue("ward", value)}
                onBlur={() => formik.setFieldTouched("ward", true)}
                disabled={!formik.values.city || !formik.values.district || formik.values.city === '0' || formik.values.district === '0'}
                allowClear
              >
                <Select.Option value="0" disabled>
                  Select Ward
                </Select.Option>
                {wardList[index]?.map((ward) => (  // Dùng index để lấy danh sách ward đúng
                  <Select.Option key={ward.full_name} value={ward.full_name}>
                    {ward.full_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>


        <div className='job-postings-info'>
          <div className="job-postings-number-of-people">
            <p className='title'><span>*</span> Number of workers: </p>
            <Form.Item
              validateStatus={formik.errors.numberOfPeople && formik.touched.numberOfPeople ? "error" : ""}
              help={formik.errors.numberOfPeople && formik.touched.numberOfPeople ? formik.errors.numberOfPeople : ""}
            >
              <InputNumber
                className='input'
                size="large"
                placeholder="Ex: 1"
                id="numberOfPeople"
                name="numberOfPeople"
                min={1} // Không cho nhập số âm hoặc 0
                // InputNumber nhận giá trị kiểu number, trong khi formik.handleChange mặc định xử lý event.target.value. 
                // //Vì vậy, cần dùng formik.setFieldValue thay vì formik.handleChange.
                onChange={(value) => formik.setFieldValue("numberOfPeople", value)}
                onBlur={() => formik.setTouched({ numberOfPeople: true })}
                value={formik.values.numberOfPeople}
              />
            </Form.Item>
          </div>

          <div className='job-postings-salary'>
            <p className='title'><span>*</span> Salary per person: </p>
            <Form.Item
              validateStatus={formik.errors.salary && formik.touched.salary ? "error" : ""}
              help={formik.errors.salary && formik.touched.salary ? formik.errors.salary : ""}
            >
              <InputNumber
                className='input'
                size="large"
                placeholder="Ex: 3.000.000"
                addonAfter="VND"
                id="salary"
                name="salary"
                min={1} // Không cho nhập số âm hoặc 0
                formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={(value) => value?.replace(/\./g, "")}
                // InputNumber nhận giá trị kiểu number, trong khi formik.handleChange mặc định xử lý event.target.value. 
                // //Vì vậy, cần dùng formik.setFieldValue thay vì formik.handleChange.
                onChange={(value) => formik.setFieldValue("salary", value)}
                onBlur={() => formik.setTouched({ salary: true })}
                value={formik.values.salary}
              />
            </Form.Item>
          </div>
        </div>

        <div className='job-postings-field'>
          <p className='title'> Job Type: </p>
          <Form.Item
            validateStatus={formik.errors.jobType && formik.touched.jobType ? "error" : ""}
            help={formik.errors.jobType && formik.touched.jobType ? formik.errors.jobType : ""}
          >
            <Input
              className='input'
              size="large"
              placeholder="Input Job Type here..."
              id="jobType"
              name="jobType"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobType}
            />
          </Form.Item>
        </div>

        {/* <div className='job-postings-field'>
          <p className='title'> Special Skills: </p>
          <Form.Item
            validateStatus={formik.errors.specialSkills && formik.touched.specialSkills ? "error" : ""}
            help={formik.errors.specialSkills && formik.touched.specialSkills ? formik.errors.specialSkills : ""}
          >
            <TextArea
              showCount
              maxLength={500}
              autoSize={{ minRows: 1, maxRows: 7 }}
              id="specialSkills"
              name="specialSkills"
              placeholder="Input Special Skills here..."
              style={{ height: 150, resize: 'none' }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.specialSkills}
            />
          </Form.Item>
        </div> */}

        <div className='job-postings-info'>
          <div className='job-postings-rating'>
            <p className='title'><span>*</span> Minimum rating for worker: </p>
            <Form.Item
              validateStatus={formik.errors.rating && formik.touched.rating ? "error" : ""}
              help={formik.errors.rating && formik.touched.rating ? formik.errors.rating : ""}
            >
              <Rate
                // allowHalf
                value={formik.values.rating}
                onChange={(value) => formik.setFieldValue("rating", value)}
                onBlur={() => formik.setFieldTouched("rating", true)}
              />
            </Form.Item>
          </div>
          <div className="job-postings-gender">
            <p className='title'>Gender: </p>
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
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>


        <div className='job-postings-field'>
          <p className='title'><span>*</span> Description: </p>
          <Form.Item
            validateStatus={formik.errors.descriptionJobPosting && formik.touched.descriptionJobPosting ? "error" : ""}
            help={formik.errors.descriptionJobPosting && formik.touched.descriptionJobPosting ? formik.errors.descriptionJobPosting : ""}
          >
            <TextArea
              showCount
              maxLength={2500}
              rows={10}
              id="descriptionJobPosting"
              name="descriptionJobPosting"
              placeholder="Input Job Posting Description here..."
              style={{ height: 300, resize: 'none' }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.descriptionJobPosting}
            />
          </Form.Item>
        </div>

        {/* <button type='submit'>Submit</button> */}
      </form>
    );
  };

  // Nếu ban đầu numberOfJobPostings là 2, tạo ra mảng jobPostings có 2 phần tử
  // và sửa lại numberOfJobPostings là 1 thì mảng jobPostings vẫn còn 2 phần tử
  // => sai logic
  // Sửa: Nếu numberOfJobPostings nhỏ hơn số lượng phần tử trong jobPostings
  // => cắt mảng jobPostings để chỉ giữ lại số lượng phần tử tương ứng với numberOfJobPostings.
  // slice(0, numberOfJobPostings) giúp giữ lại phần tử từ index 0 đến index numberOfJobPostings - 1.
  useEffect(() => {
    if (numberOfJobPostings < jobPostings.length) {
      setJobPostings(prevJobPostings => prevJobPostings.slice(0, numberOfJobPostings));
    }
  }, [numberOfJobPostings, jobPostings, setJobPostings]);

  return (
    <div className='creating-new-job-postings-container'>
      <p><span className='warning'>⚠️</span> <span className='yellow'>Important: </span>
        Total number of Job postings available is: <span className='rose'>{numberOfJobPostings || 'N/A'} </span>
      </p>

      <div className="creating-new-job-postings-collapse">
        {/* ko sai nhưng để cái này bị warning 
          Những cảnh báo này chỉ ra rằng một số thuộc tính bạn đang sử dụng đã bị lỗi thời 
          và sẽ bị loại bỏ trong phiên bản chính tiếp theo*/}
        {/* <Collapse activeKey={activeKeys} onChange={handleCollapseChange} expandIconPosition="end">
          {Array.from({ length: numberOfJobPostings }).map((_, index) => (
            <Panel header={`Job posting ${index + 1}`} key={index + 1}>
              {renderJobPostingForm(index)}
            </Panel>
          ))}
        </Collapse> */}
        <Collapse
          activeKey={activeKeys}
          onChange={handleCollapseChange}
          expandIconPosition="end"
          items={Array.from({ length: numberOfJobPostings }).map((_, index) => ({
            key: index + 1,  // Chú ý: `key` là bắt buộc
            label: `Job posting ${index + 1}`,  // Tiêu đề của panel
            children: renderJobPostingForm(index),  // Nội dung của panel
          }))}
        />
      </div>

    </div>
  );
}

export default CreatingNewJobPostings;

