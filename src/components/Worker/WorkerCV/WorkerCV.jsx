import React, { useState } from 'react'
import './WorkerCV.css'
import { Button, message, Modal, Upload } from 'antd';
import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

const WorkerCV = () => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [previewVisible, setPreviewVisible] = useState(false); // State to control preview modal visibility

  // Handle file selection
  const handleUpload = (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj; // Get the selected file
      console.log("File selected:", file); // Log the file details
      setSelectedFile(file); // Store the file in state
      message.success(`${info.file.name} file is ready to upload.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const props = {
    name: "file",
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("Only PDF files are allowed!");
      }
      return isPdf || Upload.LIST_IGNORE; // Ngăn file không hợp lệ vào danh sách
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok"); // Simulate success for Ant Design's Upload component
      }, 0);
    },
    onChange: handleUpload, // Use the custom handler
    showUploadList: false, // Ẩn danh sách file
  };

  return (
    <div className='worker-cv-container'>
      <h1>My CV</h1>

      <p className='instruction-cv-text'>Please upload your CV in PDF format only below to utilize it throughout your application process.</p>

      {selectedFile && (
        <div className="worker-cv-preview">
          <Button
            // type="link"
            // style={{ color: "#1890ff", textDecoration: "underline" }}
            size='large'
            onClick={() => setPreviewVisible(true)}
          >
            <FilePdfOutlined />{selectedFile.name}
          </Button>
          <Modal
            open={previewVisible}
            title="Preview CV"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width="80%"
          >
            {selectedFile.type === "application/pdf" ? (
              <embed
                src={URL.createObjectURL(selectedFile)}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            ) : (
              <img
                alt="Preview"
                src={URL.createObjectURL(selectedFile)}
                style={{ width: "100%" }}
              />
            )}
          </Modal>
        </div>
      )}

      <div className="worker-cv-dragger">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Upload your CV in PDF format only. Do not upload images, Word files, or any other formats.
          </p>
        </Dragger>
      </div>


    </div>
  )
}

export default WorkerCV