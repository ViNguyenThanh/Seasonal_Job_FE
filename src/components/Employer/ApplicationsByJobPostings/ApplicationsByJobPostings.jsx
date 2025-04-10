import React, { useEffect, useState } from 'react'
import './ApplicationsByJobPostings.css'
import avatar from '/assets/Work-On-Computer.png'
import { Breadcrumb, Empty, Input, message, Pagination, Select } from 'antd';
const { Search } = Input;
import { ArrowLeftOutlined, ArrowRightOutlined, ContainerOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobPostingByJGId } from '../../../redux/actions/jobposting.action';
import { getApplicationsForJob, updateApplicationStatus } from '../../../apis/application.request';


const ApplicationsByJobPostings = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const jobGroupInfo = location.state
  const [listApplications, setListApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isLoading: isJPLoading, payload } = useSelector(state => state.jobPostingReducer)
  // console.log(jobGroupInfo)

  useEffect(() => {
    dispatch(getJobPostingByJGId(jobGroupInfo.id))
  }, [dispatch])

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const newList = await Promise.all(payload.map(async (jobPosting) => {
          const res = await getApplicationsForJob(jobPosting.id);
          console.log(res);

          const filteredApplications = res.filter(item => 
            item.status === 'submitted' || item.status === 'viewed'
          );
          
          return filteredApplications.map(item => ({
            id: item.CV.User.id,
            applicationId: item.id,
            workerName: item.CV.User.fullName,
            email: item.CV.User.email,
            avatar: avatar,
            jobPostingName: item.jobPostingId === jobPosting.id ? jobPosting.title : '',
            status: item.status
          }));
        }));

        setIsLoading(false);
        setListApplications(newList.flat());
        console.log(newList.flat()); // Hiển thị kết quả đã xử lý
      } catch (error) {
        console.log(error);
        // message.error(error.data.message);
      }
    };

    fetchApplications();
  }, [payload])

  const listWorkers = [
    { id: 1, workerName: 'Nguyễn Anh', email: 'nguyen.anh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc thời vụ trong kho, sắp xếp hàng hóa và kiểm tra sản phẩm' },
    { id: 2, workerName: 'Trần Minh', email: 'tran.minh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng nhân viên hỗ trợ bán hàng, chăm sóc khách hàng trực tiếp và qua điện thoại' },
    { id: 3, workerName: 'Lê Thị Mai', email: 'le.thi.mai@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại cửa hàng, đóng gói sản phẩm và hỗ trợ khách hàng' },
    { id: 4, workerName: 'Phạm Thanh', email: 'pham.thanh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc tại xưởng sản xuất, gia công và đóng gói sản phẩm' },
    { id: 5, workerName: 'Hoàng Tú', email: 'hoang.tu@example.com', avatar: avatar, jobPostingName: 'Tuyển nhân viên phụ kho, hỗ trợ kiểm tra tồn kho và đóng gói hàng hóa theo yêu cầu' },
    { id: 6, workerName: 'Nguyễn Minh Hoàng', email: 'nguyen.minh.hoang@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại nhà máy, kiểm tra chất lượng sản phẩm và hỗ trợ sản xuất' },
    { id: 7, workerName: 'Vũ Thị Lan', email: 'vu.lan@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc thời vụ trong kho, sắp xếp hàng hóa và kiểm tra sản phẩm' },
    { id: 8, workerName: 'Bùi Hoàng Anh', email: 'bui.hoanganh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng nhân viên hỗ trợ bán hàng, chăm sóc khách hàng trực tiếp và qua điện thoại' },
    { id: 9, workerName: 'Trương Thị Quỳnh Giang', email: 'truongthiquynhgiang@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại cửa hàng, đóng gói sản phẩm và hỗ trợ khách hàng' },
    { id: 10, workerName: 'Mai Đức Duy', email: 'mai.ducduy@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc tại xưởng sản xuất, gia công và đóng gói sản phẩm' },
    { id: 11, workerName: 'Phan Thị Bình', email: 'phan.binh@example.com', avatar: avatar, jobPostingName: 'Tuyển nhân viên phụ kho, hỗ trợ kiểm tra tồn kho và đóng gói hàng hóa theo yêu cầu' }
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
  const [jobPostingNameValue, setJobPostingNameValue] = useState(null);
  // set jobPostingNameValue mặc định hiện value đầu tiên 
  // const [jobPostingNameValue, setJobPostingNameValue] = useState(listWorkers[0].jobPostingName);

  // hàm này chạy khi người dùng search nên ko thể bắt khi jobPostingName thay đổi thì searchTerm phải rỗng
  const onSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
    // Bỏ => khi search thì ko cần reset jobPostingName
    // setJobPostingNameValue(null)
    setCurrentPage(1);     // Reset to the first page
  };

  const filteredWorkers = /*listWorkers*/!isLoading && listApplications.length > 0 ? listApplications.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();

    return (
      (!jobPostingNameValue || item.jobPostingName === jobPostingNameValue) &&
      (!searchTerm
        || item.workerName.toLowerCase().includes(searchTermLower)
        || item.email.toLowerCase().includes(searchTermLower)
      )
    );
  }) : [];

  // dùng useEffect để khi giá trị của jobPostingNameValue thay đổi, reset searchTerm
  useEffect(() => {
    setSearchTerm('');
  }, [jobPostingNameValue]);

  // Lọc các jobPostingName duy nhất
  const uniqueJobPostingNames = [...new Set(/*listWorkers*/listApplications.map(worker => worker.jobPostingName))];

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*listWorkers*/ filteredWorkers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleUpdateStatus = async (applicationId) => {
    try {
      await updateApplicationStatus(applicationId, "viewed");
      // message.success('Status updated successfully.');
    } catch (error) {
      // message.error('Failed to update status.');
    }
  }

  return (
    <div className="applications-by-job-postings-whole-container">
      <Breadcrumb className='breadcrumb'
        items={[
          {
            title: <Link
              to="/employer/application/job-groups"
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
      <div className="applications-by-job-postings-container">
        {/* <button
        className='go-back-btn'
        onClick={() => navigate('/employer/application/job-groups', window.scrollTo(0, 0))}>
        <ArrowLeftOutlined />
      </button> */}
        <div className="workers-list">
          <h1>Pending <br /> Applications</h1>

          {listWorkers.length === 0 ? (
            <div className="no-applications">
              <Empty description="You currently have no applications" />
            </div>
          ) : (
            <>
              <div className="workers-list-search">
                <Select
                  showSearch
                  placeholder="Job Posting Name"
                  value={jobPostingNameValue}
                  onChange={(value) => {
                    setJobPostingNameValue(value);
                    setCurrentPage(1);
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  size="large"
                  // allowClear
                  // options={listWorkers.map(worker => ({
                  //   value: worker.jobPostingName,
                  //   label: worker.jobPostingName,
                  // }))}
                  options={uniqueJobPostingNames.map(jobPostingName => ({
                    value: jobPostingName,
                    label: jobPostingName,
                  }))}
                  allowClear
                />
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
                <div className="no-applications">
                  <Empty description="No applications found!" />
                </div>
              ) : (
                <>
                  {/*listWorkers*/ paginatedData.map((worker) => (
                    <div className="worker-item" key={worker.id} onClick={() => {
                      if (worker.status === "submitted") {
                        handleUpdateStatus(worker.applicationId)
                      }
                      navigate(`/employer/application/job-groups/${jobGroupInfo.id}/${worker.id}`, { state: { workerInfo: worker, jobGroupInfo: jobGroupInfo } }, window.scrollTo(0, 0))
                    }}>
                      <div className="worker-avatar">
                        <img src={worker.avatar} />
                      </div>
                      <div className="worker-info">
                        <p className='job-posting-name'>{worker.jobPostingName}</p>
                        <p className='worker-name'>{worker.workerName}</p>
                        <p className='worker-email'>{worker.email}</p>
                      </div>
                      <div style={{ display: 'none' }}>
                        {worker.jobPostingName}
                      </div>
                      <div className="next-page-btn">
                        <button><ArrowRightOutlined /></button>
                      </div>
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
    </div>
  )
}

export default ApplicationsByJobPostings