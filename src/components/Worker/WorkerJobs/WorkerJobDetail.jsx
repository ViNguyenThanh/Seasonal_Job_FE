import React, { useEffect, useRef, useState } from 'react'
import './WorkerJobDetail.css'
import { ArrowLeftOutlined, ContainerOutlined, CreditCardOutlined, DashboardOutlined, DownOutlined, EnvironmentOutlined, FileTextOutlined, PlusOutlined, ProductOutlined, ScheduleOutlined, SnippetsOutlined, StarOutlined, TagOutlined, UpOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Image, message, Pagination, Skeleton, Upload } from 'antd';
import { jobApi } from '../../../apis/job.request';
import { jobGroupApi } from '../../../apis/job-group.request';
import { jobExecuteApi } from '../../../apis/job-execute.request';
import dayjs from 'dayjs';

const WorkerJobDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    // const jobInfo = location.state;  // Dữ liệu truyền qua state từ WorkerJobs component
    const [showMore, setShowMore] = useState(false);
    const [jobInfo, setJobInfo] = useState({
        jobGroupName: '',
        title: '',
        address: '',
        description: '',
        jobType: '',
        salary: 0,
        during: 0,
        startDate: '',
        endDate: '',
        jobGroupId: 0,
        jobPostingId: 0
    });
    const [jobExecutes, setJobExecutes] = useState([]);
    const [jobPostingLoading, setJobPostingLoading] = useState(true);
    // if (!jobInfo) {
    //     return <p>Job not found.</p>;
    // }

    // Trong khi Upload và Image của Ant Design yêu cầu fileList là một mảng đối tượng có format như sau:
    // {
    //     uid: string,
    //     name: string,
    //     status: 'done',
    //     url: string
    // }

    useEffect(() => {
        try {
            const fetchJobPostingInfo = async () => {
                const jobPostingDetail = await jobApi.getJobById(id)
                // console.log(jobPostingDetail);
                if (jobPostingDetail.status === 200) {
                    const jobGroupDetail = await jobGroupApi.getJobGroupById(jobPostingDetail.data.data.jobGroupId)
                    // console.log(jobGroupDetail);
                    // Convert startDate and endDate from string to Date using ISO 8601 format
                    const startDate = new Date(jobGroupDetail.data.data.start_date);
                    const endDate = new Date(jobGroupDetail.data.data.end_date);

                    // Calculate the duration in days
                    const timeDifference = endDate - startDate; // Time difference in milliseconds
                    const daysDuration = (timeDifference / (1000 * 3600 * 24)) + 1; // Convert milliseconds to days

                    setJobInfo({
                        jobGroupName: jobGroupDetail.data.data.title,
                        title: jobPostingDetail.data.data.title,
                        address: jobPostingDetail.data.data.address,
                        description: jobPostingDetail.data.data.description,
                        jobType: jobPostingDetail.data.data.JobType?.name ? jobPostingDetail.data.data.JobType.name : '-- None --',
                        salary: jobPostingDetail.data.data.salary,
                        during: daysDuration,
                        startDate: jobGroupDetail.data.data.start_date,
                        endDate: jobGroupDetail.data.data.end_date,
                        jobGroupId: jobGroupDetail.data.data.id,
                        jobPostingId: jobPostingDetail.data.data.id
                    })
                }
            };
            fetchJobPostingInfo();
        } catch (error) {
            console.log(error);
        }
    }, []);
    // console.log(jobInfo);

    useEffect(() => {
        const fetchJobExecute = async () => {
            try {
                const res = await jobExecuteApi.getJobExecuteByJobPostingId(id)
                console.log(res.data);
                if (res.data.message === 'No job execute for this job posting') {
                    setJobExecutes([]);
                } else {
                    const sortedJobExecutes = res.data.data.sort((a, b) => {
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
                        checkInFileList: item.checkin_img ? [{
                            uid: '-1',
                            name: 'Checkin.jpg',
                            status: 'done',
                            url: item.checkin_img
                        }] : [],
                        checkOutFileList: item.checkout_img ? [{
                            uid: '-2',
                            name: 'Checkout.jpg',
                            status: 'done',
                            url: item.checkout_img
                        }] : [],
                        progress: item.work_process || 0,
                        progressCompleted: (item.checkin_img && item.checkout_img) ? item.work_process : 0,
                        reason: item.reason || ''
                    }));

                    setJobExecutes(transformedExecutes);
                }
                setJobPostingLoading(false);
            } catch (error) {
                console.log(error);
                message.error(`An error occurred while fetching: ${error.data.message}`);
                setJobPostingLoading(false);
            }
        }

        fetchJobExecute()
    }, [])

    const updateJobExecute = async (jobId, data) => {
        message.loading('Updating...');
        try {
            const formData = new FormData();
            if (
                data.checkInFileList.length > 0 &&
                data.checkInFileList[0].originFileObj
            ) {
                formData.append('checkin_img', data.checkInFileList[0].originFileObj);
            }

            if (
                data.checkOutFileList.length > 0 &&
                data.checkOutFileList[0].originFileObj
            ) {
                formData.append('checkout_img', data.checkOutFileList[0].originFileObj);
            }

            formData.append('processComplete', data.progressCompleted || 0);
            // for (let pair of formData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]); // In ra key và value của FormData
            // }

            const result = await jobExecuteApi.updateJobExecute(jobId, formData);

            if (result.status === 200) {
                message.destroy()
                message.success('Update successfully');
            }

        } catch (error) {
            console.error('Error:', error);
            message.destroy()
            message.error('An error occurred while updating');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu ngày < 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, nhớ cộng 1 vì tháng trong JavaScript bắt đầu từ 0
        const year = date.getFullYear(); // Lấy năm
        return `${day}/${month}/${year}`; // Định dạng lại thành dd/mm/yyyy
    };

    const [dummyData, setDummyData] = useState([
        {
            no: 1,
            jobRequirement: "Đóng gói quà tặng cho khách hàng theo đơn đặt hàng",
            assignmentDate: '10/04/2025',
            checkInFileList: [],
            checkOutFileList: [
                {
                    uid: '-1',
                    name: 'AccessDenied.jpg',
                    status: 'done',
                    url: '/assets/image_admin_login.png',
                }
            ],
            progress: 17,
            progressCompleted: 17,
            reason: "Quà đã sẵn sàng, chờ hoàn tất đóng gói",
        },
        {
            no: 2,
            jobRequirement: "Sắp xếp quà tặng vào hộp đựng theo yêu cầu",
            assignmentDate: '11/04/2025',
            checkInFileList: [
                {
                    uid: '-1',
                    name: 'AccessDenied.jpg',
                    status: 'done',
                    url: '/assets/AccessDenied.jpg',
                }
            ],
            checkOutFileList: [],
            progress: 17,
            progressCompleted: 17,
            reason: "Đang kiểm tra chất lượng quà",
        },
        {
            no: 3,
            jobRequirement: "Vận chuyển quà tặng đến khu vực tổ chức",
            assignmentDate: '13/04/2025',
            checkInFileList: [],
            checkOutFileList: [],
            progress: 17,
            progressCompleted: 17,
            reason: "Đã hoàn thành, chờ giao nhận",
        },
        {
            no: 4,
            jobRequirement: "Kiểm tra lại các hộp quà đã đóng gói",
            assignmentDate: '15/04/2025',
            checkInFileList: [],
            checkOutFileList: [],
            progress: 17,
            progressCompleted: 17,
            reason: "Chưa hoàn thành kiểm tra toàn bộ",
        },
        {
            no: 5,
            jobRequirement: "Ghi nhận và báo cáo số lượng quà tặng",
            assignmentDate: '16/04/2025',
            checkInFileList: [],
            checkOutFileList: [],
            progress: 17,
            progressCompleted: 17,
            reason: "Chưa hoàn thành báo cáo",
        },
        {
            no: 6,
            jobRequirement: "Dọn dẹp và kiểm tra lại khu vực đóng gói",
            assignmentDate: '18/04/2025',
            checkInFileList: [],
            checkOutFileList: [],
            progress: 15,
            progressCompleted: 13,
            reason: "Đã hoàn thành toàn bộ công việc, nhưng đi trễ",
        }
    ]);


    const [previewOpen, setPreviewOpen] = useState(false);
    // BỎ: preview ảnh nên chia làm 2 biến riêng, nếu không khi preview sẽ bị hiện ảnh 2 lần 
    // const [previewImage, setPreviewImage] = useState('');
    const [checkInPreviewImage, setCheckInPreviewImage] = useState('');
    const [checkOutPreviewImage, setCheckOutPreviewImage] = useState('');

    // chỉ dùng được cho 1 row
    // const handleCheckInChange = ({ fileList: newFileList }) => setCheckInFileList(newFileList);
    // const handleCheckOutChange = ({ fileList: newFileList }) => setCheckOutFileList(newFileList);
    const handleCheckInChange = (index, { fileList: newFileList }) => {
        const updatedData = [...jobExecutes/*dummyData*/];
        // bỏ vì up hình hàng 1 trang 2 bị ghi đè lên hàng 1 trang 1
        // updatedData[index].checkInFileList = newFileList;
        updatedData[(currentPage - 1) * pageSize + index].checkInFileList = newFileList;

        // Kiểm tra nếu thiếu check-in hoặc check-out, đặt progressCompleted = 0
        if (
            !updatedData[(currentPage - 1) * pageSize + index].checkInFileList.length ||
            !updatedData[(currentPage - 1) * pageSize + index].checkOutFileList.length
        ) {
            updatedData[(currentPage - 1) * pageSize + index].progressCompleted = 0;
        } else {
            updatedData[(currentPage - 1) * pageSize + index].progressCompleted = updatedData[(currentPage - 1) * pageSize + index].progress;
        }

        // Cập nhật lại dummyData với check-in mới
        /*setDummyData*/setJobExecutes(updatedData);

        const jobId = updatedData[(currentPage - 1) * pageSize + index].id;
        updateJobExecute(jobId, updatedData[(currentPage - 1) * pageSize + index]);
    };
    const handleCheckOutChange = (index, { fileList: newFileList }) => {
        const updatedData = [...jobExecutes/*dummyData*/];
        // updatedData[index].checkOutFileList = newFileList;
        updatedData[(currentPage - 1) * pageSize + index].checkOutFileList = newFileList;

        // Kiểm tra nếu thiếu check-in hoặc check-out, đặt progressCompleted = 0
        if (
            !updatedData[(currentPage - 1) * pageSize + index].checkInFileList.length ||
            !updatedData[(currentPage - 1) * pageSize + index].checkOutFileList.length
        ) {
            updatedData[(currentPage - 1) * pageSize + index].progressCompleted = 0;
        } else {
            updatedData[(currentPage - 1) * pageSize + index].progressCompleted = updatedData[(currentPage - 1) * pageSize + index].progress;
        }

        // Cập nhật lại dummyData với check-out mới
        /*setDummyData*/setJobExecutes(updatedData);
        const jobId = updatedData[(currentPage - 1) * pageSize + index].id;
        updateJobExecute(jobId, updatedData[(currentPage - 1) * pageSize + index]);
    };

    // Hàm xem trước ảnh (check-in hoặc check-out)
    const handlePreview = async (file, type) => {
        console.log(file);

        // Nếu ảnh không có URL hoặc preview, tạo preview bằng FileReader
        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.onload = () => {
                //  setPreviewImage(reader.result);
                if (type === 'check-in') {
                    setCheckInPreviewImage(reader.result);
                } else {
                    setCheckOutPreviewImage(reader.result);
                }
                setPreviewOpen(true);
            };
            // reader.onerror = () => console.error("Can't read file.");
            reader.readAsDataURL(file.originFileObj); // Chỉ gọi một lần duy nhất
        } else {
            // setPreviewImage(file.url || file.preview);
            if (type === 'check-in') {
                setCheckInPreviewImage(file.url || file.preview);
            } else {
                setCheckOutPreviewImage(file.url || file.preview);
            }
            setPreviewOpen(true);
        }
    };

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
    const paginatedData = jobExecutes.length > 0 ? jobExecutes/*dummyData*/.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

    const today = new Date().toLocaleDateString('en-GB');

    // hiện tới row có assignmentDate bằng today đúng trang
    const rowRefs = useRef([]);
    const [hasScrolledToToday, setHasScrolledToToday] = useState(false);
    useEffect(() => {
        if (hasScrolledToToday) return;

        // const today = new Date().toLocaleDateString('en-GB'); 
        const targetIndex = jobExecutes/*dummyData*/.findIndex(item => item.assignmentDate === today);

        if (targetIndex !== -1) {
            const targetPage = Math.floor(targetIndex / pageSize) + 1;
            if (targetPage !== currentPage) {
                setCurrentPage(targetPage);
                // Dùng timeout để đợi render page xong rồi mới scroll
                setTimeout(() => {
                    rowRefs.current[targetIndex]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }, 200);
            } else {
                // Nếu đang ở đúng page, scroll luôn
                rowRefs.current[targetIndex]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [hasScrolledToToday]);

    return (
        <div className='worker-job-detail-container'>
            <button
                className='go-back-btn'
                onClick={() => navigate('/worker/worker-jobs', window.scrollTo(0, 0))}>
                <ArrowLeftOutlined />
            </button>

            <h1 className='worker-job-detail-title'>Job Detail</h1>
            {/* <h1>Job Detail: {jobInfo.title}</h1> */}

            {jobPostingLoading ? (
                <div>
                    <Skeleton active />
                    <Skeleton active />
                </div>
            ) : (
                <div className="worker-job-detail-info">
                    <p><ContainerOutlined /> Job Group Name: {jobInfo.jobGroupName}</p>
                    <div className="worker-job-detail-short-info">
                        <p><ScheduleOutlined /> Start Date: {formatDate(jobInfo.startDate)}</p>
                        <p><ScheduleOutlined /> End Date: {formatDate(jobInfo.endDate)}</p>
                    </div>
                    <p><SnippetsOutlined /> Job Name:  {jobInfo.title}</p>
                    <p><EnvironmentOutlined /> Address: {jobInfo.address}</p>
                    {/* <p><ProductOutlined /> Company: Công ty tổ chức sự kiện và quản lý chương trình ABC chuyên nghiệp tại TP.HCM.</p> */}
                    <div className="worker-job-detail-short-info">
                        <p><CreditCardOutlined /> Salary: {parseFloat(jobInfo.salary).toLocaleString('vi-VN')} VND</p>
                        <p><DashboardOutlined /> During: {jobInfo.during} Day{jobInfo.during === 1 ? '' : 's'}</p>
                    </div>
                    {/* Hiển thị nội dung mở rộng nếu showMore = true */}
                    {showMore && (
                        <>
                            <p><TagOutlined /> Job Type: {jobInfo.jobType ? jobInfo.jobType : '-- None --'}</p>
                            {/* <p><StarOutlined /> Special Skills: Nhanh nhẹn, năng suất, thành thạo đóng gói, cẩn thận trong công việc, có khả năng làm việc dưới áp lực cao.</p> */}
                            <p><FileTextOutlined /> Description: <br /> {jobInfo.description}</p>

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
            )}

            <h1 className='worker-job-execute-title' ref={jobTitleRef} >Work Progress Table</h1>
            <p className='warning-notice'> * You are required to submit both Check-in and Check-out photos on the specified Assignment Date. If not submitted, your Progress Completed for that day will be automatically set to 0%.</p>
            <div className="worker-job-execute-whole-table">
                <table className="worker-job-execute-table">
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
                                    ref={(el) => (rowRefs.current[globalIndex] = el)}
                                >
                                    <td className="no-column">{data.no}</td>
                                    <td className="job-requirement">{data.jobRequirement}</td>
                                    <td className='assignment-date'>{data.assignmentDate}</td>
                                    {data.assignmentDate === today ? (
                                        <td className="check-in">
                                            <Upload
                                                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                listType="picture-card"
                                                // beforeUpload={(file) => {
                                                //     getBase64(file).then(base64 => {
                                                //         file.preview = base64; // Lưu vào preview
                                                //     });
                                                //     return false; // Ngăn upload thật
                                                // }}
                                                // beforeUpload={() => false} // 🚫 Không upload tự động
                                                beforeUpload={(file) => {
                                                    const isImage = file.type.startsWith('image/'); // Kiểm tra xem file có phải là ảnh không
                                                    if (!isImage) {
                                                        message.error('You can only upload image files!');
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    return false; // Nếu không phải ảnh, sẽ không cho upload
                                                }}
                                                fileList={data.checkInFileList}
                                                onChange={(e) => handleCheckInChange(index, e)}
                                                onPreview={(file) => handlePreview(file, 'check-in')}
                                                maxCount={1}
                                            >
                                                {data.checkInFileList.length === 0 && (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {checkInPreviewImage && (
                                                <Image
                                                    wrapperStyle={{ display: 'none' }}
                                                    preview={{
                                                        visible: previewOpen,
                                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                                        // afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                        afterOpenChange: (visible) => !visible && setCheckInPreviewImage(''),
                                                    }}
                                                    // src={previewImage}
                                                    src={checkInPreviewImage}
                                                />
                                            )}
                                        </td>
                                    ) : data.checkInFileList.length > 0 ? (
                                        <td className="check-in">
                                            <Image
                                                width={80}
                                                src={data.checkInFileList[0].url}
                                                // BỎ vì chế độ preview bị hiện 2 lần 
                                                // onClick={() => handlePreview(data.checkInFileList[0])}
                                                // onClick={() => setPreviewImage(data.checkInFileList[0].url)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    ) : (
                                        <td className="check-in not-allowed">
                                            Not allowed
                                        </td>
                                    )}

                                    {data.assignmentDate === today ? (
                                        <td className="check-out">
                                            <Upload
                                                // beforeUpload={() => false} // 🚫 Không upload tự động
                                                beforeUpload={(file) => {
                                                    const isImage = file.type.startsWith('image/'); // Kiểm tra xem file có phải là ảnh không
                                                    if (!isImage) {
                                                        message.error('You can only upload image files!');
                                                        return Upload.LIST_IGNORE;
                                                    }
                                                    return false; // Nếu không phải ảnh, sẽ không cho upload
                                                }}
                                                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                listType="picture-card"
                                                fileList={data.checkOutFileList}
                                                onChange={(e) => handleCheckOutChange(index, e)}
                                                onPreview={(file) => handlePreview(file, 'check-out')}
                                                maxCount={1}
                                            >
                                                {data.checkOutFileList.length === 0 && (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {checkOutPreviewImage && (
                                                <Image
                                                    wrapperStyle={{ display: 'none' }}
                                                    preview={{
                                                        visible: previewOpen,
                                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                                        // afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                        afterOpenChange: (visible) => !visible && setCheckOutPreviewImage(''),
                                                    }}
                                                    // src={previewImage}
                                                    src={checkOutPreviewImage}
                                                />
                                            )}
                                        </td>
                                    ) : data.checkOutFileList.length > 0 ? (
                                        <td className="check-out">
                                            <Image
                                                width={80}
                                                src={data.checkOutFileList[0].url}
                                                // BỎ vì chế độ preview bị hiện 2 lần 
                                                // onClick={() => handlePreview(data.checkOutFileList[0])}
                                                // onClick={() => setPreviewImage(data.checkOutFileList[0].url)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    ) : (
                                        <td className="check-out not-allowed">
                                            Not allowed
                                        </td>
                                    )}
                                    <td className="progress">{data.progress}</td>
                                    <td className="progress-completed">
                                        {data.checkInFileList.length === 0 || data.checkOutFileList.length === 0
                                            ? 0
                                            : data.progressCompleted}
                                    </td>
                                    <td className="reason">{data.reason}</td>
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

        </div>
    )
}

export default WorkerJobDetail