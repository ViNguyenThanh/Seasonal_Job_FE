import React, { useEffect, useState } from 'react'
import './ApplicationJobGroups.css'
import { ArrowRightOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Empty, Input, Pagination, Select, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobGroupsByUserId } from '../../../redux/actions/jobgroups.action';
const { Search } = Input;

const ApplicationJobGroups = () => {
  const jobGroups = [
    { id: 1, title: 'Tổ Chức Và Giám Sát Công Tác Chuẩn Bị Cho Sự Kiện Triển Lãm Sản Phẩm Tiêu Dùng Tại Các Trung Tâm Thương Mại.', numberOfJobPostings: 5, status: 'inactive', startDate: '07/04/2025', endDate: '24/04/2025' },
    { id: 2, title: 'Tổ Chức Và Giám Sát Công Tác Chuẩn Bị Cho Sự Kiện Triển Lãm Nghệ Thuật.', numberOfJobPostings: 7, status: 'active', startDate: '03/05/2025', endDate: '13/05/2025' },
    { id: 3, title: 'Tổ Chức Các Chuyến Tham Quan Cho Khách Tham Dự Hội Nghị Quốc Tế Về Nghiên Cứu Môi Trường.', numberOfJobPostings: 8, status: 'inactive', startDate: '04/05/2025', endDate: '14/05/2025' },
    { id: 4, title: 'Hỗ Trợ Việc Setup Âm Thanh, Ánh Sáng Và Thiết Bị Cho Các Sự Kiện Văn Hóa, Sự Kiện Lễ Hội.', numberOfJobPostings: 6, status: 'active', startDate: '05/05/2025', endDate: '15/05/2025' },
    { id: 5, title: 'Quản Lý Các Công Việc Hậu Cần Cho Các Sự Kiện Thể Thao, Đảm Bảo An Ninh Và Vận Chuyển Hàng Hóa.', numberOfJobPostings: 1, status: 'completed', startDate: '06/05/2025', endDate: '16/05/2025' },
    { id: 6, title: 'Giám Sát Công Tác Phục Vụ Các Bữa Ăn Và Sự Kiện Hội Nghị Cho Các Khách Tham Gia.', numberOfJobPostings: 2, status: 'inactive', startDate: '07/05/2025', endDate: '17/05/2025' },
    { id: 7, title: 'Quản Lý Các Công Việc Hậu Cần Cho Các Sự Kiện Giáo Dục Và Đào Tạo Tại Trường Học.', numberOfJobPostings: 6, status: 'inactive', startDate: '08/05/2025', endDate: '18/05/2025' },
    { id: 8, title: 'Cung Cấp Dịch Vụ Phục Vụ Tiệc Và Đảm Bảo Vệ Sinh Trong Các Sự Kiện Tiệc Cưới Và Tiệc Lớn.', numberOfJobPostings: 9, status: 'active', startDate: '09/05/2025', endDate: '19/05/2025' },
    { id: 9, title: 'Phụ Trách Vận Hành Dịch Vụ Vận Chuyển Hành Lý Cho Các Sự Kiện Hội Nghị Quốc Tế Tại Các Khách Sạn.', numberOfJobPostings: 3, status: 'active', startDate: '10/05/2025', endDate: '20/05/2025' },
    { id: 10, title: 'Tổ Chức Và Giám Sát Công Tác Chuẩn Bị Cho Sự Kiện Triển Lãm Sản Phẩm Tiêu Dùng Tại Các Trung Tâm Thương Mại.', numberOfJobPostings: 1, status: 'inactive', startDate: '11/05/2025', endDate: '21/05/2025' },
    { id: 11, title: 'Cung Cấp Dịch Vụ Phục Vụ Tiệc Và Đảm Bảo Vệ Sinh Trong Các Sự Kiện Tiệc Cưới Và Tiệc Lớn.', numberOfJobPostings: 7, status: 'completed', startDate: '12/05/2025', endDate: '22/05/2025' },
    { id: 12, title: 'Giám Sát Công Tác Phục Vụ Các Bữa Ăn Và Sự Kiện Hội Nghị Cho Các Khách Tham Gia.', numberOfJobPostings: 3, status: 'completed', startDate: '13/05/2025', endDate: '23/05/2025' },
    { id: 13, title: 'Quản Lý Tài Liệu Và Giúp Đỡ Nhân Viên Trong Việc Phân Phối Thông Tin Về Sự Kiện Văn Hóa.', numberOfJobPostings: 6, status: 'completed', startDate: '14/05/2025', endDate: '24/05/2025' },
    { id: 14, title: 'Chạy Và Giám Sát Các Công Tác Chuẩn Bị, Cài Đặt Thiết Bị Cho Sự Kiện Triển Lãm Nghệ Thuật.', numberOfJobPostings: 3, status: 'completed', startDate: '15/05/2025', endDate: '25/05/2025' },
    { id: 15, title: 'Cung Cấp Dịch Vụ Phục Vụ Tiệc Và Đảm Bảo Vệ Sinh Trong Các Sự Kiện Tiệc Cưới Và Tiệc Lớn.', numberOfJobPostings: 10, status: 'completed', startDate: '16/05/2025', endDate: '26/05/2025' }
  ];

  const getStatusClass = (status) => {
    if (status === 'active') return 'active';
    if (status === 'completed') return 'completed';
    if (status === 'inactive') return 'inactive';
    return '';
  };

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 12; // Mỗi trang hiển thị 12 dòng
  const dispatch = useDispatch();
  const { isLoading, error, payload } = useSelector(state => state.jobGroupsReducer);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    window.scroll({ top: 100, left: 0, behavior: 'smooth' })
  };

  useEffect(() => {
    dispatch(getAllJobGroupsByUserId());
  }, [dispatch]);


  // chức năng Search Job Posting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusJobGroupValue, setStatusJobGroupValue] = useState(null);
  const onSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
    setStatusJobGroupValue(null);
    setCurrentPage(1);     // Reset to the first page
  };

  const filteredJobGroups = /*jobGroups*/ !isLoading && payload?.length > 0 ? payload.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (!statusJobGroupValue || item.status === statusJobGroupValue) &&
      (!searchTerm
        || item.title.toLowerCase().includes(searchTermLower)
      ) &&
      item.isPaid === true
    );
  }) : [];

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*listData*/ filteredJobGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const navigate = useNavigate()

  return (
    <div className='application-job-groups-container'>

      {payload?.length === 0 ? (
        <div className="no-job-groups">
          <Empty description="You do not have a job group yet!" />;
        </div>
      ) : (
        <>
          <h1>Applications Management</h1>
          <p className='application-job-groups-title'><FolderOpenOutlined /> Total number of <br /> Job Groups posted: <span>{!isLoading && payload?.length > 0 && payload?.filter(item => item.isPaid === true).length}</span></p>

          <div className="application-job-groups-search">
            <Search
              placeholder="Search Job Group Name..."
              value={searchTerm} // Giữ từ tìm kiếm
              allowClear
              enterButton
              size="large"
              onSearch={onSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              showSearch
              placeholder="Status"
              value={statusJobGroupValue}
              onChange={(value) => {
                setStatusJobGroupValue(value);
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

          {isLoading ? (
            <div className="application-job-groups-list-skeleton">
              <Skeleton paragraph={{ rows: 3 }} />
              <Skeleton paragraph={{ rows: 3 }} />
              <Skeleton paragraph={{ rows: 3 }} />
            </div>
          ) : filteredJobGroups.length === 0 ? (
            <div className="no-job-groups">
              <Empty description="No job groups found!" />;
            </div>
          ) : (
            <>
              <div className="application-job-groups-list">
                {/*jobGroups*/ paginatedData.map((group) => (
                  <div className="application-job-groups-item" key={group.id} onClick={() => navigate(`/employer/application/job-groups/${group.id}`, { state: group }, window.scrollTo(0, 0))}>
                    <p className='job-group-name'>{group.title}</p>
                    <p className='number-of-job-postings'>Number of Job Postings: {group.totalJobPostings}</p>
                    <p className={`status ${getStatusClass(group.status)}`}>{group.status}</p>
                    <div style={{ display: 'none' }}>
                      {group.startDate}
                      {group.endDate}
                    </div>
                    <button><ArrowRightOutlined /></button>
                  </div>
                ))}
              </div>

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredJobGroups.length}
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

export default ApplicationJobGroups