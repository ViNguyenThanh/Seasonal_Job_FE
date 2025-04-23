import React, { useState } from 'react'
import './ApplicationWorkerDetail.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, message, Modal, Rate } from 'antd';
import { ContainerOutlined, EnvironmentOutlined, ExclamationCircleOutlined, EyeOutlined, FileDoneOutlined, FolderOpenOutlined, GiftOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons';
import avatar from '/assets/Work-On-Computer.png'
import { updateApplicationStatus } from '../../../apis/application.request';

const ApplicationWorkerDetail = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const item = location.state // gồm thông tin của 1 jobGroup (jobGroupInfo) và thông tin của 1 worker (workerInfo)
  console.log(item)

  /* Hiển thị file pdf */
  const [previewVisible, setPreviewVisible] = useState(false); // hiển thị modal preview
  // const [cvFile, setCvFile] = useState(null); // lưu trữ file CV
  // Mô phỏng file CV mặc định
  // const defaultCvFile = new File([""], "defaultCV.pdf", { type: "application/pdf" });
  const defaultCvFileUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Freviewcongnghe.net%2Fhinh-nen-may-tinh-dep%2F&psig=AOvVaw30VWPW_bAo63KTJJAMvS9i&ust=1744266952200000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMim5vKqyowDFQAAAAAdAAAAABAE";


  // Hiển thị modal khi nhấn vào 'Preview CV'
  const showPreview = () => {
    // setCvFile(defaultCvFile); // Đặt file CV mặc định
    setPreviewVisible(true); // Hiển thị modal preview
  };

  // Đóng modal
  const closePreview = () => {
    setPreviewVisible(false);
  };

  /* Confirm Aprrove or Reject */
  const [confirmVisible, setConfirmVisible] = useState(false); // hiển thị modal xác nhận
  const [actionType, setActionType] = useState(""); // Lưu loại hành động (Approve hoặc Reject)
  const [confirmLoading, setConfirmLoading] = useState(false); // Xử lý loading khi bấm Yes

  const [isApproved, setIsApproved] = useState(false); // Đã phê duyệt
  const [isRejected, setIsRejected] = useState(false); // Đã từ chối

  // Mở modal xác nhận khi bấm Approve hoặc Reject
  const showConfirm = (action) => {
    setActionType(action); // Lưu loại hành động là Approve hoặc Reject
    setConfirmVisible(true); // Hiển thị modal xác nhận
  };

  // Xử lý xác nhận hành động (Approve hoặc Reject)
  const handleConfirm = async () => {
    setConfirmLoading(true); // Bắt đầu loading
    try {
      if (actionType === "approved") {
        await updateApplicationStatus(item.workerInfo.applicationId, "approved");
        setIsApproved(true);
        message.success("The application has been successfully approved.");
      } else if (actionType === "rejected") {
        await updateApplicationStatus(item.workerInfo.applicationId, "rejected");
        setIsRejected(true);
        message.success("The application has been successfully rejected.");
      }
      setConfirmVisible(false); // Đóng modal sau 2 giây
      setConfirmLoading(false); // Dừng loading
    } catch (error) {
      console.log(error);
      setConfirmVisible(false); // Đóng modal sau 2 giây
      setConfirmLoading(false); // Dừng loading
    }
    setTimeout(() => {
      setConfirmVisible(false); // Đóng modal sau 2 giây
      setConfirmLoading(false); // Dừng loading
    }, 2000);
  };

  // Đóng modal xác nhận
  const closeConfirm = () => {
    setConfirmVisible(false);
  };

  return (
    <div className='application-worker-detail-whole-container'>
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
            title:
              // ko xài Link vì khó truyền state
              (
                <div className='b-title-2 gray' onClick={() => navigate(`/employer/application/job-groups/${item.jobGroupInfo.id}`, { state: item.jobGroupInfo })}>
                  <ContainerOutlined />  {item.jobGroupInfo?.title}
                </div>
              )
          },
          {
            title: (
              <div className='b-title-2'>
                <SolutionOutlined /> {item.workerInfo?.workerName}
              </div>
            ),
          },
        ]}
      />

      <div className='application-worker-detail-container'>
        <div className="application-worker-detail-left">

          <div className="worker-identity">
            <img src={avatar} />
            <div className="worker-name-star">
              <p>{item.workerInfo?.workerName}</p>
              <div><Rate defaultValue={4} disabled /></div>
            </div>
          </div>

          <div className="preview-cv">
            <Button onClick={showPreview}><EyeOutlined />Preview CV</Button>

            <Modal
              title={<p className='modal-title'>Preview CV</p>}
              open={previewVisible}
              onCancel={closePreview}
              footer={null}
              width="80%"
            >
              {/* {cvFile ? (
                cvFile.type === "application/pdf" ? (
                  <embed
                    // src={URL.createObjectURL(cvFile)}
                    src={defaultCvFileUrl}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <img
                    alt="Preview"
                    // src={URL.createObjectURL(cvFile)}
                    // src={defaultCvFileUrl}
                    style={{ width: "100%" }}
                  />
                )
              ) : (
                <p>No CV available for preview.</p>
              )} */}
              <embed
                src={defaultCvFileUrl} // Đưa URL trực tiếp vào đây
                type="application/pdf"
                width="100%"
                height="500px"
              />
            </Modal>
          </div>
          <div className='worker-cover-letter'>
            <p><FileDoneOutlined /> Cover Letter: </p>
            <p>I am an energetic individual with experience in seasonal jobs such as sales,
              customer service support, and gift wrapping during holidays. I have also worked
              in production environments with high workloads and participated in event organization,
              assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure,
              and quickly adjust to job demands.</p>
          </div>
        </div>

        <div className="application-worker-detail-right">
          <h2>Worker Information</h2>
          <div className="worker-info">
            <p className='worker-email'><MailOutlined /> {item.workerInfo?.email}</p>
            <p><UserSwitchOutlined /> Female  </p> {/* -- None -- */}
          </div>
          <div className="worker-info">
            <p><EnvironmentOutlined /> Tỉnh Tây Ninh, Huyện Dương Minh Châu</p>
            <p><PhoneOutlined rotate={90} /> 0123456789 </p>
          </div>
          <div className="worker-info">
            <p><GiftOutlined /> 01/01/2000</p>
          </div>
          <div className='worker-description'>
            <p> <IdcardOutlined /> About me: </p>
            <p>I am an energetic individual with experience in seasonal jobs such as sales,
              customer service support, and gift wrapping during holidays. I have also worked
              in production environments with high workloads and participated in event organization,
              assisting with exhibitions and fairs. I am adaptable, work efficiently under pressure,
              and quickly adjust to job demands.</p>
              {/* <p>-- None --</p> */}
          </div>
        </div>

        <div className="approve-reject-btn" >
          {(item.workerInfo.status === 'submitted' || item.workerInfo.status === 'viewed') && !isApproved && !isRejected ? (
            <>
              <button className='approve-btn' onClick={() => showConfirm("approved")}>Approve</button>
              <button className='reject-btn' onClick={() => showConfirm("rejected")}>Reject</button>
            </>
          ) : (
            <button className={`disabled-btn ${item.workerInfo.status === 'approved' ? 'approved' : 'rejected'}`} disabled>
              {item.workerInfo.status === 'approved' ? 'Approved' : 'Rejected'}
            </button>
          )}

          <Modal
            title={<p className='confirm-title'> <ExclamationCircleOutlined /> Confirm</p>}
            open={confirmVisible}
            onCancel={closeConfirm}
            footer={[
              <Button key="no" onClick={closeConfirm} size='large'>No</Button>,
              <Button key="yes" type="primary" size='large' onClick={handleConfirm} loading={confirmLoading}>
                Yes
              </Button>
            ]}
          >
            <p className='confirm-content'>
              Are you sure you want to{' '}
              <span className={`confirm-type ${actionType === 'approved' ? 'approved' : 'rejected'}`}>
                {actionType === "approved" ? "APPROVE" : "REJECT"}
              </span>
              {' '}{item.workerInfo?.workerName}'s Application for the {item.jobGroupInfo?.title}? - {item.workerInfo?.jobPostingName}
            </p>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default ApplicationWorkerDetail