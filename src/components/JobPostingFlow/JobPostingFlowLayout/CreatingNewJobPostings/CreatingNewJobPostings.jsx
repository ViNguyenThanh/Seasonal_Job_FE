import React, { useEffect, useRef, useState } from 'react'
import './CreatingNewJobPostings.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Collapse, Form, Input, InputNumber, Rate, Select } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;

const CreatingNewJobPostings = ({ numberOfJobPostings, jobPostings, setJobPostings }) => {
  const [cityList, setCityList] = useState([]);
  // bỏ => nếu không district không riêng biệt index với các field city khác nhau
  // const [districtList, setDistrictList] = useState([]);
  const [districtList, setDistrictList] = useState({});
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
        // jobPostingName: jobPosting.jobPostingName || '',
        // address: jobPosting.address || '',
        // city: jobPosting.city || '',
        // district: jobPosting.district || '',
        // numberOfPeople: jobPosting.numberOfPeople || '',
        // salary: jobPosting.salary || '',
        // rating: jobPosting.rating || '',
        // descriptionJobPosting: jobPosting.descriptionJobPosting || '',
        jobPostingName: jobPostings[index]?.jobPostingName || '',
        address: jobPostings[index]?.address || '',
        city: jobPostings[index]?.city || '',
        district: jobPostings[index]?.district || '',
        numberOfPeople: jobPostings[index]?.numberOfPeople || '',
        salary: jobPostings[index]?.salary || '',
        rating: jobPostings[index]?.rating || '',
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
          .max(60, "* Job Group Name cannot be longer than 60 characters")
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
        numberOfPeople: Yup.number()
          .required("* Required"),
        salary: Yup.number()
          .required("* Required"),
        rating: Yup.number()
          // .min(0.5, "* You must rate at least 0.5 star")
          .required("* Required"),
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
      setJobPostings((prevJobPostings = []) => { // Đảm bảo prevJobPostings là một mảng
        const updatedJobPostings = [...prevJobPostings];
        updatedJobPostings[index] = formik.values;
        return updatedJobPostings;
      });
    }, [formik.values, index]);

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
          <p className='title'><span>*</span> Address (Specific address): </p>
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
          <div className="job-postings-city-district">
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
                }}
                onBlur={() => formik.setFieldTouched("city", true)}
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

          <div className='job-postings-city-district'>
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
                onChange={(value) => formik.setFieldValue("district", value)}
                onBlur={() => formik.setFieldTouched("district", true)}
                disabled={!formik.values.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành
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

        <div className='job-postings-rating'>
          <p className='title'><span>*</span> Minimum rating for worker: </p>
          <Form.Item
            validateStatus={formik.errors.rating && formik.touched.rating ? "error" : ""}
            help={formik.errors.rating && formik.touched.rating ? formik.errors.rating : ""}
          >
            <Rate
              allowHalf
              value={formik.values.rating}
              onChange={(value) => formik.setFieldValue("rating", value)}
              onBlur={() => formik.setFieldTouched("rating", true)}
            />
          </Form.Item>
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
              placeholder="Enter Job Posting Description here..."
              style={{ height: 200, resize: 'none' }}
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

