import React, { useEffect, useRef, useState } from 'react'
import './WorkerDetailForEmployer.css'
import { Breadcrumb, Button, Form, Image, Input, InputNumber, message, Modal, Pagination, Rate, Skeleton } from 'antd'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ContainerOutlined, DownOutlined, EnvironmentOutlined, EyeOutlined, FolderOpenOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, SnippetsOutlined, SolutionOutlined, StarOutlined, UpOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { userApi } from '../../../apis/user.request';
import { jobExecuteApi } from '../../../apis/job-execute.request';
import dayjs from 'dayjs';
const { TextArea } = Input;

const WorkerDetailForEmployer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state; //item này bao gồm cả jobGroupInfo ( thông tin của 1 group) và jobPostingInfo (thông tin của 1 posting) và workerInfo (thông tin của 1 worker)
  // console.log(item);
  const { workerId, postingId } = useParams();
  const [workerLoading, setWorkerLoading] = useState(true);
  const [workerInfo, setWorkerInfo] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [showMore2, setShowMore2] = useState(false);

  const [jobExecutes, setJobExecutes] = useState([]);

  useEffect(() => {
    try {
      const fetchWorkerInfo = async () => {
        const res = await userApi.getUserById(workerId);
        setWorkerLoading(false);
        setWorkerInfo(res.data.data);
      }
      fetchWorkerInfo();
    } catch (error) {
      console.log(error);
      setWorkerLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchJobExecute = async () => {
      try {
        // const res = await jobExecuteApi.getDailyJobExecutes(workerId);
        const res = await jobExecuteApi.getJobExecuteByJobPostingId(postingId);
        // console.log(res.data);
        if (res.data.message === 'No job execute for this job posting') {
          // if (res.data.jobs.length === 0) {
          setJobExecutes([]);
        } else {
          const sortedJobExecutes = res.data.jobs.sort((a, b) => {
            const dateA = dayjs(a.assigned_at, 'DD/MM/YYYY');
            const dateB = dayjs(b.assigned_at, 'DD/MM/YYYY');
            return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0; // Sắp xếp theo ngày tăng dần
          });

          const transformedExecutes = sortedJobExecutes.map((item, index) => ({
            id: item.id,
            no: index + 1,
            jobRequirement: item.note || "No description", // nếu bạn có trường mô tả
            // assignmentDate: '22/04/2025',
            assignmentDate: item.assigned_at || '',
            checkInUrl: item.checkin_img || '',
            checkOutUrl: item.checkout_img || '',
            progress: item.work_process || 0,
            progressCompleted: item.processComplete || 0,
            reason: item.reason || ''
          }));
          setJobExecutes(transformedExecutes);
          console.log(transformedExecutes);

        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchJobExecute()
  }, [])

  // disabled nút Review trước ngày endDate, sau ngày endDate mở nút Review 3 ngày rồi sau sau đó lại disabled nút Review
  // const endDate = new Date('2025-04-14'); // YYYY-MM-DD
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // monthIndex: 0 = January
  };

  const endDate = parseDate('13/04/2025');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tính ngày bắt đầu và ngày kết thúc cho khoảng thời gian được phép đánh giá
  const reviewStartDate = new Date(endDate);
  reviewStartDate.setDate(reviewStartDate.getDate() + 1); // ngày 15

  const reviewEndDate = new Date(endDate);
  reviewEndDate.setDate(reviewEndDate.getDate() + 3); // ngày 17

  const isWithinReviewPeriod = today >= reviewStartDate && today <= reviewEndDate;


  /* Modal Review */
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Mở modal
  const showConfirmModal = () => {
    setConfirmVisible(true);
  };

  // Đóng modal
  const closeConfirm = () => {
    setConfirmVisible(false);
  };

  /* formik Review */
  const [starValue, setStarValue] = useState(5);

  // state lưu đánh giá sau khi Review
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [savedReview, setSavedReview] = useState({
    rating: 5,
    reason: ""
  });
  const [viewReviewVisible, setViewReviewVisible] = useState(false);

  const formikReview = useFormik({
    initialValues: {
      reasonReview: ""
    },
    validationSchema: Yup.object({
      reasonReview: Yup.string()
        .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
        .test("no-question-mark", '* Cannot contain "?" character', value => !/\?/.test(value || ""))
        .test("required-if-star-less-than-5", "* Required", function (value) {
          const { parent } = this;
          if (starValue < 5) {
            return !!value?.trim();
          }
          return true;
        })
    }),
    onSubmit: (values) => {
      setConfirmLoading(true);
      setTimeout(() => {
        message.success(`Review for ${item.workerInfo?.workerName} successfully!`);

        setSavedReview({
          rating: starValue,
          reason: values.reasonReview
        });
        setReviewSubmitted(true);

        // Xử lý khi bấm Yes
        setConfirmLoading(false);
        setConfirmVisible(false);
        formikReview.resetForm();
        setStarValue(5);
      }, 2000);
    },
  });


  // dummyData cho table
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
      assignmentDate: '07/04/2025',
      checkInUrl: "/assets/Cooperation.png",
      checkOutUrl: null,
      progress: 17,
      progressCompleted: 17,
      reason: "Đã hoàn thành, chờ giao nhận",
    },
    {
      no: 4,
      jobRequirement: "Kiểm tra lại các hộp quà đã đóng gói",
      assignmentDate: '08/04/2025',
      checkInUrl: null,
      checkOutUrl: "/assets/Introducing-Man.png",
      progress: 17,
      progressCompleted: 17,
      reason: "Chưa hoàn thành kiểm tra toàn bộ",
    },
    {
      no: 5,
      jobRequirement: "Ghi nhận và báo cáo số lượng quà tặng",
      assignmentDate: '13/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      // checkInUrl: "/assets/Work-On-Computer.png",
      // checkOutUrl: "/assets/background_home.png",
      progress: 17,
      progressCompleted: 17,
      reason: "Chưa hoàn thành báo cáo",
    },
    {
      no: 6,
      jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
      assignmentDate: '14/04/2025',
      checkInUrl: null,
      checkOutUrl: null,
      // checkInUrl: "/assets/Work-On-Computer.png",
      // checkOutUrl: "/assets/background_home.png",
      progress: 17,
      progressCompleted: 17,
      reason: "Đã hoàn thành toàn bộ công việc, nhưng đi trễ",
    },
    {
      no: 7,
      jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
      assignmentDate: '15/04/2025',
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
      window.scrollTo({ top: elementPosition - 100, left: 0, behavior: 'smooth' });
    }
  };

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*dummyData*/jobExecutes.length > 0 ? jobExecutes.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const rowRefs = useRef([]);

  // bắt lỗi khi thay đổi Progress Completed và Reason 
  const formik = useFormik({
    initialValues: {
      rows: /*dummyData*/jobExecutes.length > 0 && jobExecutes.map((row) => ({
        progressCompleted: row.progressCompleted,
        reason: row.reason || "", // dùng dữ liệu có sẵn nếu có
      })),
    },
    validationSchema: Yup.object({
      rows: Yup.array().of(
        Yup.object().shape({
          progressCompleted: Yup.number()
            .test("editable-row-required", "* Required", function (value) {
              const index = parseInt(this.path.match(/\d+/)?.[0] || "-1");
              const row = /*dummyData*/jobExecutes[index];
              if (!row) return true; // fallback
              if ((isToday(row.assignmentDate) && row.checkInUrl && row.checkOutUrl) || isYesterday(row.assignmentDate)) {
                return value !== undefined && value !== null;
              }
              return true; // không validate nếu không được edit
            }),

          reason: Yup.string()
            .test("editable-row-reason-required", "* Required if Progress Completed changed", function (value) {
              const index = parseInt(this.path.match(/\d+/)?.[0] || "-1");
              const row = /*dummyData*/jobExecutes[index];
              const progressCompleted = this.parent.progressCompleted;
              if (!row) return true;

              const isEditable = (isToday(row.assignmentDate) && row.checkInUrl && row.checkOutUrl) || isYesterday(row.assignmentDate);
              const isChanged = progressCompleted !== row.progress;

              if (isEditable && isChanged) {
                return !!value?.trim();
              }
              return true;
            }),
        })
      )
    }),


    onSubmit: async (values) => {
      const updated = [.../*dummyData*/jobExecutes];
      values.rows.forEach((row, i) => {
        updated[i].progressCompleted = row.progressCompleted;
        updated[i].reason = row.reason;
      });
      // setDummyData(updated); // cập nhật lại dữ liệu
      setJobExecutes(updated);
      message.success("Update successfully!");
      setIsEditing(false);

      scrollToValidRow(updated);
    }
  });

  const isToday = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const todayObj = new Date();
    return (
      todayObj.getDate() === parseInt(day) &&
      todayObj.getMonth() + 1 === parseInt(month) &&
      todayObj.getFullYear() === parseInt(year)
    );
  };
  // console.log(isToday('14/04/2025'))

  const isYesterday = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const targetDate = new Date(Number(year), Number(month) - 1, Number(day)); // local time
    const today = new Date();

    // Reset giờ về 0h để so sánh đúng theo ngày, loại bỏ ảnh hưởng của giờ/phút/giây
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays === 1;
  };
  // console.log(isYesterday('13/04/2025'))

  // Tự động điều hướng đến trang chứa dòng có assignmentDate === hôm nay, đến đúng row có assignmentDate === hôm nay
  // Nếu ko có today, tự động điều hướng đến trang chứa dòng có assignmentDate === yesterday, đến đúng row có assignmentDate === yesterday
  // Nếu có cả today (có cả 2 img check-in check-out) và yesterday, ưu tiên điều hướng đến trang chứa dòng có assignmentDate === hôm nay, đến đúng row có assignmentDate === hôm nay
  // Nếu có cả today (thiếu 1 trong 2 hoặc cả 2 img check-in check-out) và yesterday, ưu tiên điều hướng đến trang chứa dòng có assignmentDate === yesterday, đến đúng row có assignmentDate === yesterday
  const scrollToValidRow = (data) => {
    const indexTodayWithImages = data.findIndex(
      row => isToday(row.assignmentDate) && row.checkInUrl && row.checkOutUrl
    );

    const indexYesterday = data.findIndex(
      row => isYesterday(row.assignmentDate)
    );

    let targetIndex = -1;
    if (indexTodayWithImages !== -1) {
      targetIndex = indexTodayWithImages;
    } else if (indexYesterday !== -1) {
      targetIndex = indexYesterday;
    }

    if (targetIndex !== -1) {
      const page = Math.floor(targetIndex / pageSize) + 1;
      setCurrentPage(page);
      setTimeout(() => {
        rowRefs.current[targetIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  };

  useEffect(() => {
    // scrollToValidRow(dummyData);
    scrollToValidRow(jobExecutes)
  }, [/*dummyData*/jobExecutes]);




  /* Nút Edit */
  const [isEditing, setIsEditing] = useState(false);
  // nút edit chỉ được phép bấm khi có ngày assignmentDate trùng với today, 
  // và có assignmentDate trùng với ngày hôm qua 
  const hasTodayOrYesterday = /*dummyData*/jobExecutes.length > 0 && jobExecutes.some((row) => {
    const isTodayRow = isToday(row.assignmentDate) && row.checkInUrl && row.checkOutUrl;
    const isYesterdayRow = isYesterday(row.assignmentDate);
    return isTodayRow || isYesterdayRow;
  });

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
            {workerLoading ? (
              <div className='worker-identity'>
                <Skeleton.Avatar active size={120} />
              </div>
            ) : (
              <div className="worker-identity">
                <img src={workerInfo?.avatar ? workerInfo?.avatar : avatar} />
                <div className="worker-name-star">
                  <p>{workerInfo?.fullName}</p>
                  <div><Rate defaultValue={4} disabled /></div>
                </div>
              </div>
            )}

            <div className="worker-rating">
              <p> * You have 3 days to review this worker starting from the day after the Job Group's End Date. <br />
                After 3 days, reviewing is no longer allowed.
                <br />
                {/* * If no review is submitted within this period, the system will automatically assign a 5-star
                rating by default for this worker.  */}
              </p>
              {!reviewSubmitted ? (
                <button disabled={!isWithinReviewPeriod} onClick={showConfirmModal}>
                  <StarOutlined /> &#160;Review
                </button>
              ) : (
                <button onClick={() => setViewReviewVisible(true)}>
                  <EyeOutlined /> &#160;View Review
                </button>
              )}
              {/* Modal để review */}
              <Modal
                title={<p className='employer-evaluate-worker-title'>  <StarOutlined /> &#160;Rating for {item.workerInfo?.workerName}</p>}
                open={confirmVisible}
                onCancel={closeConfirm}
                footer={[
                  <Button key="no" onClick={closeConfirm} size='large'>No</Button>,
                  <Button key="yes" type="primary" size='large' /*onClick={handleConfirm}*/ onClick={formikReview.handleSubmit} loading={confirmLoading}>
                    Yes
                  </Button>
                ]}
              >
                <div className='employer-evaluate-worker-rating'>
                  <p>Rating: </p>
                  &ensp; <Rate
                    defaultValue={5}
                    value={starValue}
                    onChange={(value) => {
                      setStarValue(value);
                      if (value === 5) {
                        formikReview.setFieldValue("reasonReview", ""); // reset reason nếu 5 sao
                      }
                    }}
                  />
                </div>

                {starValue < 5 && (
                  <div className="employer-evaluate-worker-reason">
                    <p><span>*</span> Reason: </p>
                    <Form.Item
                      validateStatus={formikReview.errors.reasonReview && formikReview.touched.reasonReview ? "error" : ""}
                      help={formikReview.errors.reasonReview && formikReview.touched.reasonReview ? formikReview.errors.reasonReview : ""}
                    >
                      <TextArea
                        className='input'
                        placeholder="Input your reason..."
                        onChange={formikReview.handleChange}
                        onBlur={formikReview.handleBlur}
                        name="reasonReview"
                        value={formikReview.values.reasonReview}
                        style={{ height: 75, resize: 'none' }}
                      />
                    </Form.Item>
                  </div>
                )}
              </Modal>

              {/* Modal để xem review */}
              <Modal
                title={<p className='employer-evaluate-worker-title'>📝 Review for {item.workerInfo?.workerName}</p>}
                open={viewReviewVisible}
                onOk={() => setViewReviewVisible(false)}
                onCancel={() => setViewReviewVisible(false)}
                footer={[
                  <Button key="ok" type="primary" onClick={() => setViewReviewVisible(false)}>
                    OK
                  </Button>
                ]}
              >
                <div className='employer-evaluate-worker-rating'>
                  <p><strong>Rating:</strong></p>
                  &ensp; <Rate disabled value={savedReview.rating} />
                </div>

                {savedReview.reason && (
                  <div className='employer-evaluate-worker-reason'>
                    <p><strong>Reason:</strong></p>
                    <p className='content'>{savedReview.reason}</p>
                  </div>
                )}
              </Modal>
            </div>
          </div>

          {workerLoading ? (
            <div className='worker-detail-for-employer-info-right'>
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            <div className="worker-detail-for-employer-info-right">
              <h2>Worker Information</h2>
              <div className="worker-info">
                <p className='worker-email'><MailOutlined /> {workerInfo?.email}</p>
                <p><UserSwitchOutlined /> Female  </p> {/* -- None -- */}
              </div>
              <div className="worker-info">
                <p><EnvironmentOutlined /> {workerInfo?.address ? workerInfo?.address : "-- None --"}</p>
                <p><PhoneOutlined rotate={90} /> {workerInfo?.phoneNumber ? workerInfo?.phoneNumber : "-- None --"} </p>
              </div>
              <div className="worker-info">
                <p><GiftOutlined /> 01/01/2000</p>
              </div>
              {showMore && (
                <>
                  <div className='worker-description'>
                    <p> <IdcardOutlined /> About me: </p>
                    <p>{workerInfo?.description ? workerInfo?.description : "-- None --"}</p>
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
          )}
        </div>

        {statusStart && (
          <>
            <h1 className='worker-detail-job-execute-title' ref={jobTitleRef} >Work Progress Table</h1>
            <div className="editing-rules">
              <p className='editing-rules-title'> <span>💡</span> You should read the Editing Rules carefully before making any changes
                to the Progress Completed value to avoid confusion. </p>
              {showMore2 && (
                <>
                  <p className='editing-rules-content'>
                    <span>Rules for editing Progress Completed:</span> <br />
                    &ensp; • &#160; By default, this % Progress Completed of this worker will be equal to the % Progress
                    at the level you set earlier. If the Assignment Date is today and the worker has submitted both
                    check-in and check-out photos, you are allowed to adjust the % Progress Completed if you are not satisfied. <br />

                    &ensp; • &#160; If you lower the % Progress Completed from the original value, you are required to provide a Reason.  <br />

                    &ensp; • &#160; If the worker has not submitted both check-in and check-out photos today, you are not allowed to
                    edit the % Progress Completed for today.  <br />

                    &ensp; • &#160; However, on the following day, if the Assignment Date is yesterday, you are still allowed to edit
                    the % Progress Completed for that day, regardless of whether the worker submitted the photos or not.  <br />

                    &ensp; • &#160; Once the Assignment Date is earlier than yesterday, you can no longer edit the % Progress Completed
                    for that date.
                  </p>
                  {/* Nút Show less */}
                  <div className="show-more-less-btn show-less">
                    <button onClick={() => { setShowMore2(false); window.scroll({ top: 550, left: 0, behavior: 'smooth' }); }}><UpOutlined /> Show less</button>
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
                          if (isToday(data.assignmentDate) || isYesterday(data.assignmentDate)) {
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
                        {isEditing && (
                          (isToday(data.assignmentDate) && data.checkInUrl && data.checkOutUrl) ||
                          isYesterday(data.assignmentDate)
                        ) ? (

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

                        {isEditing &&
                          (
                            (isToday(data.assignmentDate) && data.checkInUrl && data.checkOutUrl) ||
                            isYesterday(data.assignmentDate)
                          ) &&
                          formik.values.rows[globalIndex].progressCompleted !== data.progress ? (

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
                            {formik.values.rows[globalIndex]?.progressCompleted === data.progress
                              ? ""
                              : formik.values.rows[globalIndex]?.reason || ""}
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
              total={/*dummyData*/jobExecutes.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              align="center"
              showLessItems
              showQuickJumper
            />

            <div className="save-edit-btn">
              {isEditing ? (
                <button className='save-btn' onClick={formik.handleSubmit} type="submit">Save</button>
              ) : (
                <button
                  className='edit-btn'
                  disabled={!hasTodayOrYesterday}
                  onClick={() => {
                    scrollToValidRow(/*dummyData*/jobExecutes);
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