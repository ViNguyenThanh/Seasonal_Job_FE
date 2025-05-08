import React, { useEffect, useState } from 'react'
import './WorkerRatings.css'
import avatar from '/assets/Work-On-Computer.png'
import { Empty, Pagination, Rate, Select } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { userApi } from '../../../apis/user.request'
import { reviewApi } from '../../../apis/review.request'
import { formatDate } from '../../../utils/formatDate'

const WorkerRatings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewApi.getReviews({
          userId: location.state
        })
        // console.log(res.data);
        if (res.data.data.length > 0) {
          const newReviews = await Promise.all(
            res.data.data.map(async (review) => {
              try {
                const userRes = await userApi.getUserById(review.reviewerId);
                const user = userRes.data.data;
                return {
                  id: review.id,
                  avatar: user.avatar,
                  employerName: user.companyName,
                  rating: review.rating,
                  date: formatDate(review.createdAt),
                  reason: review.reason
                };
              } catch (err) {
                console.error('Failed to fetch reviewer info for review:', review.id, err);
                return null;
              }
            })
          );

          setReviews(newReviews.filter(r => r !== null));
        }
        // setReviews(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchReviews()
  }, [])

  const workerRatingsData = [
    {
      id: 1,
      avatar: avatar,
      employerName: "Innovative Minds Co.",
      rating: 5,
      date: "05/09/2025",
      reason: "Bạn đã chứng minh được năng lực làm việc xuất sắc của mình trong các dự án gần đây. Khả năng tìm ra giải pháp sáng tạo và hiệu quả cho các vấn đề là điểm mạnh của bạn. Công ty luôn đánh giá cao sự làm việc của bạn."
    },
    {
      id: 2,
      // avatar: avatar,
      avatar: '',
      employerName: "Tech Builders Ltd.",
      rating: 2,
      date: "01/09/2025",
      reason: "Dù bạn có nhiều cố gắng, nhưng kết quả công việc vẫn chưa đạt được kỳ vọng. Chúng tôi thấy bạn cần cải thiện kỹ năng giao tiếp và sự chủ động trong công việc. Hy vọng bạn sẽ học hỏi và cải thiện những điểm yếu này trong tương lai."
    },
    {
      id: 3,
      avatar: avatar,
      employerName: "NextGen Technology",
      rating: 4,
      date: "28/08/2025",
      reason: "Khả năng sáng tạo và giải quyết vấn đề của bạn rất ấn tượng. Tuy nhiên, đôi khi bạn cần cải thiện thêm về kỹ năng làm việc nhóm và giao tiếp. Nếu bạn tập trung vào những lĩnh vực này, chúng tôi tin rằng bạn sẽ trở thành một thành viên xuất sắc."
    },
    {
      id: 4,
      avatar: avatar,
      employerName: "Digital Innovations Ltd.",
      rating: 3,
      date: "25/08/2025",
      reason: "Bạn đã thể hiện tinh thần làm việc nhóm khá tốt, nhưng vẫn cần cải thiện khả năng giải quyết vấn đề độc lập. Công việc của bạn đôi khi thiếu sáng tạo và chậm tiến độ. Hy vọng bạn sẽ nỗ lực hơn để nâng cao hiệu suất công việc."
    },
    {
      id: 5,
      avatar: avatar,
      employerName: "Prime Technology Solutions",
      rating: 4,
      date: "20/08/2025",
      reason: "Bạn có nhiều điểm mạnh trong công việc và thể hiện sự sáng tạo rất tốt. Tuy nhiên, có một vài vấn đề nhỏ về việc hoàn thành đúng hạn. Nếu bạn chú ý hơn đến việc quản lý thời gian, chúng tôi tin rằng bạn sẽ hoàn thành xuất sắc mọi dự án."
    },
    {
      id: 6,
      avatar: avatar,
      employerName: "Tech Masters Group",
      rating: 3,
      date: "18/08/2025",
      reason: "Khả năng giải quyết vấn đề của bạn rất tuyệt vời. Tuy nhiên, bạn có thể cải thiện kỹ năng làm việc dưới áp lực và đôi khi cần thêm sự chủ động. Chúng tôi tin rằng với một chút nỗ lực, bạn sẽ cải thiện được những điểm này."
    },
    {
      id: 7,
      avatar: avatar,
      employerName: "Smart Solutions Co.",
      rating: 2,
      date: "15/08/2025",
      reason: "Chúng tôi thấy bạn gặp khó khăn trong việc hoàn thành công việc đúng hạn và chất lượng mong đợi. Bạn cần cải thiện kỹ năng tổ chức và quản lý thời gian. Ngoài ra, sự chủ động trong công việc và giao tiếp với nhóm cần được nâng cao."
    },
    {
      id: 8,
      avatar: avatar,
      employerName: "Creative Minds Studios",
      rating: 4,
      date: "10/08/2025",
      reason: "Khả năng sáng tạo và kỹ năng giao tiếp của bạn rất ấn tượng. Tuy nhiên, đôi khi bạn chưa hoàn thành công việc đúng thời gian hoặc chất lượng chưa được như mong đợi. Nếu bạn tập trung hơn vào chi tiết và quản lý thời gian, công việc của bạn sẽ đạt chất lượng cao hơn."
    },
    {
      id: 9,
      avatar: avatar,
      employerName: "TechVision Solutions",
      rating: 4,
      date: "01/08/2025",
      reason: "Công việc của bạn luôn hoàn thành đúng hạn và chất lượng vượt xa mong đợi. Bạn có khả năng giải quyết vấn đề nhanh chóng và sáng tạo, và luôn thể hiện thái độ làm việc tích cực. Chúng tôi rất mong tiếp tục hợp tác với bạn."
    },
    {
      id: 10,
      avatar: avatar,
      employerName: "Global Tech Enterprise",
      rating: 5,
      date: "21/07/2025",
      reason: "Cảm ơn bạn vì đã luôn làm việc với sự tận tâm và chu đáo. Bạn luôn đóng góp những ý tưởng quý giá và đồng thời giúp đỡ đồng nghiệp trong mọi tình huống. Chúng tôi rất hài lòng với kết quả công việc của bạn."
    },
    {
      id: 11,
      avatar: avatar,
      employerName: "Tech Development Group",
      rating: 3,
      date: "17/07/2025",
      reason: "Sự chủ động và tinh thần cầu tiến của bạn là điểm mạnh lớn trong công việc. Bạn luôn có trách nhiệm với dự án và không ngại thử thách. Chúng tôi đặc biệt đánh giá cao sự sáng tạo và tư duy phản biện của bạn."
    },
    {
      id: 12,
      avatar: avatar,
      employerName: "Global Tech Innovations",
      rating: 2,
      date: "10/07/2025",
      reason: "Bạn chưa hoàn thành công việc đúng hạn và chưa đáp ứng kỳ vọng về chất lượng. Sự thiếu chủ động và khả năng giao tiếp cần được cải thiện. Chúng tôi hy vọng bạn sẽ nỗ lực để cải thiện những khía cạnh này trong tương lai."
    },
    {
      id: 13,
      avatar: avatar,
      employerName: "Future Horizons Enterprises",
      rating: 4,
      date: "30/06/2025",
      reason: "Bạn đã thể hiện sự sáng tạo tuyệt vời trong các dự án gần đây. Khả năng phân tích vấn đề và đưa ra giải pháp của bạn rất mạnh. Chúng tôi đặc biệt hài lòng với tinh thần học hỏi và cải tiến không ngừng của bạn. Bạn luôn hoàn thành công việc với chất lượng vượt ngoài mong đợi."
    },
    {
      id: 14,
      avatar: avatar,
      employerName: "Innovation Experts Consulting",
      rating: 3,
      date: "15/06/2025",
      reason: "Bạn đã đóng góp rất nhiều vào các dự án và cho thấy tinh thần làm việc nhóm mạnh mẽ. Bạn không ngừng học hỏi và cải thiện kỹ năng. Chúng tôi rất đánh giá cao sự cam kết của bạn đối với công ty và luôn hoàn thành công việc đúng tiến độ."
    },
    {
      id: 15,
      avatar: avatar,
      employerName: "Tech Solutions and Development Ltd.",
      rating: 5,
      date: "25/05/2025",
      reason: "Chúng tôi rất ấn tượng với khả năng sáng tạo và tư duy độc lập của bạn. Bạn không chỉ mang đến các giải pháp hiệu quả mà còn giúp đội ngũ tìm ra những hướng đi mới mẻ. Các kỹ năng kỹ thuật của bạn rất mạnh và luôn được áp dụng vào công việc một cách xuất sắc."
    },
    {
      id: 16,
      avatar: avatar,
      employerName: "Global Innovations and Technology Solutions Enterprises Inc",
      rating: 4,
      date: "22/05/2025",
      reason: "Chúng tôi rất hài lòng với hiệu suất làm việc của bạn. Bạn luôn đúng giờ, hoàn thành công việc đúng hạn và chất lượng vượt mong đợi. Khả năng giao tiếp tốt và tinh thần hợp tác cao giúp bạn nhanh chóng hòa nhập với đội nhóm. Ngoài ra, sự chủ động trong công việc và tinh thần cầu tiến của bạn đã góp phần không nhỏ vào thành công của dự án."
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

  const filteredRatings = /*workerRatingsData*/reviews.length === 0 ? [] : reviews.filter(item => {
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

  // const calculateAverageRating = () => {
  //   const totalRating = workerRatingsData.reduce((sum, item) => sum + item.rating, 0);
  //   return totalRating / workerRatingsData.length;
  // };

  return (
    <div className='worker-ratings-container'>
      <button
        className='go-back-btn'
        onClick={() => navigate('/worker/worker-profile', window.scrollTo(0, 0))}
      // onClick={() => {
      //   const averageRating = calculateAverageRating();
      //   navigate('/worker/worker-profile', { state: { averageRating } });
      //   window.scrollTo(0, 0);
      // }}
      >
        <ArrowLeftOutlined />
      </button>

      <h1>My Ratings</h1>

      {workerRatingsData.length === 0 ? (
        <div className="no-ratings">
          <Empty description="You do not have a rating yet!" />
        </div>
      ) : (
        <>
          <div className="worker-ratings-select">
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
            <div className="worker-ratings-list">
              {/*workerRatingsData*/ paginatedData.map((item) => (
                <div className="worker-ratings-item" key={item.id}>
                  <div className="employer-name-avatar">
                    {item.avatar ? (
                      <img src={item.avatar} />
                    ) : (
                      <p className='no-avatar'><UserOutlined /></p>
                    )}
                    <p>{item.employerName}</p>
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

export default WorkerRatings