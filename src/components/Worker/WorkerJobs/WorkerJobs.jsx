import React, { useEffect, useState } from 'react'
import './WorkerJobs.css'
import avatar from '/assets/Work-On-Computer.png'
import { DollarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Empty, Input, Pagination, Select, Skeleton } from 'antd';
import { getApplicationsByUserId } from '../../../apis/application.request';
import { formatDate } from '../../../utils/formatDate';
const { Search } = Input;

const WorkerJobs = () => {

  const navigate = useNavigate();

  const listData = [
    {
      id: 1,
      title: "Nhân viên bán hàng",
      location: "Hồ Chí Minh, Quận 1",
      salary: 5000000,
      status: "completed",
      today: "13/5/2025"
    },
    {
      id: 2,
      title: "Kế toán viên",
      location: "Hà Nội, Cầu Giấy",
      salary: 7000000,
      status: "active",
      today: "12/5/2025"
    },
    {
      id: 3,
      title: "Lao động phổ thông",
      location: "Đà Nẵng, Hải Châu",
      salary: 200000,
      status: "active",
      today: "10/5/2025"
    },
    {
      id: 4,
      title: "Nhân viên thu ngân",
      location: "Bình Dương, Thủ Dầu Một",
      salary: 12000000,
      status: "inactive",
      today: "11/5/2025"
    },
    {
      id: 5,
      title: "Tạp vụ",
      location: "Hồ Chí Minh, Quận 3",
      salary: 4000000,
      status: "inactive",
      today: "13/5/2025"
    },
    {
      id: 6,
      title: "Bảo vệ",
      location: "Hà Nội, Hai Bà Trưng",
      salary: 6000000,
      status: "inactive",
      today: "12/5/2025"
    }
  ];

  const getStatusClass = (status) => {
    if (status === 'active') return 'active';
    if (status === 'completed') return 'completed';
    if (status === 'inactive') return 'inactive';
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


  //Giá trị cho listData
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
      // console.log(res);
      if (res.data.length > 0) {
        const sortedData = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const transformedApplications = res.data.map(application => {
          return {
            id: application.JobPosting.id,
            image: application.JobPosting.User.avatar,
            title: application.JobPosting.title,  // Lấy title từ JobPosting
            location: application.JobPosting.location,  // Lấy location từ JobPosting
            salary: application.JobPosting.salary,  // Lấy salary từ JobPosting
            status: application.JobPosting.JobGroup.status,  // Trạng thái của ứng tuyển (ví dụ: completed)
            today: application.JobPosting.JobGroup.updatedAt  // Lấy ngày hôm nay, định dạng "dd/mm/yyyy"
          };
        });
        // console.log(transformedApplications);

        const sortedApplications = transformedApplications.sort((a, b) => new Date(b.today) - new Date(a.today));
        // Cập nhật lại state với dữ liệu mới
        setApplications(sortedApplications);
        setLoading(false);
      }
    }

    fetchJobApplied()
  }, [])

  const filteredJobs = /*listData*/applications.length > 0 ? applications.filter(item => {
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
    <div className='worker-jobs-container'>
      <h1>My Jobs</h1>

      {/*listData*/(!loading && applications?.length === 0) ? (
        <div className="no-jobs">
          {/* <p>You do not have a job yet! </p> */}
          <Empty description="You do not have a job yet!" />
        </div>
      ) : (
        <>
          <div className="worker-jobs-search">
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
                { value: 'completed', label: 'Completed' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>

          {loading ? <div className='my-jobs-skeleton-container'>
            <div className="my-jobs-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
            <div className="my-jobs-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
            <div className="my-jobs-skeleton">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          </div> : filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <Empty description="No jobs found!" />
            </div>
          ) : (
            <>
              {/*listData*/ paginatedData.map((item) => (
                <div className="worker-jobs-item" key={item.id} onClick={() => navigate(`/worker/worker-jobs/worker-job-detail/${item.id}`, { state: item }, window.scrollTo(0, 0))}>
                  <div className="worker-jobs-item-left">
                    {/* <img src={item.image ? item.image : avatar} /> */}
                    {item.image ? (
                      <img src={item.image} />
                    ) : (
                      <p className='no-avatar'><UserOutlined /></p>
                    )}
                    <div className="worker-jobs-content">
                      <p className='worker-jobs-item-title'>{item.title}</p>
                      <p className='worker-jobs-item-info'>
                        <EnvironmentOutlined /> {item.location} &emsp;
                        <br className='break-line-info' />
                        <DollarOutlined /> {parseFloat(item.salary).toLocaleString('vi-VN')} VND &emsp;
                      </p>
                    </div>
                  </div>
                  <div className="worker-jobs-item-right">
                    <p><span className={`${getStatusClass(item.status)}`}>{item.status}</span> <br className='break-line-status' /> (Updated {formatDate(item.today)})</p>
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

export default WorkerJobs