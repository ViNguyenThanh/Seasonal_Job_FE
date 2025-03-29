import React, { useEffect, useState } from 'react'
import './JobPostingFlowLayout.css'
import { Breadcrumb, Button, message, Steps, theme } from 'antd'
import { BellOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CreatingNewJobGroup from './CreatingNewJobGroup/CreatingNewJobGroup';
import CreatingNewJobPostings from './CreatingNewJobPostings/CreatingNewJobPostings';


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

    if (!jobGroup.jobGroupName || !jobGroup.startDate || !jobGroup.endDate || !jobGroup.numberOfJobPostings || !jobGroup.descriptionJobGroup) {
      // alert("Please input all required information")
      message.error("Please fix the errors before proceeding.");
    }
    else {
      setCurrent(current + 1);
      window.scrollTo(0, 0);
    }


    // if (submitCreatingNewJobGroup && isValid) {
    //   setCurrent(current + 1);
    // }
    // console.log(submitCreatingNewJobGroup);
    // setCurrent(current + 1);
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
        />,
    },
    {
      title: 'Create New Job Postings',
      content:
        <CreatingNewJobPostings
        // setNextEnabled={setNextEnabled}
        // selectedId={selectedThemeId}
        // setSelectedId={setSelectedThemeId} 
        />,
    },
    {
      title: 'haha',
      content: <div>hihi</div>
      // <CreatingNewJobGroup
      // setNextEnabled={setNextEnabled}
      // selectedId={selectedThemeId}
      // setSelectedId={setSelectedThemeId} 
      // />,
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
        <Steps current={current} items={items} direction={isMobile ? 'vertical' : 'horizontal'}/>
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