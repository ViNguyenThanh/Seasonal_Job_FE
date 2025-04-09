import React, { useEffect, useState } from 'react'
import './EmployerJobGroupDetail.css'
import { ArrowLeftOutlined, ArrowRightOutlined, ContainerOutlined, DiffOutlined, DollarOutlined, DownOutlined, EnvironmentOutlined, FileTextOutlined, FolderOpenOutlined, ProfileOutlined, ScheduleOutlined, SnippetsOutlined, UpOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getJobGroupById } from '../../../redux/actions/jobgroups.action';
import { getJobPostingByJGId } from '../../../redux/actions/jobposting.action';


const EmployerJobGroupDetail = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const { id } = useParams()
    const { isLoading: isJGLoading, payload: jobGroupInfo } = useSelector(state => state.jobGroupsReducer)
    const { isLoading: isJPLoading, payload: jobPostings } = useSelector(state => state.jobPostingReducer)
    const jobGroupInfoTmp = location.state || {};

    const listData = [
        {
            id: 1,
            title: "Nhân viên bán hàng",
            location: "Số 10, Đường Lê Lai, Phường Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh",
            salary: 5000000,
        },
        {
            id: 2,
            title: "Kế toán viên",
            location: "Số 8, Đường Phạm Văn Đồng, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
            salary: 7000000,
        },
        {
            id: 3,
            title: "Lao động phổ thông",
            location: "Số 5, Đường Trần Phú, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng",
            salary: 200000,
        },
        {
            id: 4,
            title: "Nhân viên thu ngân",
            location: "Số 3, Đường Lê Hồng Phong, Phường Phú Hòa, Thủ Dầu Một, Bình Dương",
            salary: 12000000,
        },
        {
            id: 5,
            title: "Tạp vụ",
            location: "Số 12, Đường Điện Biên Phủ, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh",
            salary: 4000000,
        },
        {
            id: 6,
            title: "Bảo vệ",
            location: "Số 18, Đường Minh Khai, Phường Thanh Lương, Quận Hai Bà Trưng, Hà Nội",
            salary: 6000000,
        }
    ];

    useEffect(() => {
        dispatch(getJobGroupById(id))
        dispatch(getJobPostingByJGId(id))
    }, [dispatch])

    return (
        <div className='employer-job-group-detail-whole-container'>
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
                        title: (
                            <div className='b-title-2'>
                                <ContainerOutlined /> {jobGroupInfo?.title}
                            </div>
                        ),
                    },
                ]}
            />
            <div className="employer-job-group-detail-container">
                {/* dùng Breadcrumb r nên bỏ nút này */}
                {/* <button
                    className='go-back-btn'
                    onClick={() => navigate('/employer/employer-job-groups', window.scrollTo(0, 0))}>
                    <ArrowLeftOutlined />
                </button> */}

                <h1 className='employer-job-group-detail-title'>Job Group Detail</h1>

                {isJGLoading ? (
                    <div className='employer-job-group-detail-skeleton'>
                        <Skeleton active />
                    </div>
                ) : (
                    <div className="employer-job-group-detail-info">
                        <p><ProfileOutlined /> Job Group Name: {jobGroupInfo?.title}</p>
                        <p><DiffOutlined /> Number of Job Postings: {jobGroupInfo?.totalJobPosting}</p>
                        <div className="employer-job-group-detail-short-info">
                            <p><ScheduleOutlined /> Start Date: {jobGroupInfo?.start_date?.split('T')[0]}</p>
                            <p><ScheduleOutlined /> End Date: {jobGroupInfo?.end_date?.split('T')[0]}</p>
                        </div>
                        {/* Hiển thị nội dung mở rộng nếu showMore = true */}
                        {showMore && (
                            <>
                                {/* <p><FileTextOutlined /> Description: <br /> Công việc này sẽ bao gồm nhiều nhiệm vụ liên quan đến việc đóng gói quà tặng cho sự kiện Global City. Nhân viên đóng gói sẽ chịu trách nhiệm chuẩn bị, sắp xếp và đóng gói các sản phẩm quà tặng theo yêu cầu của ban tổ chức. Các công việc sẽ được thực hiện dưới sự giám sát trực tiếp của quản lý, đảm bảo rằng chất lượng và tiến độ công việc luôn đạt tiêu chuẩn cao nhất. Mỗi món quà tặng phải được đóng gói cẩn thận, đúng cách, và không có bất kỳ lỗi nào trong quá trình sắp xếp. Để đạt được hiệu quả công việc tối ưu, nhân viên cần phải có khả năng làm việc nhóm và giao tiếp tốt với các thành viên trong nhóm.

                                Trong quá trình thực hiện công việc, nhân viên sẽ phải lựa chọn vật liệu đóng gói phù hợp với từng sản phẩm, từ giấy bọc, dây ruy băng, đến hộp đựng, sao cho các quà tặng không bị hư hỏng trong quá trình vận chuyển. Mỗi công đoạn đóng gói phải được thực hiện chính xác và tỉ mỉ, đảm bảo rằng các sản phẩm đều có diện mạo đẹp mắt và thu hút người nhận. Việc đảm bảo an toàn trong quá trình đóng gói là yếu tố quan trọng, vì các sản phẩm quà tặng phải chịu được va đập trong suốt quá trình vận chuyển đến tay người nhận mà không bị hư hỏng.

                                Ngoài các công việc đóng gói, nhân viên còn cần phải hỗ trợ trong việc vận chuyển các quà tặng đến các khu vực tổ chức sự kiện, đảm bảo các món quà được giao đúng nơi và đúng thời gian yêu cầu. Việc này đòi hỏi nhân viên có khả năng làm việc dưới áp lực, đặc biệt là trong các tình huống khẩn cấp, khi thời gian có thể bị giới hạn và công việc cần phải hoàn thành nhanh chóng.

                                Kỹ năng cần thiết cho công việc này bao gồm khả năng làm việc nhanh chóng và hiệu quả dưới sự giám sát, khả năng sử dụng các công cụ đóng gói như kéo, băng dính, giấy bọc, và các vật liệu khác một cách thành thạo. Ngoài ra, nhân viên cần có sự cẩn thận và tinh tế trong công việc, vì mỗi món quà tặng đều cần phải có sự hoàn thiện về mặt thẩm mỹ và chức năng. Nhân viên cũng cần có khả năng xử lý các tình huống bất ngờ như thiếu hụt vật liệu đóng gói hay quà tặng bị hư hỏng trong quá trình vận chuyển.

                                Các nhân viên đóng gói sẽ làm việc trong môi trường nhóm, nơi mà sự phối hợp giữa các thành viên là rất quan trọng. Nhân viên cần có khả năng làm việc độc lập và chủ động khi gặp phải các tình huống phát sinh. Để có thể hoàn thành công việc đúng tiến độ, nhân viên cần phải tổ chức công việc khoa học, phân chia thời gian hợp lý và đảm bảo rằng các công đoạn không bị gián đoạn. Công việc này sẽ đòi hỏi nhân viên có khả năng giữ bình tĩnh và làm việc hiệu quả dưới áp lực công việc cao.

                                Bên cạnh đó, nhân viên đóng gói cần phải tuân thủ các quy định và tiêu chuẩn về an toàn lao động, đặc biệt là khi làm việc với các vật liệu đóng gói có thể gây hại nếu không sử dụng đúng cách. Công ty tổ chức sự kiện sẽ cung cấp đầy đủ trang thiết bị bảo hộ lao động và đào tạo về các biện pháp an toàn khi làm việc với các vật liệu đóng gói.

                                Tóm lại, công việc này yêu cầu sự tỉ mỉ, cẩn thận và khả năng làm việc hiệu quả dưới sự giám sát chặt chẽ. Đây là cơ hội để bạn có thể tham gia vào một sự kiện lớn và học hỏi được nhiều kỹ năng quan trọng, đặc biệt là trong việc tổ chức sự kiện và đóng gói sản phẩm. Bạn sẽ được làm việc trong một môi trường năng động và đầy thử thách, nơi mà mỗi ngày đều mang lại những trải nghiệm mới và cơ hội phát triển nghề nghiệp. Nếu bạn là người chăm chỉ, cẩn thận và có khả năng làm việc dưới áp lực, công việc này sẽ là một cơ hội tuyệt vời cho bạn để phát triển bản thân và đóng góp vào sự thành công của sự kiện.</p> */}
                                <p><FileTextOutlined /> Description: <br />
                                    {jobGroupInfo?.description}
                                </p>
                                {/* Nút Thu gọn */}
                                <div className="show-more-less-btn">
                                    <button onClick={() => { setShowMore(false); window.scroll({ top: 0, left: 0, behavior: 'smooth' }); }}><UpOutlined /> Thu gọn</button>
                                </div>
                            </>
                        )}
                        {/* Nút Xem thêm (chỉ hiển thị khi showMore = false) */}
                        {!showMore && (
                            <div className="show-more-less-btn">
                                <button onClick={() => setShowMore(true)}><DownOutlined /> Xem thêm</button>
                            </div>
                        )}

                        <div className="start-end-btn">
                            <button className='start-btn'>Start</button>
                            <button className='end-btn'>End</button>
                        </div>
                    </div>
                )}

                <div className="job-postings-list">
                    <h1>Job Postings List</h1>
                    {isJPLoading ? (
                        <div>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </div>
                    ) :
                        /*jobPostings?*/listData.map((item) => (
                        <div className="job-postings-item"
                            key={item.id}
                            onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${jobGroupInfo.id}/employer-job-posting-detail/${item.id}`, { state: { jobPostingInfo: item, jobGroupInfo: jobGroupInfoTmp } }, window.scrollTo(0, 0))}
                            // onClick={() => navigate(`/employer/employer-job-groups/employer-job-group-detail/${jobGroupInfo?.id}/employer-job-posting-detail/${item.id}`, { state: item }, window.scrollTo(0, 0))}
                        >
                            <p className='job-postings-item-title'>{item.title}</p>
                            <div className='job-postings-item-info'>
                                <p><EnvironmentOutlined /> {item.location} &emsp; </p>
                                <p><DollarOutlined /> {item.salary.toLocaleString('vi-VN')} VND</p>
                            </div>
                            <button><ArrowRightOutlined /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmployerJobGroupDetail