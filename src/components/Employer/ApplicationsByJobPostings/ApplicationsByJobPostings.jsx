import React, { useEffect, useState } from 'react'
import './ApplicationsByJobPostings.css'
import avatar from '/assets/Work-On-Computer.png'
import { Breadcrumb, Empty, Input, message, Pagination, Select, Tabs } from 'antd';
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

          // const filteredApplications = res.filter(item =>
          //   item.status === 'submitted' || item.status === 'viewed'
          // );

          return /*filteredApplications*/res.map(item => ({
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

  const [listWorkers, setListWorkers] = useState([
    { id: 1, workerName: 'Nguyễn Anh', email: 'nguyen.anh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc thời vụ trong kho, sắp xếp hàng hóa và kiểm tra sản phẩm', status: 'approved' },
    { id: 2, workerName: 'Trần Minh', email: 'tran.minh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng nhân viên hỗ trợ bán hàng, chăm sóc khách hàng trực tiếp và qua điện thoại', status: 'rejected' },
    { id: 3, workerName: 'Lê Thị Mai', email: 'le.thi.mai@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại cửa hàng, đóng gói sản phẩm và hỗ trợ khách hàng', status: 'submitted' },
    { id: 4, workerName: 'Phạm Thanh', email: 'pham.thanh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc tại xưởng sản xuất, gia công và đóng gói sản phẩm', status: 'viewed' },
    { id: 5, workerName: 'Hoàng Tú', email: 'hoang.tu@example.com', avatar: avatar, jobPostingName: 'Tuyển nhân viên phụ kho, hỗ trợ kiểm tra tồn kho và đóng gói hàng hóa theo yêu cầu', status: 'approved' },
    { id: 6, workerName: 'Nguyễn Minh Hoàng', email: 'nguyen.minh.hoang@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại nhà máy, kiểm tra chất lượng sản phẩm và hỗ trợ sản xuất', status: 'rejected' },
    { id: 7, workerName: 'Vũ Thị Lan', email: 'vu.lan@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc thời vụ trong kho, sắp xếp hàng hóa và kiểm tra sản phẩm', status: 'submitted' },
    { id: 8, workerName: 'Bùi Hoàng Anh', email: 'bui.hoanganh@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng nhân viên hỗ trợ bán hàng, chăm sóc khách hàng trực tiếp và qua điện thoại', status: 'approved' },
    { id: 9, workerName: 'Trương Thị Quỳnh Giang', email: 'truongthiquynhgiang@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại cửa hàng, đóng gói sản phẩm và hỗ trợ khách hàng', status: 'rejected' },
    { id: 10, workerName: 'Mai Đức Duy', email: 'mai.ducduy@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng công nhân làm việc tại xưởng sản xuất, gia công và đóng gói sản phẩm', status: 'approved' },
    { id: 11, workerName: 'Phan Thị Bình', email: 'phan.binh@example.com', avatar: avatar, jobPostingName: 'Tuyển nhân viên phụ kho, hỗ trợ kiểm tra tồn kho và đóng gói hàng hóa theo yêu cầu', status: 'viewed' },
    { id: 12, workerName: 'Nguyễn Thị Ngọc Thơ', email: 'nguyen.tho@example.com', avatar: avatar, jobPostingName: 'Cần tuyển nhân viên làm việc thời vụ tại cửa hàng, đóng gói sản phẩm và hỗ trợ khách hàng', status: 'viewed' },
    { id: 13, workerName: 'Huỳnh Đức Bo', email: 'huynh.bo@example.com', avatar: avatar, jobPostingName: 'Tuyển dụng nhân viên hỗ trợ bán hàng, chăm sóc khách hàng trực tiếp và qua điện thoại', status: 'viewed' },
  ]);


  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    window.scroll({ top: 200, left: 0, behavior: 'smooth' })
  };
  // chức năng Search Worker
  /*const [searchTerm, setSearchTerm] = useState('');
  const [jobPostingNameValue, setJobPostingNameValue] = useState(null);*/
  // set jobPostingNameValue mặc định hiện value đầu tiên 
  // const [jobPostingNameValue, setJobPostingNameValue] = useState(listWorkers[0].jobPostingName);
  const [searchTerms, setSearchTerms] = useState({ 1: '', 2: '', 3: '' });
  const [jobPostingNameValues, setJobPostingNameValues] = useState({ 1: null, 2: null, 3: null });

  const [currentTabKey, setCurrentTabKey] = useState('1'); // Quản lý tab hiện tại

  // hàm này chạy khi người dùng search nên ko thể bắt khi jobPostingName thay đổi thì searchTerm phải rỗng
  /*const onSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
    // Bỏ => khi search thì ko cần reset jobPostingName
    // setJobPostingNameValue(null)
    setCurrentPage(1);     // Reset to the first page
  };*/
  const onSearch = (value) => {
    setSearchTerms(prev => ({
      ...prev,
      [currentTabKey]: value.trim().toLowerCase(),
    }));
    setCurrentPage(1);
  };
  

  const filteredWorkers = /*listWorkers*/!isLoading && listApplications.length > 0 ? listApplications.filter(item => {
    // const searchTermLower = searchTerm.toLowerCase();
    const searchTermLower = (searchTerms[currentTabKey] || '').toLowerCase();
    const jobPostingNameValue = jobPostingNameValues[currentTabKey];

    let statusFilter = true;
    // Lọc theo tab hiện tại
    if (currentTabKey === '1') { // Pending
      statusFilter = item.status === 'submitted' || item.status === 'viewed';
    } else if (currentTabKey === '2') { // Approved
      statusFilter = item.status === 'approved';
    } else if (currentTabKey === '3') { // Rejected
      statusFilter = item.status === 'rejected';
    }

    return (
      statusFilter &&
      (!jobPostingNameValue || item.jobPostingName === jobPostingNameValue) &&
      // (!searchTerm
      (!searchTermLower
        || item.workerName.toLowerCase().includes(searchTermLower)
        || item.email.toLowerCase().includes(searchTermLower)
      )
    );
  }) : [];

  // dùng useEffect để khi giá trị của jobPostingNameValue thay đổi, reset searchTerm
  /*useEffect(() => {
    setSearchTerm('');
  }, [jobPostingNameValue]);*/
  useEffect(() => {
    // reset search khi chuyển tab
    setSearchTerms(prev => ({ ...prev, [currentTabKey]: '' }));
  }, [jobPostingNameValues[currentTabKey]]);


  // Lọc các jobPostingName duy nhất
  const uniqueJobPostingNames = [...new Set(/*listWorkers*/listApplications.map(worker => worker.jobPostingName))];

  // Phân trang dữ liệu (cắt dữ liệu theo trang)
  const paginatedData = /*listWorkers*/ filteredWorkers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Hàm này dùng để thay đổi trạng thái của Tab
  const handleTabChange = (key) => {
    setCurrentTabKey(key);
    setCurrentPage(1); // Reset page to first when tab changes
  };

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
        <Tabs
          activeKey={currentTabKey}
          onChange={handleTabChange}
          defaultActiveKey="1"
          type="card"
          items={[
            {
              label: 'Pending',
              key: '1',
              children: (
                <div className="workers-list">
                  {/* <button
                    className='go-back-btn'
                    onClick={() => navigate('/employer/application/job-groups', window.scrollTo(0, 0))}>
                    <ArrowLeftOutlined />
                  </button> */}
                  <h1 className='pending'>Pending <br /> Applications</h1>

                  {/*listWorkers.*/listApplications?.length === 0 ? (
                    <div className="no-applications">
                      <Empty description="You currently have no pending applications" />
                    </div>
                  ) : (
                    <>
                      <div className="workers-list-search">
                        <Select
                          showSearch
                          placeholder="Job Posting Name"
                          // value={jobPostingNameValue}
                          value={jobPostingNameValues[currentTabKey]}
                          onChange={(value) => {
                            // setJobPostingNameValue(value);
                            setJobPostingNameValues(prev => ({ ...prev, [currentTabKey]: value }));
                            setCurrentPage(1);
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          size="large"
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
                          // value={searchTerm} // Giữ từ tìm kiếm
                          value={searchTerms[currentTabKey]}
                          allowClear
                          enterButton
                          size="large"
                          onSearch={onSearch}
                          // onChange={(e) => setSearchTerm(e.target.value)}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, [currentTabKey]: e.target.value }))}
                        />
                      </div>

                      {filteredWorkers.length === 0 ? (
                        <div className="no-applications">
                          <Empty description="No pending applications found!" />
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
                            showLessItems
                            showQuickJumper
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              ),
            },
            {
              label: 'Approved',
              key: '2',
              children: (
                <div className="workers-list">
                  <h1 className='approved'>Approved <br /> Applications</h1>

                  {/*listWorkers.*/listApplications?.length === 0 ? (
                    <div className="no-applications">
                      <Empty description="You currently have no approved applications" />
                    </div>
                  ) : (
                    <>
                      <div className="workers-list-search">
                        <Select
                          showSearch
                          placeholder="Job Posting Name"
                          value={jobPostingNameValues[currentTabKey]}
                          onChange={(value) => {
                            setJobPostingNameValues(prev => ({ ...prev, [currentTabKey]: value }));
                            setCurrentPage(1);
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          size="large"
                          options={uniqueJobPostingNames.map(jobPostingName => ({
                            value: jobPostingName,
                            label: jobPostingName,
                          }))}
                          allowClear
                        />
                        <Search
                          placeholder="Search Worker Name or Email..."
                          value={searchTerms[currentTabKey]} // Giữ từ tìm kiếm
                          allowClear
                          enterButton
                          size="large"
                          onSearch={onSearch}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, [currentTabKey]: e.target.value }))}
                        />
                      </div>

                      {filteredWorkers.length === 0 ? (
                        <div className="no-applications">
                          <Empty description="No approved applications found!" />
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
                            showLessItems
                            showQuickJumper
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              ),
            },
            {
              label: 'Rejected',
              key: '3',
              children: (
                <div className="workers-list">
                  <h1 className='rejected'>Rejected <br /> Applications</h1>

                  {/*listWorkers.*/listApplications?.length === 0 ? (
                    <div className="no-applications">
                      <Empty description="You currently have no rejected applications" />
                    </div>
                  ) : (
                    <>
                      <div className="workers-list-search">
                        <Select
                          showSearch
                          placeholder="Job Posting Name"
                          value={jobPostingNameValues[currentTabKey]}
                          onChange={(value) => {
                            setJobPostingNameValues(prev => ({ ...prev, [currentTabKey]: value }));
                            setCurrentPage(1);
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          size="large"
                          options={uniqueJobPostingNames.map(jobPostingName => ({
                            value: jobPostingName,
                            label: jobPostingName,
                          }))}
                          allowClear
                        />
                        <Search
                          placeholder="Search Worker Name or Email..."
                          value={searchTerms[currentTabKey]} // Giữ từ tìm kiếm
                          allowClear
                          enterButton
                          size="large"
                          onSearch={onSearch}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, [currentTabKey]: e.target.value }))}
                        />
                      </div>

                      {filteredWorkers.length === 0 ? (
                        <div className="no-applications">
                          <Empty description="No rejected applications found!" />
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
                            showLessItems
                            showQuickJumper
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
    </div>
  )
}

export default ApplicationsByJobPostings