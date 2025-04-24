import React, { useEffect } from 'react'
import './CreatingNewJobGroup.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker, Form, Input, InputNumber } from 'antd';

const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
const { TextArea } = Input;
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const CreatingNewJobGroup = ({ jobGroup, setJobGroup, setCheckErrorJobGroup  /*, onSubmit, setIsValid*/ }) => {

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            jobGroupName: jobGroup.jobGroupName || '',
            startDate: jobGroup.startDate || '',
            endDate: jobGroup.endDate || '',
            numberOfJobPostings: jobGroup.numberOfJobPostings || 1,
            descriptionJobGroup: jobGroup.descriptionJobGroup || '',
        },
        validationSchema: Yup.object({
            jobGroupName: Yup.string()
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
            // startDate: Yup.string()
            //     .required("* Required"),
            // endDate: Yup.string()
            //     .required("* Required"),
            startDate: Yup.date().required("* Required"),
            endDate: Yup.date().required("* Required"),
            // ko xài nữa tại có hàm để check r
            // .test("max-30-days", "* Date range cannot exceed 30 days", function (value) {
            //     const { startDate } = this.parent;
            //     return startDate && value ? dayjs(value).diff(dayjs(startDate), "day") <= 30 : false;
            // }),
            numberOfJobPostings: Yup.number()
                // .nullable() // Chấp nhận giá trị null (nếu ô trống)
                // .typeError("* Must be a number") // Chỉ báo lỗi nếu nhập sai kiểu (vd: nhập chữ)
                // .min(1, "* Must be at least 1")
                .required("* Required"),
            // descriptionJobGroup: Yup.string().required("* Required"),
            descriptionJobGroup: Yup.string()
                .test("not-empty", "* Required", value => {
                  const div = document.createElement("div");
                  div.innerHTML = value || "";
                  const plainText = div.textContent || div.innerText || ""; // Chuyển HTML thành văn bản thuần túy
                  return plainText.trim() !== ""; // Kiểm tra nếu chuỗi không rỗng
                }),
        }),

        // ** Hiện tại bên đây bỏ handleSubmit rồi nên ko cần hàm onSubmit này nữa
        onSubmit: async (values) => {
            // console.log("Form submitted and valid:", values);
            // if (formik.isValid) {
            //     setIsValid(false);
            //     console.log("isValid: ", formik.isValid);

            //     return;
            // }
            // console.log("isValid: ", formik.isValid);

            // onSubmit(true); // Gửi trạng thái hợp lệ lên cha khi submit thành công


            // alert(`startDate: ${values.startDate}`);

            console.log(values.startDate)
        },
    });

    const today = dayjs().startOf('day');
    // Hàm vô hiệu hóa các ngày trước hôm nay
    // const disabledDate = (current) => {
    //     return current && current < today;
    // };

    const disabled30DaysDate = (current, { from, type }) => {
        // vô hiệu hóa các ngày trước hôm nay
        // if (current && current < today) return true;

        const today = dayjs().startOf('day'); // Đảm bảo ngày hôm nay được đặt về đầu ngày
        const minStartDate = today.add(7, 'days'); // Thêm 7 ngày vào ngày hôm nay để tạo ra ngày bắt đầu tối thiểu

        // Vô hiệu hóa các ngày trước ngày bắt đầu tối thiểu
        if (current && current < minStartDate) {
            return true;
        }

        // giới hạn khoảng thời gian trong vòng 30 ngày
        if (from) {
            const minDate = from.add(-30, 'days');
            const maxDate = from.add(30, 'days');
            switch (type) {
                case 'year':
                    return current.year() < minDate.year() || current.year() > maxDate.year();
                case 'month':
                    return (
                        getYearMonth(current) < getYearMonth(minDate) ||
                        getYearMonth(current) > getYearMonth(maxDate)
                    );
                default:
                    return Math.abs(current.diff(from, 'days')) >= 30;
            }
        }
        return false;
    };

    // BỎ
    // useEffect(() => {
    //     console.log("onSubmit is called in CreatingNewJobGroup");
    //     console.log(onSubmit);
    //     if (onSubmit) {
    //         onSubmit(formik.handleSubmit);
    //     }
    // }, [onSubmit, formik.handleSubmit]);

    useEffect(() => {
        // console.log(formik.values);
        if (formik.errors.jobGroupName) {
            setCheckErrorJobGroup(true);
        } else {
            setCheckErrorJobGroup(false);
        }
        setJobGroup(formik.values);
    }, [formik.values, formik.errors.jobGroupName]);

    return (
        <div className="creating-new-job-group-container">
            <p><span className='warning'>⚠️</span> <span className='yellow'>Important: </span>
                Make sure you have specified <span className='red'>the number of jobs</span> you want to post for this <span className='purple'>Job Group</span>!
                If the post is already published, new jobs cannot be added so be sure!
            </p>

            <form onSubmit={formik.handleSubmit} className='creating-new-job-group-form'>
                <div className='job-group-field'>
                    <p className='title'><span>*</span> Job Group Name: </p>
                    <Form.Item
                        validateStatus={formik.errors.jobGroupName && formik.touched.jobGroupName ? "error" : ""}
                        help={formik.errors.jobGroupName && formik.touched.jobGroupName ? formik.errors.jobGroupName : ""}
                    >
                        <Input
                            className='input'
                            size="large"
                            placeholder="Input Job Group Name here..."
                            id="jobGroupName"
                            name="jobGroupName"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.jobGroupName}
                        />
                    </Form.Item>
                </div>

                <div className='job-group-info'>
                    <div className="job-group-number-of-job-posting">
                        <p className='title'><span>*</span> Number of Job Posting: </p>
                        <Form.Item
                            validateStatus={formik.errors.numberOfJobPostings && formik.touched.numberOfJobPostings ? "error" : ""}
                            help={formik.errors.numberOfJobPostings && formik.touched.numberOfJobPostings ? formik.errors.numberOfJobPostings : ""}
                        >
                            {/* <Input
                                className='input'
                                size="large"
                                placeholder="Ex: 1"
                                id="numberOfJobPostings"
                                name="numberOfJobPostings"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.numberOfJobPostings}
                            /> */}
                            <InputNumber
                                className='input'
                                size="large"
                                placeholder="Ex: 1"
                                id="numberOfJobPostings"
                                name="numberOfJobPostings"
                                defaultValue={1}
                                min={1} // Không cho nhập số âm hoặc 0
                                // InputNumber nhận giá trị kiểu number, trong khi formik.handleChange mặc định xử lý event.target.value. 
                                // //Vì vậy, cần dùng formik.setFieldValue thay vì formik.handleChange.
                                onChange={(value) => formik.setFieldValue("numberOfJobPostings", value)}
                                onBlur={() => formik.setTouched({ numberOfJobPostings: true })}
                                value={formik.values.numberOfJobPostings}
                            />
                        </Form.Item>
                    </div>

                    <div className='job-group-start-end-date'>
                        <p className='title'><span>*</span> Start Date - End Date: </p>
                        <Form.Item
                            validateStatus={
                                (formik.touched.startDate && formik.errors.startDate) ||
                                    (formik.touched.endDate && formik.errors.endDate)
                                    ? "error" : ""
                            }
                            help={
                                (formik.touched.startDate && formik.errors.startDate) ||
                                    (formik.touched.endDate && formik.errors.endDate)
                                    ? "* Required" : ""
                            }
                        >
                            <RangePicker
                                className='input'
                                size="large"
                                format="DD/MM/YYYY"
                                disabledDate={disabled30DaysDate}
                                onChange={(dates) => {
                                    // console.log(dates);
                                    formik.setFieldValue("startDate", dates ? dates[0] : null);
                                    formik.setFieldValue("endDate", dates ? dates[1] : null);
                                }}
                                // onChange={(dates) => {
                                //     // Chuyển đổi ngày thành dạng chuỗi nếu cần thiết
                                //     formik.setFieldValue("startDate", dates ? dates[0].format("DD/MM/YYYY") : '');
                                //     formik.setFieldValue("endDate", dates ? dates[1].format("DD/MM/YYYY") : '');
                                // }}
                                // Ko sd onOpenChange vì nó chạy khi đóng, nhưng không đảm bảo người dùng thực sự rời khỏi ô nhập
                                // vì RangePicker không có sự kiện onBlur trực tiếp nên phải viết ra 
                                onBlur={() => {
                                    formik.setTouched({ startDate: true, endDate: true });
                                    if (!formik.values.startDate || !formik.values.endDate) {
                                        formik.setFieldError("startDate", "* Required");
                                        formik.setFieldError("endDate", "* Required");
                                    }
                                }}
                                // trong antd defaultValue mới cho phép giá trị null hoặc undefined
                                // chứ value chỉ cho set date chứ không cho phép giá trị null hoặc undefined
                                defaultValue={[
                                    formik.values.startDate ? dayjs(formik.values.startDate) : null,
                                    formik.values.endDate ? dayjs(formik.values.endDate) : null
                                ]}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className='job-group-field'>
                    <p className='title'><span>*</span> Description: </p>
                    <Form.Item
                        validateStatus={formik.errors.descriptionJobGroup && formik.touched.descriptionJobGroup ? "error" : ""}
                        help={formik.errors.descriptionJobGroup && formik.touched.descriptionJobGroup ? formik.errors.descriptionJobGroup : ""}
                    >
                        {/* <TextArea
                            showCount
                            maxLength={2500}
                            rows={10}
                            id="descriptionJobGroup"
                            name="descriptionJobGroup"
                            placeholder="Enter Job Group Description here..."
                            style={{ height: 300, resize: 'none' }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.descriptionJobGroup}
                        /> */}
                        <ReactQuill
                            theme="snow"
                            value={formik.values.descriptionJobGroup}
                            placeholder="Enter Job Group Description here..."
                            onChange={(value) => formik.setFieldValue("descriptionJobGroup", value)}
                            onBlur={() => formik.setFieldTouched("descriptionJobGroup", true)}
                            style={{ height: '200px', marginBottom: '50px' }}
                        />
                    </Form.Item>
                </div>


                {/* <button type='submit'>submit</button> */}
            </form>
        </div>
    )
}

export default CreatingNewJobGroup