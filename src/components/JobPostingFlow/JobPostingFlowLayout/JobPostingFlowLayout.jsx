import React, { useEffect, useState } from 'react'
import './JobPostingFlowLayout.css'
import { Breadcrumb, Button, message, Steps, theme } from 'antd'
import { BellOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CreatingNewJobGroup from './CreatingNewJobGroup/CreatingNewJobGroup';
import CreatingNewJobPostings from './CreatingNewJobPostings/CreatingNewJobPostings';
import ConfirmPosting from './ConfirmPosting/ConfirmPosting';
import dayjs from 'dayjs';

const JobPostingFlowLayout = () => {

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const [jobGroup, setJobGroup] = useState({
    jobGroupName: '',
    startDate: '',
    endDate: '',
    numberOfJobPostings: '',
    descriptionJobGroup: '',
  });

  const [checkErrorJobGroup, setCheckErrorJobGroup] = useState(false);


  // const [jobPostings, setJobPostings] = useState({
  //   jobPostingName: '',
  //   address: '',
  //   city: '',
  //   district: '',
  //   numberOfPeople: '',
  //   salary: '',
  //   rating: '',
  //   descriptionJobPosting: '',
  // })
  const [jobPostings, setJobPostings] = useState([]);
  const [checkErrorJobPostings, setCheckErrorJobPostings] = useState(false);

  // mấy cái comment là bỏ hết, vì khi bấm Next thì chưa nhập gì nó hiện hết lỗi của formik đã bắt ra
  // nhưng sau khi hết lỗi formik rồi thì ko thể bấm Next được nữa (còn không thì nó Next đc nhưng ko check lỗi formik gì luôn)
  // const [submitCreatingNewJobGroup, setSubmitCreatingNewJobGroup] = useState(null);
  // const [isValid, setIsValid] = useState(false); // Trạng thái kiểm tra lỗi

  const next = () => {
    // console.log("submitCreatingNewJobGroup: ", submitCreatingNewJobGroup);

    // if (submitCreatingNewJobGroup) {
    //   //submitCreatingNewJobGroup(); // Gọi formik.handleSubmit của CreatingNewJobGroup       
    //   setCurrent(current + 1);
    // }
    // if (submitCreatingNewJobGroup && isValid) {
    //   setCurrent(current + 1);
    // }
    // console.log(submitCreatingNewJobGroup);
    // setCurrent(current + 1);

    if (current === 0) {
      if (!jobGroup.jobGroupName || !jobGroup.startDate || !jobGroup.endDate /*|| !formattedStartDate || !formattedEndDate*/ || !jobGroup.numberOfJobPostings || !jobGroup.descriptionJobGroup) {
        message.error("Please fill in all information before going to the next step.");
        // giữ cho ko bị tắt để chỉnh css
        // message.error({
        //   content: 'Please fill in all information before going to the next step.',
        //   duration: 0, // Giữ thông báo hiển thị vô thời gian
        // });
        // return; // ko để return, nếu để thì ko check đc else if vì bị dừng r
      } else if (checkErrorJobGroup){
        message.error("Please correct the error before proceeding to the next step.");
      } else {
        console.log(jobGroup)
        setCurrent(current + 1);
        window.scrollTo(0, 0);
      }
    }

    if (current === 1) {
      // Kiểm tra tất cả các job postings trong mảng
      for (let i = 0; i < jobPostings.length; i++) {
        const posting = jobPostings[i];
        if (!posting.jobPostingName || !posting.address || !posting.city || parseInt(posting.city) === 0 || !posting.district || parseInt(posting.district) === 0 || !posting.ward || parseInt(posting.ward) === 0 || !posting.numberOfPeople || !posting.salary || !posting.rating || !posting.descriptionJobPosting) {
          message.error("Please fill in all information before going to the next step.", 0);
          return; // Dừng lại ở đây nếu có mục job posting thiếu dữ liệu
        } else if (checkErrorJobPostings){
          message.error("Please correct the error before proceeding to the next step.");
          return; // Dừng lại ở đây nếu dữ liệu jobPostings không hợp lệ
        }
        // else {
        //   setCurrent(current + 1);
        //   window.scrollTo(0, 0);
        // }
        // console.log(posting)
      }

      // Nếu tất cả job postings đều hợp lệ
      setCurrent(current + 1);
      window.scrollTo(0, 0);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    window.scrollTo(0, 0);
  };


  const steps = [
    {
      title: 'Create New Job Group',
      content:
        <CreatingNewJobGroup
          // onSubmit={(submit) => setSubmitCreatingNewJobGroup(() => submit)}
          jobGroup={jobGroup}
          setJobGroup={setJobGroup}
          setCheckErrorJobGroup={setCheckErrorJobGroup}
        />,
    },
    {
      title: 'Create New Job Postings',
      content:
        <CreatingNewJobPostings
          numberOfJobPostings={jobGroup.numberOfJobPostings}
          jobPostings={jobPostings}
          setJobPostings={setJobPostings}
          setCheckErrorJobPostings={setCheckErrorJobPostings}
        />,
    },
    {
      title: 'Confirm Posting',
      content:
        <ConfirmPosting
          jobGroupName={jobGroup.jobGroupName}
          startDate={dayjs(jobGroup.startDate).format('DD/MM/YYYY')}
          endDate={dayjs(jobGroup.endDate).format('DD/MM/YYYY')}
          jobPostings={jobPostings}
        />,
    },
  ]


  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    // lineHeight: '260px',
    // textAlign: 'center',
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };


  const handleDone = async () => {

    window.scrollTo(0, 350);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='job-posting-flow-layout-container'>

      <Breadcrumb className='breadcrumb'
        items={[
          {
            title: <Link
              to="/"
              className='b-title-1'
            >
              <HomeOutlined /> Home
            </Link>,
          },
          {
            title: <Link
              to="/job-posting-flow/posting-notifications"
              className='b-title-1'
            >
              <BellOutlined /> Notification
            </Link>,
          },
          {
            title: (
              <div className='b-title-2'>
                <FileTextOutlined /> job Group
              </div>
            ),
          },
        ]}
      />

      <div className="job-posting-flow-layout-content">
        <Steps current={current} items={items} direction={isMobile ? 'vertical' : 'horizontal'} />
        <div style={contentStyle}>{steps[current].content}</div>

        {/* div dành cho nút Next, Previous */}
        <div className='job-posting-flow-layout-btn'>

          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}/*onClick={handleDone} disabled={!selectedBoxId}*/>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobPostingFlowLayout