import React, { useState } from 'react'
import './EmployerRatings.css'
import avatar from '/assets/Work-On-Computer.png'
import { Empty, Pagination, Rate, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';

const EmployerRatings = () => {
  const navigate = useNavigate()

  const employerRatingsData = [
    {
      id: 1,
      avatar: '',
      workerName: "Nguyễn Minh Tuấn",
      rating: 5,
      date: "05/09/2025",
      reason: "Môi trường làm việc tại công ty rất chuyên nghiệp và thân thiện. Các dự án đều rõ ràng và được hỗ trợ tốt, tôi rất hài lòng với sự hợp tác này."
    },
    {
      id: 2,
      avatar: avatar,
      workerName: "Trần Thị Lan Anh",
      rating: 2,
      date: "01/09/2025",
      reason: "Mặc dù tôi cố gắng hết sức, nhưng công ty không cung cấp đủ nguồn lực và hướng dẫn để tôi hoàn thành công việc đúng hạn. Tôi mong muốn sự hỗ trợ nhiều hơn từ phía công ty."
    },
    {
      id: 3,
      avatar: avatar,
      workerName: "Lê Hoàng Duy",
      rating: 4,
      date: "28/08/2025",
      reason: "Công ty rất chuyên nghiệp và có môi trường làm việc sáng tạo, tuy nhiên, tôi hy vọng có thể nhận được phản hồi nhanh hơn từ quản lý để cải thiện hiệu suất công việc."
    },
    {
      id: 4,
      avatar: '',
      workerName: "Phan Thị Quỳnh",
      rating: 3,
      date: "25/08/2025",
      reason: "Công ty có nhiều cơ hội phát triển, nhưng tôi nghĩ rằng có thể cải thiện hơn nữa về sự phối hợp giữa các bộ phận để công việc hiệu quả hơn."
    },
    {
      id: 5,
      avatar: avatar,
      workerName: "Võ Văn Khánh",
      rating: 4,
      date: "20/08/2025",
      reason: "Công ty luôn cung cấp công cụ và tài nguyên đầy đủ để tôi hoàn thành công việc, tuy nhiên, có thể có thêm thời gian cho các dự án dài hạn để đảm bảo chất lượng."
    },
    {
      id: 6,
      avatar: '',
      workerName: "Nguyễn Thị Mai",
      rating: 3,
      date: "18/08/2025",
      reason: "Mặc dù công ty tạo ra một môi trường làm việc sáng tạo, nhưng tôi nghĩ rằng việc quản lý công việc và áp lực công việc có thể được cải thiện thêm."
    },
    {
      id: 7,
      avatar: avatar,
      workerName: "Trương Thị Lan",
      rating: 2,
      date: "15/08/2025",
      reason: "Tôi cảm thấy rằng công ty không cung cấp đủ hỗ trợ trong quá trình làm việc, đặc biệt là khi gặp khó khăn về kỹ thuật. Cần cải thiện sự giao tiếp và hướng dẫn."
    },
    {
      id: 8,
      avatar: '',
      workerName: "Bùi Minh Trí",
      rating: 4,
      date: "10/08/2025",
      reason: "Công ty tạo ra môi trường làm việc thân thiện, nhưng tôi cảm thấy đôi khi có sự thiếu hụt trong việc phân bổ công việc rõ ràng và minh bạch hơn."
    },
    {
      id: 9,
      avatar: avatar,
      workerName: "Nguyễn Thành Nam",
      rating: 4,
      date: "01/08/2025",
      reason: "Môi trường làm việc tại công ty rất năng động và đầy thử thách. Tôi cảm thấy được hỗ trợ và tin tưởng trong quá trình hợp tác, dù đôi khi tiến độ công việc chưa hoàn hảo."
    },
    {
      id: 10,
      avatar: '',
      workerName: "Trần Quang Huy",
      rating: 5,
      date: "21/07/2025",
      reason: "Công ty luôn hỗ trợ và tạo điều kiện tốt nhất cho nhân viên. Các dự án được giao rõ ràng, công ty tạo cơ hội phát triển nghề nghiệp. Tôi rất hài lòng với sự hợp tác này."
    },
    {
      id: 11,
      avatar: avatar,
      workerName: "Nguyễn Lê Minh",
      rating: 3,
      date: "17/07/2025",
      reason: "Công ty đã tạo ra môi trường làm việc tốt, nhưng cần cải thiện trong việc cung cấp các phản hồi rõ ràng và chi tiết để giúp tôi phát triển nghề nghiệp nhanh hơn."
    },
    {
      id: 12,
      avatar: '',
      workerName: "Vũ Quang Vinh",
      rating: 2,
      date: "10/07/2025",
      reason: "Công ty không đưa ra những chỉ dẫn và hỗ trợ kịp thời khi tôi gặp khó khăn trong công việc. Điều này ảnh hưởng đến chất lượng và hiệu quả công việc của tôi."
    },
    {
      id: 13,
      avatar: avatar,
      workerName: "Phạm Minh Thảo",
      rating: 4,
      date: "30/06/2025",
      reason: "Công ty cung cấp rất nhiều cơ hội phát triển và sáng tạo, nhưng có thể cải thiện về việc giao tiếp giữa các bộ phận để các dự án dễ dàng hơn."
    },
    {
      id: 14,
      avatar: '',
      workerName: "Đặng Hoàng Anh",
      rating: 3,
      date: "15/06/2025",
      reason: "Mặc dù công ty tạo ra một môi trường làm việc tích cực, nhưng đôi khi việc phân công công việc có thể chưa rõ ràng và kịp thời, dẫn đến việc xử lý công việc bị chậm."
    },
    {
      id: 15,
      avatar: avatar,
      workerName: "Nguyễn Minh Đức",
      rating: 5,
      date: "25/05/2025",
      reason: "Công ty luôn khuyến khích sáng tạo và tư duy độc lập. Tôi cảm thấy rất thoải mái khi làm việc ở đây và luôn nhận được sự hỗ trợ cần thiết để hoàn thành tốt công việc."
    },
    {
      id: 16,
      avatar: '',
      workerName: "Hoàng Thành Công",
      rating: 4,
      date: "22/05/2025",
      reason: "Công ty có môi trường làm việc rất tích cực và luôn đúng hạn trong việc cung cấp phản hồi. Tuy nhiên, tôi hy vọng sẽ có thêm cơ hội để tham gia vào các dự án lớn hơn."
    }
];


  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 5; // Mỗi trang hiển thị 5 dòng

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo(0, 0);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  };

  // Lọc theo rating
  const [ratingValue, setRatingValue] = useState(null);

  const filteredRatings = employerRatingsData.filter(item => {
    return !ratingValue || item.rating === ratingValue;
  });

  const [dateFilter, setDateFilter] = useState(null);
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`); // Chuyển thành định dạng YYYY-MM-DD
  };

  const sortedRatings = filteredRatings.sort((a, b) => {
    const dateA = convertToDate(a.date);
    const dateB = convertToDate(b.date);

    if (dateFilter === "newest") {
      return dateB - dateA; // Sắp xếp từ mới đến cũ
    } else if (dateFilter === "oldest") {
      return dateA - dateB; // Sắp xếp từ cũ đến mới
    }
    return 0;
  });

  const paginatedData = /*filteredRatings.*/sortedRatings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className='employer-ratings-container'>
      <button
        className='go-back-btn'
        onClick={() => navigate('/employer/employer-profile', window.scrollTo(0, 0))}
      >
        <ArrowLeftOutlined />
      </button>

      <h1>My Ratings</h1>

      {employerRatingsData.length === 0 ? (
        <div className="no-ratings">
          <Empty description="You do not have a rating yet!" />
        </div>
      ) : (
        <>
          <div className="employer-ratings-select">
            <Select
              className="filter-rating"
              // showSearch
              placeholder="Filter by Rating"
              value={ratingValue}
              onChange={(value) => {
                setRatingValue(value);
                setCurrentPage(1); // Reset to the first page when rating filter changes
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              allowClear
              options={[
                { value: 5, label: '5 🌟' },
                { value: 4, label: '4 🌟' },
                { value: 3, label: '3 🌟' },
                { value: 2, label: '2 🌟' },
                { value: 1, label: '1 🌟' }
              ]}
            />

            <Select
              placeholder="Filter by Date"
              value={dateFilter || 'newest'}
              onChange={(value) => {
                setDateFilter(value);
                setCurrentPage(1); // Reset to the first page when date filter changes
              }}
              size="large"
              // allowClear
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' }
              ]}
            />
          </div>
          {filteredRatings.length === 0 ? (
            <div className="no-ratings">
              <Empty description="No ratings found!" />
            </div>
          ) : (
            <div className="employer-ratings-list">
              {/*employerRatingsData*/ paginatedData.map((item) => (
                <div className="employer-ratings-item" key={item.id}>
                  <div className="employer-name-avatar">
                    {item.avatar ? (
                      <img src={item.avatar} />
                    ) : (
                      <p className='no-avatar'><UserOutlined /></p>
                    )}
                    <p>{item.workerName}</p>
                  </div>
                  <div className="employer-rating-date">
                    <div><Rate defaultValue={item.rating} disabled /></div>
                    <p>{item.date}</p>
                  </div>
                  <p className='employer-reason'>
                    {item.reason}
                  </p>
                </div>
              ))}

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredRatings.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                align="center"
                showLessItems
                showQuickJumper
              />
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default EmployerRatings