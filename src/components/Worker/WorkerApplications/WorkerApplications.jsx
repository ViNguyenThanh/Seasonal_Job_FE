import React, { useEffect, useState } from 'react'
import './WorkerApplications.css'
import avatar from '/assets/Work-On-Computer.png'
import { DollarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Empty, Input, Pagination, Select, Skeleton } from 'antd';
import { getApplicationsByUserId } from '../../../apis/application.request';
const { Search } = Input;

const WorkerApplications = () => {
  const navigate = useNavigate();

  const listData = [
    {
      id: 1,
      title: "Nhân viên bán hàng",
      location: "Hồ Chí Minh, Quận 1",
      salary: 5000000,
      status: "approved",
      today: "13/5/2025"
    },
    {
      id: 2,
      title: "Kế toán viên",
      location: "Hà Nội, Cầu Giấy",
      salary: 7000000,
      status: "viewed",
      today: "12/5/2025"
    },
    {
      id: 3,
      title: "Lao động phổ thông",
      location: "Đà Nẵng, Hải Châu",
      salary: 200000,
      status: "viewed",
      today: "10/5/2025"
    },
    {
      id: 4,
      title: "Nhân viên thu ngân",
      location: "Bình Dương, Thủ Dầu Một",
      salary: 12000000,
      status: "submitted",
      today: "11/5/2025"
    },
    {
      id: 5,
      title: "Tạp vụ",
      location: "Hồ Chí Minh, Quận 3",
      salary: 4000000,
      status: "rejected",
      today: "13/5/2025"
    },
    {
      id: 6,
      title: "Bảo vệ",
      location: "Hà Nội, Hai Bà Trưng",
      salary: 6000000,
      status: "rejected",
      today: "12/5/2025"
    }
  ];

  const getStatusClass = (status) => {
    if (status === 'submitted') return 'submitted';
    if (status === 'viewed') return 'viewed';
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return '';
  };

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  };


  // chức năng Search Job Posting
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryValue, setSalaryValue] = useState(null);
  const [statusJobValue, setStatusJobValue] = useState(null);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
    setSalaryValue(null);
    setStatusJobValue(null);
    setCurrentPage(1);     // Reset to the first page
  };

  useEffect(() => {
    const fetchJobApplied = async () => {
      setLoading(true);
      const res = await getApplicationsByUserId()
      console.log(res);
      if (res.data.length > 0) {
        const sortedData = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const transformedApplications = sortedData.map(application => {
          return {
            id: application.JobPosting.id,
            image: application.JobPosting.User.avatar,
            title: application.JobPosting.title,  // Lấy title từ JobPosting
            location: application.JobPosting.location,  // Lấy location từ JobPosting
            salary: application.JobPosting.salary,  // Lấy salary từ JobPosting
            status: application.status,  // Trạng thái của ứng tuyển (ví dụ: completed)
          };
        });

        // Cập nhật lại state với dữ liệu mới
        setApplications(transformedApplications);
        setLoading(false);
      }
    }

    fetchJobApplied()
  }, [])

  const filteredJobs = /*listData*/ applications.length > 0 ? applications.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (!statusJobValue || item.status === statusJobValue) &&
      (!salaryValue || (item.salary >= salaryValue[0] && item.salary <= salaryValue[1])) &&
      (!searchTerm
        || item.title.toLowerCase().includes(searchTermLower)
        || item.location.toLowerCase().includes(searchTermLower)
        // || item.salary.toString().includes(searchTermLower)
      )
    );
  }) : [];

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*listData*/ filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className='worker-applications-container'>
      <h1>My Applications</h1>

      {/*listData*/(!loading && applications?.length === 0) ? (
        <div className="no-applications">
          {/* <p>You do not have an application yet! </p> */}
          <Empty description="You do not have an application yet!" />
        </div>
      ) : (
        <>
          <div className="worker-applications-search">
            <Search
              placeholder="Search Job Name, Address..."
              value={searchTerm} // Giữ từ tìm kiếm
              allowClear
              // enterButton="Search"
              enterButton
              size="large"
              onSearch={onSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              // showSearch
              placeholder="Salary"
              value={salaryValue ? JSON.stringify(salaryValue) : null}
              onChange={(value) => {
                if (value == null) {
                  // Nếu người dùng nhấn "clear", đặt giá trị về null
                  setSalaryValue(null);
                } else {
                  // Chuyển chuỗi JSON thành mảng
                  setSalaryValue(JSON.parse(value));
                }
                setCurrentPage(1);
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              allowClear
              options={[
                { value: JSON.stringify([0, 1999999]), label: 'Under 2 million VND' },
                { value: JSON.stringify([2000000, 5000000]), label: 'From 2 to 5 million VND' },
                { value: JSON.stringify([5000001, 10000000]), label: 'Over 5 to 10 million VND' },
                { value: JSON.stringify([10000001, Number.MAX_SAFE_INTEGER]), label: 'Over 10 million VND' }
              ]}
            >
              <Select.Option value="sample">Sample</Select.Option>
            </Select>
            <Select
              // showSearch
              placeholder="Status"
              value={statusJobValue}
              onChange={(value) => {
                setStatusJobValue(value);
                setCurrentPage(1);
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              allowClear
              options={[
                { value: 'submitted', label: 'Submitted' },
                { value: 'viewed', label: 'Viewed' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          </div>

          {loading ? <div className='worker-applications-skeleton-container'>
            <div className="worker-applications-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
            <div className="worker-applications-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
            <div className="worker-applications-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          </div> : filteredJobs.length === 0 ? (
            <div className="no-applications">
              <Empty description="No applications found!" />
            </div>
          ) : (
            <>
              {/*listData*/ paginatedData.map((item) => (
                <div className="worker-applications-item" key={item.id} onClick={() => navigate(`/job-detail-view/${item.id}`, { state: item }, window.scrollTo(0, 0))}>
                  <div className="worker-applications-item-left">
                    {item.image ? (
                      <img src={item.image} />
                    ) : (
                      <p className='no-avatar'><UserOutlined /></p>
                    )}
                    <div className="worker-applications-content">
                      <p className='worker-applications-item-title'>{item.title}</p>
                      <p className='worker-applications-item-info'>
                        <EnvironmentOutlined /> {item.location} &emsp;
                        <br className='break-line-info' />
                        <DollarOutlined /> {parseFloat(item.salary).toLocaleString('vi-VN')} VND &emsp;
                      </p>
                    </div>
                  </div>
                  <div className="worker-applications-item-right">
                    <p className={`${getStatusClass(item.status)}`}>{item.status}</p>
                  </div>
                </div>
              ))}
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredJobs.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                align="center"
                showLessItems
                showQuickJumper
              />
            </>
          )}
        </>
      )}

    </div>
  )
}

export default WorkerApplications