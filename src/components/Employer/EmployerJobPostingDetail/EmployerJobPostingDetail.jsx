import React, { useState } from 'react'
import './EmployerJobPostingDetail.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, DatePicker, Empty, Form, Input, InputNumber, message, Pagination, Rate, Tabs } from 'antd';
import { ArrowRightOutlined, ContainerOutlined, CreditCardOutlined, DeleteOutlined, DownOutlined, EnvironmentOutlined, FileTextOutlined, FolderOpenOutlined, SnippetsOutlined, StarOutlined, TagOutlined, TeamOutlined, UpOutlined, UserSwitchOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import avatar from '/assets/Work-On-Computer.png'
const { Search } = Input;


const EmployerJobPostingDetail = () => {

  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const item = location.state; //item này bao gồm cả jobGroupInfo ( thông tin của 1 group) và posting (thông tin của 1 posting)
  console.log(item);
  const [showMore2, setShowMore2] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  // Bỏ => chuyển sang formik
  /*const [rows, setRows] = useState([
    {
      no: 1,
      assignmentDate: '25/05/2025',
      jobRequirement: 'Đóng gói quà tặng cho khách hàng theo đơn đặt hàng',
      requiredProgress: 20,
    }
  ]);
  const handleAddRow = () => {
    const newRow = {
      no: rows.length + 1,
      assignmentDate: '',
      jobRequirement: '',
      requiredProgress: 0,
    };
    setRows([...rows, newRow]);
  };
  const handleDeleteRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };*/

  /* Job Execute Table */
  const formik = useFormik({
    initialValues: {
      rows: [
        {
          assignmentDate: '',
          jobRequirement: '',
          requiredProgress: 100,
        }
      ]
    },
    validationSchema: Yup.object({
      rows: Yup.array().of(
        Yup.object().shape({
          assignmentDate: Yup.date()
            .required("* Required"),
          jobRequirement: Yup.string()
            .test('no-leading-space', '* No spaces at the beginning', value => !/^\s/.test(value))
            .test('no-extra-space', '* No extra spaces allowed', value => !/ {2,}/.test(value))
            .test('no-question-mark', '* Cannot contain "?" character', value => !/\?/.test(value))
            .test('capitalize-first-letter', '* The first letter must be uppercase', value => /^[A-ZÀ-Ỹ]/.test(value?.trim().charAt(0)))
            .max(80, "* Job Requirement cannot be longer than 80 characters")
            .required("* Required"),
          requiredProgress: Yup.number()
            .required("* Required")
        })
      )
    }),

    onSubmit: async (values) => {
      // console.log("Submitted values:", values);

      const formattedRows = values.rows.map(row => ({
        ...row,
        assignmentDate: row.assignmentDate ? dayjs(row.assignmentDate).format('DD/MM/YYYY') : null,
      }));

      console.log("Submitted values:", formattedRows);
      message.success("Form submitted successfully!");
      // submit xong, đổi trạng thái isEditing thành false => ko cho chỉnh sửa
      setIsEditing(false);
    }
  });

  // Tính toán số % cho Required Progress
  const [editedRows, setEditedRows] = useState([]);

  const handleAddRow = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định (submit)
    // Kiểm tra xem dòng cuối cùng đã có ngày và ngày đó có phải là endDate không
    const lastRowDate = formik.values.rows[formik.values.rows.length - 1]?.assignmentDate;
    if (lastRowDate && dayjs(lastRowDate).isSame(endDate, 'day')) {
      message.error("Cannot add more rows because the last row's assignment date is already the end date.");
      return;
    }

    const newRow = {
      no: formik.values.rows.length + 1,
      assignmentDate: null, // Sử dụng null thay vì chuỗi rỗng
      jobRequirement: '',
      requiredProgress: 1,
    };

    formik.setFieldValue('rows', [...formik.values.rows, newRow]); // Cập nhật qua formik
    // Tính toán lại progress nếu không có hàng nào bị chỉnh sửa
    if (!editedRows.length) {
      const newRows = [...formik.values.rows, newRow];
      updateProgress(newRows);
    }
  };

  // Delete dòng cuối
  /*const handleDeleteRow = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định submit của nút (ngừng submit form)
    if (formik.values.rows.length > 1) {
      const newRows = formik.values.rows.slice(0, -1);
      formik.setFieldValue('rows', newRows); // Cập nhật qua formik
      // Tính toán lại progress nếu không có hàng nào bị chỉnh sửa
      if (!editedRows.length) {
        updateProgress(newRows);
      }
    }
  };*/

  // Delete index
  const handleDeleteRow = (index, e) => {
    e.preventDefault(); // Ngừng hành động mặc định (submit)
    // Tạo một mảng mới mà không có dòng đã chọn để xóa
    const newRows = formik.values.rows.filter((_, i) => i !== index);

    // Cập nhật giá trị rows trong Formik
    formik.setFieldValue('rows', newRows);

    // Cập nhật lại tiến độ nếu cần
    if (!editedRows.length) {
      updateProgress(newRows);
    }
  };

  const handleProgressChange = (index, value) => {
    formik.setFieldValue(`rows[${index}].requiredProgress`, value);

    if (!editedRows.includes(index)) {
      setEditedRows([...editedRows, index]); // Thêm vào danh sách đã chỉnh sửa
    }
  };

  const updateProgress = (rows) => {
    const count = rows.length;
    const progress = Math.floor(100 / count);
    const remainder = 100 % count;

    const updatedRows = rows.map((row, index) => ({
      ...row,
      requiredProgress: index === 0 ? progress + remainder : progress
    }));

    formik.setFieldValue('rows', updatedRows);
  };

  // Tính tổng số % 
  const calculateTotalProgress = (rows) => {
    const totalProgress = rows.reduce((acc, row) => acc + row.requiredProgress, 0);
    return totalProgress; // Trả về tổng tiến độ
    // return Math.min(totalProgress, 100);
  };
  const isTotalProgressValid = (rows) => {
    const totalProgress = rows.reduce((acc, row) => acc + row.requiredProgress, 0);
    return totalProgress === 100;
  };

  // Tính ngày min cho hàng tiếp theo
  // console.log(item.jobGroupInfo.startDate)
  const startDate = dayjs(item.jobGroupInfo.startDate, 'DD/MM/YYYY');
  const endDate = dayjs(item.jobGroupInfo.endDate, 'DD/MM/YYYY');

  const getMinDateForNextRow = (index) => {
    if (index === 0) {
      return startDate;
    } else {
      const prevDate = dayjs(formik.values.rows[index - 1].assignmentDate);
      return prevDate.add(1, 'day'); // Next row's min date should be 1 day after the previous
    }
  };
  const getMaxDateForRow = (index) => {
    // Nếu index là hàng cuối cùng, không có ngày cần giới hạn
    if (index === formik.values.rows.length - 1) {
      return endDate; // Giới hạn ngày cuối cùng theo endDate
    } else {
      // Lấy ngày của hàng tiếp theo và trừ đi 1 ngày
      const nextDate = dayjs(formik.values.rows[index + 1].assignmentDate);
      return nextDate.subtract(1, 'day');
    }
  };

  // Hàm để chuyển sang chế độ chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  /*List Workers*/
  const listWorkers = [
    { id: 1, workerName: 'Nguyễn Anh', email: 'nguyen.anh@example.com', avatar: avatar },
    { id: 2, workerName: 'Trần Minh', email: 'tran.minh@example.com', avatar: avatar },
    { id: 3, workerName: 'Lê Thị Mai', email: 'le.thi.mai@example.com', avatar: avatar },
    { id: 4, workerName: 'Phạm Thanh', email: 'pham.thanh@example.com', avatar: avatar },
    { id: 5, workerName: 'Hoàng Tú', email: 'hoang.tu@example.com', avatar: avatar },
    { id: 6, workerName: 'Nguyễn Minh Hoàng', email: 'nguyen.minh.hoang@example.com', avatar: avatar },
  ];

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    window.scroll({ top: 750, left: 0, behavior: 'smooth' })
  };
  // chức năng Search Worker
  const [searchTerm, setSearchTerm] = useState('');
  const onSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
    setCurrentPage(1);     // Reset to the first page
  };

  const filteredWorkers = listWorkers.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (!searchTerm
        || item.workerName.toLowerCase().includes(searchTermLower)
        || item.email.toLowerCase().includes(searchTermLower)
      )
    );
  });

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*listWorkers*/ filteredWorkers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Nếu Project chưa Start thì hiện class employer-job-posting-not-executed => statusStart false
  // Nếu Project đã Start thì hiện class employer-job-posting-executed  => statusStart true
  const [statusStart, setStatusStart] = useState(false)

  return (
    <div className='employer-job-posting-detail-whole-container'>
      <Breadcrumb className='breadcrumb'
        items={[
          {
            title: <Link
              to="/employer/employer-job-groups"
              className='b-title-1'
            >
              <FolderOpenOutlined /> List Job Groups
            </Link>,
          },
          {
            title:
              // ko xài Link vì khó truyền state
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}`, { state: item.jobGroupInfo })}>
                  <ContainerOutlined /> Job Group Detail
                </div>
              )
          },
          {
            title: (
              <div className='b-title-2'>
                <SnippetsOutlined /> Job Posting Detail
              </div>
            ),
          },
        ]}
      />
      <div className="employer-job-posting-detail-container">

        <h1 className='employer-job-posting-detail-title'>Job Posting Detail</h1>

        <div className="employer-job-posting-detail-info">
          <p><SnippetsOutlined /> Job Posting Name: {item.jobPostingInfo.title}</p>
          <p><EnvironmentOutlined /> Address: {item.jobPostingInfo.location}</p>
          <div className="employer-job-posting-detail-short-info">
            <p><TeamOutlined /> Number of workers: 1</p>
            <p><CreditCardOutlined /> Salary: {item.jobPostingInfo.salary.toLocaleString('vi-VN')} VND</p>
          </div>
          <p><TagOutlined /> Job Type: Chuyên viên hỗ trợ khách hàng: Xử lý yêu cầu, giải quyết vấn đề, cung cấp thông tin và duy trì mối quan hệ khách hàng lâu dài.</p>
          {/* Hiển thị nội dung mở rộng nếu showMore = true */}
          <div className="employer-job-posting-detail-short-info">
            <div className='rating'><StarOutlined /> Minimum rating <br /> for worker: <span className='star'><Rate disabled defaultValue={2} /></span></div>
            <p><UserSwitchOutlined />Gender: All Genders</p>
          </div>
          {showMore && (
            <>
              <p><FileTextOutlined /> Description: <br /> Công việc này sẽ bao gồm nhiều nhiệm vụ liên quan đến việc đóng gói quà tặng cho sự kiện Global City. Nhân viên đóng gói sẽ chịu trách nhiệm chuẩn bị, sắp xếp và đóng gói các sản phẩm quà tặng theo yêu cầu của ban tổ chức. Các công việc sẽ được thực hiện dưới sự giám sát trực tiếp của quản lý, đảm bảo rằng chất lượng và tiến độ công việc luôn đạt tiêu chuẩn cao nhất. Mỗi món quà tặng phải được đóng gói cẩn thận, đúng cách, và không có bất kỳ lỗi nào trong quá trình sắp xếp. Để đạt được hiệu quả công việc tối ưu, nhân viên cần phải có khả năng làm việc nhóm và giao tiếp tốt với các thành viên trong nhóm.

                Trong quá trình thực hiện công việc, nhân viên sẽ phải lựa chọn vật liệu đóng gói phù hợp với từng sản phẩm, từ giấy bọc, dây ruy băng, đến hộp đựng, sao cho các quà tặng không bị hư hỏng trong quá trình vận chuyển. Mỗi công đoạn đóng gói phải được thực hiện chính xác và tỉ mỉ, đảm bảo rằng các sản phẩm đều có diện mạo đẹp mắt và thu hút người nhận. Việc đảm bảo an toàn trong quá trình đóng gói là yếu tố quan trọng, vì các sản phẩm quà tặng phải chịu được va đập trong suốt quá trình vận chuyển đến tay người nhận mà không bị hư hỏng.

                Ngoài các công việc đóng gói, nhân viên còn cần phải hỗ trợ trong việc vận chuyển các quà tặng đến các khu vực tổ chức sự kiện, đảm bảo các món quà được giao đúng nơi và đúng thời gian yêu cầu. Việc này đòi hỏi nhân viên có khả năng làm việc dưới áp lực, đặc biệt là trong các tình huống khẩn cấp, khi thời gian có thể bị giới hạn và công việc cần phải hoàn thành nhanh chóng.

                Kỹ năng cần thiết cho công việc này bao gồm khả năng làm việc nhanh chóng và hiệu quả dưới sự giám sát, khả năng sử dụng các công cụ đóng gói như kéo, băng dính, giấy bọc, và các vật liệu khác một cách thành thạo. Ngoài ra, nhân viên cần có sự cẩn thận và tinh tế trong công việc, vì mỗi món quà tặng đều cần phải có sự hoàn thiện về mặt thẩm mỹ và chức năng. Nhân viên cũng cần có khả năng xử lý các tình huống bất ngờ như thiếu hụt vật liệu đóng gói hay quà tặng bị hư hỏng trong quá trình vận chuyển.

                Các nhân viên đóng gói sẽ làm việc trong môi trường nhóm, nơi mà sự phối hợp giữa các thành viên là rất quan trọng. Nhân viên cần có khả năng làm việc độc lập và chủ động khi gặp phải các tình huống phát sinh. Để có thể hoàn thành công việc đúng tiến độ, nhân viên cần phải tổ chức công việc khoa học, phân chia thời gian hợp lý và đảm bảo rằng các công đoạn không bị gián đoạn. Công việc này sẽ đòi hỏi nhân viên có khả năng giữ bình tĩnh và làm việc hiệu quả dưới áp lực công việc cao.

                Bên cạnh đó, nhân viên đóng gói cần phải tuân thủ các quy định và tiêu chuẩn về an toàn lao động, đặc biệt là khi làm việc với các vật liệu đóng gói có thể gây hại nếu không sử dụng đúng cách. Công ty tổ chức sự kiện sẽ cung cấp đầy đủ trang thiết bị bảo hộ lao động và đào tạo về các biện pháp an toàn khi làm việc với các vật liệu đóng gói.

                Tóm lại, công việc này yêu cầu sự tỉ mỉ, cẩn thận và khả năng làm việc hiệu quả dưới sự giám sát chặt chẽ. Đây là cơ hội để bạn có thể tham gia vào một sự kiện lớn và học hỏi được nhiều kỹ năng quan trọng, đặc biệt là trong việc tổ chức sự kiện và đóng gói sản phẩm. Bạn sẽ được làm việc trong một môi trường năng động và đầy thử thách, nơi mà mỗi ngày đều mang lại những trải nghiệm mới và cơ hội phát triển nghề nghiệp. Nếu bạn là người chăm chỉ, cẩn thận và có khả năng làm việc dưới áp lực, công việc này sẽ là một cơ hội tuyệt vời cho bạn để phát triển bản thân và đóng góp vào sự thành công của sự kiện.</p>

              {/* Nút Show less */}
              <div className="show-more-less-btn">
                <button onClick={() => { setShowMore(false); window.scroll({ top: 0, left: 0, behavior: 'smooth' }); }}><UpOutlined /> Show less</button>
              </div>
            </>
          )}
          {/* Nút Show more (chỉ hiển thị khi showMore = false) */}
          {!showMore && (
            <div className="show-more-less-btn">
              <button onClick={() => setShowMore(true)}><DownOutlined /> Show more</button>
            </div>
          )}
        </div>

        {!statusStart && (
          <div className="employer-job-posting-not-executed">
            <Tabs
              defaultActiveKey="1"
              type="card"
              items={[
                {
                  label: <p className='tab-title'>Creating <br /> Job Execute</p>,
                  key: '1',
                  children:
                    <div className="creating-job-execute">
                      <div className="creating-job-execute-notification">
                        <h1>Creating Job Execute</h1>
                        <p className='content'>
                          <span className='warning'>⚠️</span> <span className='yellow'>Important: </span>
                          <span className='dark-green'>You must complete the Job Execute before starting
                            the Job Group.
                          </span>  <br />
                          <br />
                          👇 Here is the work schedule for each day: <br />
                        </p>
                        {showMore2 && (
                          <>
                            <br />
                            <p className='content'>
                              📆 <span className='bold'> Work Schedule: </span> <br />
                              &ensp; Includes the Assignment Date, Job Requirement for each worker, and Required Progress to be
                              completed each day.<br />
                              <br />
                              📈 <span className='bold'> Progress Requirements: </span> <br />
                              <span className='red'>&ensp; After completing the allocation for all work days, make sure that
                                the overall progress is 100%. </span> <br />
                              &emsp; • &#160; <span className='blue-lagoon'>Ex: </span> in 5 working days, each day needs to complete an average of 20% to reach
                              100% progress. <br />
                              <br />
                              💰 <span className='bold'> Payroll Calculation: </span> <br />
                              <span className='red'> &ensp; The worker's salary will be calculated based on the percentage (%) of progress they
                                achieve compared to the requirements you set. </span> <br />
                              &emsp; • &#160;  <span className='blue-lagoon'>Ex: </span> if you require 20% completion each day and in the first 4 days, the
                              worker achieves 20%, but on the 5th day, although you require 20%, the worker only
                              achieves 18%, the total progress is only 98%.
                              In this case, the salary will be calculated as 98% of the original amount you decided
                              to pay the worker. The remaining 2% will be paid to you after the entire Job Group is
                              completed. <br />
                              &ensp; <span className='dark-orange'>➞ This means that even if the worker does not achieve 100% of the progress, you will still
                                receive the remaining portion once the Job Group is finished. </span> <br />
                              <br />
                              ✅ <span className='bold'> General Progress: </span> <br />
                              <span className='red'> &#160; The schedule for all workers in the Job Group will be the same, meaning all workers
                                will have the same job requirements and progress as you have allocated. </span><br />
                              <br />
                              ➤ <span className='test'> After you start the Job Group, we will send this schedule to all workers in this
                                Job Posting to monitor and execute the work.</span>
                            </p>
                            {/* Nút Show less */}
                            <div className="show-more-less-btn show-less">
                              <button onClick={() => { setShowMore2(false); window.scroll({ top: 670, left: 0, behavior: 'smooth' }); }}><UpOutlined /> Show less</button>
                            </div>
                          </>
                        )}
                        {/* Nút Show more (chỉ hiển thị khi showMore = false) */}
                        {!showMore2 && (
                          <div className="show-more-less-btn">
                            <button onClick={() => setShowMore2(true)}><DownOutlined /> Show more</button>
                          </div>
                        )}

                      </div>

                      <form className="creating-job-execute-form" onSubmit={formik.handleSubmit}>
                        <p className='assignment-date-note'> * You can only select Assignment Date between Start Date and End Date
                          of the Job Group to ensure data validity. If the current date is beyond Start Date, you can only select 
                          Assignment Date starting from the next day.</p>
                        <div className="creating-job-execute-whole-table">
                          <table className="creating-job-execute-table">
                            <thead>
                              <tr>
                                <th className='no-column'>No</th>
                                <th className='assignment-date'>Assignment <br /> Date</th>
                                <th className='job-requirement'>Job Requirement</th>
                                <th className='required-progress'>Required <br /> Progress (%)</th>
                                <th className='delete-btn'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formik.values.rows.map((row, index) => (
                                <tr key={index}>
                                  <td className='no-column'>
                                    {index + 1}
                                  </td>
                                  <td className='assignment-date'>
                                    {/* <input
                                  type="text"
                                  value={row.assignmentDate}
                                  onChange={(e) => {
                                    const updatedRows = [...rows];
                                    updatedRows[index].assignmentDate = e.target.value;
                                    setRows(updatedRows);
                                  }}
                                /> */}
                                    <Form.Item
                                      validateStatus={
                                        formik.errors.rows && formik.errors.rows[index]?.assignmentDate && formik.touched.rows && formik.touched.rows[index]?.assignmentDate
                                          ? "error"
                                          : ""
                                      }
                                      help={
                                        formik.errors.rows && formik.errors.rows[index]?.assignmentDate && formik.touched.rows && formik.touched.rows[index]?.assignmentDate
                                          ? formik.errors.rows[index].assignmentDate
                                          : null
                                      }
                                    >
                                      <DatePicker
                                        className='input'
                                        size="large"
                                        format="DD/MM/YYYY"
                                        onChange={(date, dateString) => {
                                          formik.setFieldValue(`rows[${index}].assignmentDate`, date ? date.toDate() : null); // Chuyển đổi thành đối tượng Date
                                        }}
                                        onBlur={() => formik.setFieldTouched(`rows[${index}].assignmentDate`, true)} // Đánh dấu trường đã được chạm tới (touched)
                                        // defaultValue={formik.values.rows[index].assignmentDate ? dayjs(formik.values.rows[index].assignmentDate, 'DD/MM/YYYY') : null} // Gán giá trị từ Formik
                                        // disabledDate={(currentDate) => {
                                        //   return currentDate.isBefore(getMinDateForNextRow(index)) || currentDate.isAfter(endDate);
                                        // }}
                                        disabled={!isEditing} // disabled chỉ kt đc boolean
                                        disabledDate={(currentDate) => {
                                          // Kiểm tra xem ngày hiện tại đã qua startDate chưa
                                          const today = dayjs(); // Lấy ngày hôm nay
                                          // Nếu hôm nay đã qua startDate, bắt đầu từ hôm nay, nếu không thì vẫn từ startDate
                                          const adjustedStartDate = today.isAfter(startDate) ? today : startDate;
                                          // Không cho phép chọn ngày ngoài phạm vi startDate đến endDate
                                          if (currentDate.isBefore(adjustedStartDate) || currentDate.isAfter(endDate)) {
                                            return true; // Disable all dates outside the range
                                          }
                                          // Nếu là dòng đầu tiên, chỉ cho phép chọn từ adjustedStartDate
                                          if (index === 0) {
                                            return currentDate.isBefore(adjustedStartDate) || currentDate.isAfter(getMaxDateForRow(index));
                                          }
                                          // Nếu là dòng tiếp theo, chỉ cho phép chọn khi dòng trước đã có giá trị ngày
                                          else if (!formik.values.rows[index - 1].assignmentDate) {
                                            return true; // Nếu dòng trước chưa có ngày, vô hiệu hóa
                                          }
                                          // Nếu là dòng cuối cùng, chỉ cho phép chọn đến endDate
                                          else if (index === formik.values.rows.length - 1) {
                                            return currentDate.isBefore(getMinDateForNextRow(index)) || currentDate.isAfter(endDate);
                                          }
                                          // Các dòng ở giữa, chỉ cho phép chọn giữa ngày của dòng trước và dòng sau
                                          return currentDate.isBefore(getMinDateForNextRow(index)) || currentDate.isAfter(getMaxDateForRow(index));
                                        }}
                                        value={formik.values.rows[index].assignmentDate ? dayjs(formik.values.rows[index].assignmentDate) : null} // Chuyển đổi ngày từ Formik thành dayjs
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className='job-requirement'>
                                    <Form.Item
                                      validateStatus={
                                        formik.errors.rows && formik.errors.rows[index]?.jobRequirement && formik.touched.rows && formik.touched.rows[index]?.jobRequirement
                                          ? "error"
                                          : ""
                                      }
                                      help={
                                        formik.errors.rows && formik.errors.rows[index]?.jobRequirement && formik.touched.rows && formik.touched.rows[index]?.jobRequirement
                                          ? formik.errors.rows[index].jobRequirement
                                          : null
                                      }
                                    >
                                      <Input
                                        className='input'
                                        placeholder='Input Job Requirement here...'
                                        value={formik.values.rows[index].jobRequirement}
                                        onChange={(e) => formik.setFieldValue(`rows[${index}].jobRequirement`, e.target.value)}
                                        onBlur={() => formik.setFieldTouched(`rows[${index}].jobRequirement`, true)}
                                        disabled={!isEditing}
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className='required-progress'>
                                    <Form.Item
                                      validateStatus={
                                        formik.errors.rows && formik.errors.rows[index]?.requiredProgress && formik.touched.rows && formik.touched.rows[index]?.requiredProgress
                                          ? "error"
                                          : ""
                                      }
                                      help={
                                        formik.errors.rows && formik.errors.rows[index]?.requiredProgress && formik.touched.rows && formik.touched.rows[index]?.requiredProgress
                                          ? formik.errors.rows[index].requiredProgress
                                          : null
                                      }
                                    >
                                      <InputNumber
                                        className='input'
                                        min={1}
                                        max={100}
                                        value={formik.values.rows[index].requiredProgress}
                                        // onChange={(value) => formik.setFieldValue(`rows[${index}].requiredProgress`, value)}
                                        onChange={(value) => handleProgressChange(index, value)}
                                        onBlur={() => formik.setFieldTouched(`rows[${index}].requiredProgress`, true)}
                                        disabled={!isEditing}
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className='delete-btn'>
                                    {index !== 0 && (
                                      <button
                                        onClick={(e) => handleDeleteRow(index, e)} // Xử lý sự kiện xóa dòng
                                        disabled={!isEditing}
                                      >
                                        <DeleteOutlined />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="add-and-total">
                          <div className="add-btn">
                            <button
                              onClick={(e) => handleAddRow(e)}
                              disabled={!isEditing}
                            >
                              Add
                            </button>
                          </div>
                          <p className='total-progress'>
                            Total Required Progress: <br /> <span className={`total-progress-number ${!isTotalProgressValid(formik.values.rows) ? 'error' : 'correct'}`}>{calculateTotalProgress(formik.values.rows)}%</span> / 100%
                          </p>
                        </div>
                        <div className="submit-btn">
                          {isEditing && (
                            <button type="submit" disabled={!isTotalProgressValid(formik.values.rows)}>Submit</button>
                          )}
                        </div>
                      </form>

                      <div className="edit-btn">
                        {!isEditing && (
                          <button type="button" onClick={handleEdit}>Edit</button> // Nút Edit chỉ thay đổi trạng thái
                        )}
                      </div>
                    </div>
                  ,
                },
                {
                  label: 'List Workers',
                  key: '2',
                  children: (
                    <div className="workers-list">
                      <h1>List Workers</h1>

                      {listWorkers.length === 0 ? (
                        <div className="no-workers">
                          <Empty description="You currently have no workers" />
                        </div>
                      ) : (
                        <>
                          <div className="workers-list-search">
                            <Search
                              placeholder="Search Worker Name or Email..."
                              value={searchTerm} // Giữ từ tìm kiếm
                              allowClear
                              enterButton
                              size="large"
                              onSearch={onSearch}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>

                          {filteredWorkers.length === 0 ? (
                            <div className="no-workers">
                              <Empty description="No workers found!" />;
                            </div>
                          ) : (
                            <>
                              {/*listWorkers*/ paginatedData.map((worker) => (
                                <div className="worker-item" key={worker.id} onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}/employer-job-posting-detail/${item.jobPostingInfo.id}/worker-detail/${worker.id}`, { state: { workerInfo: worker, jobGroupInfo: item.jobGroupInfo, jobPostingInfo: item.jobPostingInfo } }, window.scrollTo(0, 0))}>
                                  <img src={worker.avatar} />
                                  <div className="worker-info">
                                    <p className='worker-name'>{worker.workerName}</p>
                                    <p className='worker-email'>{worker.email}</p>
                                  </div>
                                  <button><ArrowRightOutlined /></button>
                                </div>
                              ))}

                              <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredWorkers.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                align="center"
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {statusStart && (
          <div className="employer-job-posting-executed">
            <div className="workers-list">
              <h1>List Workers</h1>

              {listWorkers.length === 0 ? (
                <div className="no-workers">
                  <Empty description="You currently have no workers" />
                </div>
              ) : (
                <>
                  <div className="workers-list-search">
                    <Search
                      placeholder="Search Worker Name or Email..."
                      value={searchTerm} // Giữ từ tìm kiếm
                      allowClear
                      enterButton
                      size="large"
                      onSearch={onSearch}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {filteredWorkers.length === 0 ? (
                    <div className="no-workers">
                      <Empty description="No workers found!" />;
                    </div>
                  ) : (
                    <>
                      {/*listWorkers*/ paginatedData.map((worker) => (
                        <div className="worker-item" key={worker.id} onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}/employer-job-posting-detail/${item.jobPostingInfo.id}/worker-detail/${worker.id}`, { state: { workerInfo: worker, jobGroupInfo: item.jobGroupInfo, jobPostingInfo: item.jobPostingInfo } }, window.scrollTo(0, 0))}>
                          <img src={worker.avatar} />
                          <div className="worker-info">
                            <p className='worker-name'>{worker.workerName}</p>
                            <p className='worker-email'>{worker.email}</p>
                          </div>
                          <button><ArrowRightOutlined /></button>
                        </div>
                      ))}

                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredWorkers.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        align="center"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployerJobPostingDetail