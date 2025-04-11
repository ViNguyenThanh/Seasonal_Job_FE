import React, { useEffect, useRef, useState } from 'react'
import './WorkerDetailForEmployer.css'
import { Breadcrumb, Form, Image, Input, InputNumber, message, Pagination, Rate } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ContainerOutlined, DownOutlined, EnvironmentOutlined, FolderOpenOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SnippetsOutlined, SolutionOutlined, UpOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
const { TextArea } = Input;

const WorkerDetailForEmployer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state; //item này bao gồm cả jobGroupInfo ( thông tin của 1 group) và jobPostingInfo (thông tin của 1 posting) và workerInfo (thông tin của 1 worker)
  // console.log(item);

  const [showMore, setShowMore] = useState(false);

  const [dummyData, setDummyData] = useState([
    {
      no: 1,
      jobRequirement: "Đóng gói quà tặng cho khách hàng theo đơn đặt hàng",
      assignmentDate: '05/04/2025',
      // checkInFileList: [],
      // checkOutFileList: [],
      checkInUrl: "/assets/Work-On-Computer.png",
      checkOutUrl: "/assets/background_home.png",
      progress: 15,
      progressCompleted: 15,
      // reason: "Quà đã sẵn sàng, chờ hoàn tất đóng gói",
      readon: "",
    },
    {
      no: 2,
      jobRequirement: "Sắp xếp quà tặng vào hộp đựng theo yêu cầu",
      assignmentDate: '06/04/2025',
      checkInUrl: "/assets/AccessDenied.jpg",
      checkOutUrl: "/assets/background_home_page_platform.jpg",
      progress: 17,
      progressCompleted: 17,
      reason: "Đang kiểm tra chất lượng quà",
    },
    {
      no: 3,
      jobRequirement: "Vận chuyển quà tặng đến khu vực tổ chức",
      assignmentDate: '08/04/2025',
      checkInUrl: "/assets/Cooperation.png",
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "Đã hoàn thành, chờ giao nhận",
    },
    {
      no: 4,
      jobRequirement: "Kiểm tra lại các hộp quà đã đóng gói",
      assignmentDate: '09/04/2025',
      checkInUrl: null,
      checkOutUrl: "/assets/Introducing-Man.png",
      progress: 17,
      progressCompleted: 17,
      reason: "Chưa hoàn thành kiểm tra toàn bộ",
    },
    {
      no: 5,
      jobRequirement: "Ghi nhận và báo cáo số lượng quà tặng",
      assignmentDate: '10/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "Chưa hoàn thành báo cáo",
    },
    {
      no: 6,
      jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
      assignmentDate: '11/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "Đã hoàn thành toàn bộ công việc, nhưng đi trễ",
    },
    {
      no: 7,
      jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
      assignmentDate: '12/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "",
    },
    {
      no: 8,
      jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
      assignmentDate: '16/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "Đã hoàn thành toàn bộ công việc, nhưng đi trễ",
    },
  ].map((row) => ({
    ...row,
    progressCompleted: row.checkInUrl && row.checkOutUrl ? row.progress : 0,
    // reason: "", // default reason
  })));


  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const jobTitleRef = useRef(null);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (jobTitleRef.current) {
      // jobTitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const elementPosition = jobTitleRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - 120, left: 0, behavior: 'smooth' });
    }
  };

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = dummyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const rowRefs = useRef([]);

  // bắt lỗi khi thay đổi Progress Completed và Reason 
  const formik = useFormik({
    initialValues: {
      rows: dummyData.map((row) => ({
        progressCompleted: row.progressCompleted,
        reason: row.reason || "", // dùng dữ liệu có sẵn nếu có
      })),
    },
    validationSchema: Yup.object({
      rows: Yup.array().of(
        Yup.object().shape({
          progressCompleted: Yup.number()
            .required("* Required"),
          // .test("max-progress", "Progress Completed must not be greater than Progress.", function (value) {
          //   const { path } = this;
          //   const index = parseInt(path.match(/\d+/)?.[0] || "-1");
          //   return index < 0 || value <= dummyData[index]?.progress;
          // }),

          reason: Yup.string().test(
            "reason-required-if-progress-changed",
            "* Required if Progress Completed changed",
            function (value) {
              const { path, parent } = this;
              const index = parseInt(path.match(/\d+/)?.[0] || "-1");
              const progress = dummyData[index]?.progress;
              const isChanged = parent.progressCompleted !== progress;
              return !isChanged || (isChanged && !!value?.trim());
            }
          ),
        })
      ),
    }),
    onSubmit: async (values) => {
      const updated = [...dummyData];
      values.rows.forEach((row, i) => {
        updated[i].progressCompleted = row.progressCompleted;
        updated[i].reason = row.reason;
      });
      setDummyData(updated); // cập nhật lại dữ liệu
      message.success("Update successfully!");
      setIsEditing(false);

      // scroll tới dòng có assignmentDate bằng today đúng trang
      const indexToday = updated.findIndex((row) => row.assignmentDate === today);
      if (indexToday !== -1) {
        const page = Math.floor(indexToday / pageSize) + 1;
        // handlePageChange(page);
        setCurrentPage(page);
        setTimeout(() => {
          rowRefs.current[indexToday]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const today = new Date().toLocaleDateString('en-GB');  // dạng dd/mm/yyyy
  // Tự động điều hướng đến trang chứa dòng có assignmentDate === hôm nay
  useEffect(() => {
    const indexToday = dummyData.findIndex((row) => row.assignmentDate === today);
    if (indexToday !== -1) {
      const page = Math.floor(indexToday / pageSize) + 1;
      setCurrentPage(page);
    }
  }, [dummyData]);

  const [statusStart, setStatusStart] = useState(true)

  return (
    <div className='worker-detail-for-employer-whole-container'>
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
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}`, { state: item.jobGroupInfo })}>
                  <ContainerOutlined /> Job Group Detail
                </div>
              )
          },
          {
            title:
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${item.jobGroupInfo.id}/employer-job-posting-detail/${item.jobPostingInfo.id}`, { state: { jobGroupInfo: item.jobGroupInfo, jobPostingInfo: item.jobPostingInfo } })}>
                  <SnippetsOutlined /> Job Posting Detail
                </div>
              )
          },
          {
            title: (
              <div className='b-title-2'>
                <SolutionOutlined /> Worker Detail
              </div>
            ),
          },
        ]}
      />

      <div className='worker-detail-for-employer-container'>
        <div className="worker-detail-for-employer-info">
          <div className="worker-detail-for-employer-info-left">
            <div className="worker-identity">
              <img src={avatar} />
              <div className="worker-name-star">
                <p>{item.workerInfo?.workerName}</p>
                <div><Rate defaultValue={4} disabled /></div>
              </div>
            </div>
          </div>

          <div className="worker-detail-for-employer-info-right">
            <h2>Worker Information</h2>
            <div className="worker-info">
              <p className='worker-email'><MailOutlined /> {item.workerInfo?.email}</p>
              <p><UserSwitchOutlined /> Female  </p> {/* -- None -- */}
            </div>
            <div className="worker-info">
              <p><EnvironmentOutlined /> Tỉnh Tây Ninh, Huyện Dương Minh Châu</p>
              <p><PhoneOutlined rotate={90} /> 0123456789 </p>
            </div>
            <div className="worker-info">
              <p><GiftOutlined /> 01/01/2000</p>
            </div>
            {showMore && (
              <>
                <div className='worker-description'>
                  <p> <IdcardOutlined /> About me: </p>
                  <p>I am an energetic individual with experience in seasonal jobs such as sales,
                    customer service support, and gift wrapping during holidays. I have also worked
                    in production environments with high workloads and participated in event organization,
                    assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure,
                    and quickly adjust to job demands.</p>
                  {/* <p>-- None --</p> */}
                </div>
                {/* Nút Show less */}
                <div className="show-more-less-btn show-less">
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
        </div>

        {statusStart && (
          <>
            <h1 className='worker-detail-job-execute-title' ref={jobTitleRef} >Work Progress Table</h1>
            <div className="worker-detail-job-execute-whole-table">
              <table className="worker-detail-job-execute-table">
                <thead>
                  <tr>
                    <th className="no-column">No</th>
                    <th className="job-requirement">Job Requirement</th>
                    <th className='assignment-date'>Assignment <br /> Date</th>
                    <th className="check-in">Check-in</th>
                    <th className="check-out">Check-out</th>
                    <th className="progress">Progress <br /> (%)</th>
                    <th className="progress-completed">Progress Completed (%)</th>
                    <th className="reason">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {/*dummyData*/ paginatedData.map((data, index) => {
                    const globalIndex = (currentPage - 1) * pageSize + index;
                    return (
                      <tr key={index}
                        ref={(el) => {
                          const globalIndex = (currentPage - 1) * pageSize + index;
                          if (data.assignmentDate === today) {
                            rowRefs.current[globalIndex] = el;
                          }
                        }}
                      >
                        <td className="no-column">{data.no}</td>
                        <td className="job-requirement">{data.jobRequirement}</td>
                        <td className='assignment-date'>{data.assignmentDate}</td>
                        {data.checkInUrl ? (
                          <td className="check-in">
                            <Image
                              src={data.checkInUrl}
                            />
                          </td>
                        ) : (
                          <td className="check-in no-img">
                            -- None --
                          </td>
                        )}
                        {data.checkOutUrl ? (
                          <td className="check-out">
                            <Image
                              src={data.checkOutUrl}
                            />
                          </td>
                        ) : (
                          <td className="check-out no-img">
                            -- None --
                          </td>
                        )}
                        <td className="progress">{data.progress}</td>
                        {isEditing && data.assignmentDate === today ? (
                          <td className="progress-completed edit">
                            <Form.Item
                              validateStatus={
                                formik.errors.rows && formik.errors.rows[globalIndex]?.progressCompleted && formik.touched.rows && formik.touched.rows[globalIndex]?.progressCompleted
                                  ? "error"
                                  : ""
                              }
                              help={
                                formik.errors.rows && formik.errors.rows[globalIndex]?.progressCompleted && formik.touched.rows && formik.touched.rows[globalIndex]?.progressCompleted
                                  ? formik.errors.rows[globalIndex].progressCompleted
                                  : null
                              }
                            >
                              <InputNumber
                                className='input'
                                min={0}
                                max={data.progress}
                                value={formik.values.rows[globalIndex].progressCompleted}
                                onChange={(value) => {
                                  formik.setFieldValue(`rows[${globalIndex}].progressCompleted`, value)
                                  if (value === data.progress) {
                                    formik.setFieldValue(`rows[${globalIndex}].reason`, "");
                                  }
                                }}
                                onBlur={() => formik.setFieldTouched(`rows[${globalIndex}].progressCompleted`, true)}
                              />
                            </Form.Item>
                          </td>
                        ) : (
                          <td className="progress-completed">{data.progressCompleted}</td>
                        )}

                        {isEditing && data.assignmentDate === today && formik.values.rows[globalIndex].progressCompleted !== data.progress ? (
                          <td className="reason edit">
                            <Form.Item
                              validateStatus={
                                formik.errors.rows &&
                                  formik.errors.rows[globalIndex]?.reason &&
                                  formik.touched.rows &&
                                  formik.touched.rows[globalIndex]?.reason
                                  ? "error"
                                  : ""
                              }
                              help={
                                formik.errors.rows &&
                                  formik.errors.rows[globalIndex]?.reason &&
                                  formik.touched.rows &&
                                  formik.touched.rows[globalIndex]?.reason
                                  ? formik.errors.rows[globalIndex].reason
                                  : null
                              }
                            >
                              <TextArea
                                className="input"
                                style={{ height: 80, resize: 'none' }}
                                value={formik.values.rows[globalIndex].reason}
                                onChange={(e) =>
                                  formik.setFieldValue(`rows[${globalIndex}].reason`, e.target.value)
                                }
                                onBlur={() => formik.setFieldTouched(`rows[${globalIndex}].reason`, true)}
                              />
                            </Form.Item>
                          </td>
                        ) : (
                          <td className="reason">
                            {/* {formik.values.rows[globalIndex].reason || ""} */}
                            {formik.values.rows[globalIndex].progressCompleted === data.progress
                              ? ""
                              : formik.values.rows[globalIndex].reason || ""}
                          </td>
                        )}

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={dummyData.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              align="center"
            />

            <div className="save-edit-btn">
              {isEditing ? (
                <button className='save-btn' onClick={formik.handleSubmit} type="submit">Save</button>
              ) : (
                <button
                  onClick={() => {
                    // scroll tới dòng có assignmentDate bằng today đúng trang
                    const indexToday = dummyData.findIndex((row) => row.assignmentDate === today);
                    if (indexToday !== -1) {
                      const page = Math.floor(indexToday / pageSize) + 1;
                      // handlePageChange(page);
                      setCurrentPage(page);
                      setTimeout(() => {
                        rowRefs.current[indexToday]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        });
                      }, 100); // delay để đợi table render xong
                    }
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WorkerDetailForEmployer