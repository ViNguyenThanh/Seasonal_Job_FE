import React, { useEffect, useRef, useState } from 'react'
import './WorkerJobDetail.css'
import { ArrowLeftOutlined, ContainerOutlined, CreditCardOutlined, DashboardOutlined, DownOutlined, EnvironmentOutlined, FileTextOutlined, PlusOutlined, ProductOutlined, ScheduleOutlined, SnippetsOutlined, StarOutlined, TagOutlined, UpOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image, Pagination, Upload } from 'antd';

const WorkerJobDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const jobInfo = location.state;  // Dữ liệu truyền qua state từ WorkerJobs component
    const [showMore, setShowMore] = useState(false);

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
        const updatedData = [...dummyData];
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
        setDummyData(updatedData);
    };
    const handleCheckOutChange = (index, { fileList: newFileList }) => {
        const updatedData = [...dummyData];
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
        setDummyData(updatedData);
    };

    // Hàm xem trước ảnh (check-in hoặc check-out)
    const handlePreview = async (file, type) => {
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
    const paginatedData = dummyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const today = new Date().toLocaleDateString('en-GB');

    // hiện tới row có assignmentDate bằng today đúng trang
    const rowRefs = useRef([]);
    const [hasScrolledToToday, setHasScrolledToToday] = useState(false);
    useEffect(() => {
        if (hasScrolledToToday) return;

        // const today = new Date().toLocaleDateString('en-GB'); 
        const targetIndex = dummyData.findIndex(item => item.assignmentDate === today);

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

            <div className="worker-job-detail-info">
                <p><ContainerOutlined /> Job Group Name: Sự kiện Global City, chuyên trách các công việc từ chuẩn bị địa điểm đến hỗ trợ đóng gói và tổ chức.</p>
                <div className="worker-job-detail-short-info">
                    <p><ScheduleOutlined /> Start Date: 22/05/2025</p>
                    <p><ScheduleOutlined /> End Date: 27/05/2025</p>
                </div>
                <p><SnippetsOutlined /> Job Name:  Nhân viên đóng gói quà sự kiện, thực hiện các công việc đóng gói, sắp xếp quà tặng theo hướng dẫn và đảm bảo tiêu chuẩn chất lượng.</p>
                <p><EnvironmentOutlined /> Address: 15 đường Cách Mạng Tháng 8, phường 4, quận 1, TP.HCM</p>
                <p><ProductOutlined /> Company: Công ty tổ chức sự kiện và quản lý chương trình ABC chuyên nghiệp tại TP.HCM.</p>
                <div className="worker-job-detail-short-info">
                    <p><CreditCardOutlined /> Salary: 300.000 VND</p>
                    <p><DashboardOutlined /> During: 5 ngày</p>
                </div>
                {/* Hiển thị nội dung mở rộng nếu showMore = true */}
                {showMore && (
                    <>
                        <p><TagOutlined /> Job Type: Nhân viên hỗ trợ sự kiện, chịu trách nhiệm đóng gói quà tặng, kiểm tra chất lượng và chuẩn bị sản phẩm trước khi giao cho khách hàng.</p>
                        <p><StarOutlined /> Special Skills: Nhanh nhẹn, năng suất, thành thạo đóng gói, cẩn thận trong công việc, có khả năng làm việc dưới áp lực cao.</p>
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

            <h1 className='worker-job-execute-title' ref={jobTitleRef} >Work Progress Table</h1>
            <p className='warning-notice'> * You are required to submit both Check-in and Check-out photos every day. If not submitted, your Progress Completed for that day will be automatically set to 0%.</p>
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
                                                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                listType="picture-card"
                                                // beforeUpload={(file) => {
                                                //     getBase64(file).then(base64 => {
                                                //         file.preview = base64; // Lưu vào preview
                                                //     });
                                                //     return false; // Ngăn upload thật
                                                // }}
                                                fileList={data.checkInFileList}
                                                onChange={(e) => handleCheckInChange(index, e)}
                                                onPreview={handlePreview}
                                                maxCount={1}
                                            >
                                                {data.checkInFileList.length === 0 && (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </td>
                                    ) : data.checkInFileList.length > 0 ? (
                                        <td className="check-in">
                                            <Image
                                                width={80}
                                                src={data.checkInFileList[0].url}
                                                // BỎ vì chế độ preview bị hiện 2 lần 
                                                // onClick={() => handlePreview(data.checkInFileList[0])}
                                                onClick={() => setPreviewImage(data.checkInFileList[0].url)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {/* {previewImage && ( */}
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
                                    ) : (
                                        <td className="check-in not-allowed">
                                            Not allowed
                                        </td>
                                    )}
                                    
                                    {data.assignmentDate === today ? (
                                        <td className="check-out">
                                            <Upload
                                                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                listType="picture-card"
                                                fileList={data.checkOutFileList}
                                                onChange={(e) => handleCheckOutChange(index, e)}
                                                onPreview={handlePreview}
                                                maxCount={1}
                                            >
                                                {data.checkOutFileList.length === 0 && (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </td>
                                    ) : data.checkOutFileList.length > 0 ? (
                                        <td className="check-out">
                                            <Image
                                                width={80}
                                                src={data.checkOutFileList[0].url}
                                                // BỎ vì chế độ preview bị hiện 2 lần 
                                                // onClick={() => handlePreview(data.checkOutFileList[0])}
                                                onClick={() => setPreviewImage(data.checkOutFileList[0].url)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            {/* {previewImage && ( */}
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
                total={dummyData.length}
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