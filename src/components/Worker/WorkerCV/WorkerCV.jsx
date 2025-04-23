import React, { useState, useEffect } from 'react';
import './WorkerCV.css';
import { Button, message, Modal, Upload } from 'antd';
import { FilePdfOutlined, InboxOutlined, SaveOutlined } from '@ant-design/icons';
import { cvApi } from '../../../apis/cv.request'; // Import the cvApi for API calls
import { getToken } from '../../../utils/Token'; // Import token utility
const { Dragger } = Upload;

const WorkerCV = () => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [previewVisible, setPreviewVisible] = useState(false); // State to control preview modal visibility
  const [previewUrl, setPreviewUrl] = useState(null);
  const [defaultCV, setDefaultCV] = useState(null);
  const [userId, setUserId] = useState(null);

  // Handle file selection
  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      const file = info.file.originFileObj; // Get the selected file
      console.log("File selected:", file); // Log the file details
      setSelectedFile(file); // Store the file in state
      setPreviewUrl(URL.createObjectURL(file));
      message.success(`${info.file.name} file is ready to upload.`);
    } else if (info.file.status === 'error') {
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

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.id);
    }

    const fetchDefaultCV = async () => {
      if (!userId) return;

      try {
        const response = await cvApi.getUserCVs(userId);
        const cvs = response.data;
        if (Array.isArray(cvs)) {
          const defaultCV = cvs.find((cv) => cv.status === "Default");
          if (defaultCV) {
            setDefaultCV({
              id: defaultCV.id,
              name: defaultCV.filename,
              url: defaultCV.file_Url,
            });
          } else {
            setDefaultCV(null);
          }
        }
      } catch (error) {
        console.error("Error fetching default CV:", error);
      }
    };

    fetchDefaultCV();
  }, [userId]);

  const handleSave = async () => {
    if (!selectedFile || !userId) {
      message.error("Please select a file and ensure you are logged in.");
      return;
    }

    try {
      // Upload the selected CV file
      const uploadResponse = await cvApi.uploadCV(selectedFile);

      // Debugging log to inspect the response
      console.log("Upload response:", uploadResponse);

      // Extract the CV ID from the response
      const cvId = uploadResponse.data; // Assuming the backend returns the ID in `data`

      if (!cvId) {
        console.error("Upload response missing required fields:", uploadResponse);
        throw new Error("CV ID is missing in the upload response.");
      }

      // Fetch the uploaded CV details
      const userCVs = await cvApi.getUserCVs(userId);
      const uploadedCV = userCVs.data.find((cv) => cv.id === cvId);

      if (!uploadedCV) {
        throw new Error("Uploaded CV details could not be retrieved.");
      }

      // Set the uploaded CV as the default CV
      await cvApi.setDefaultCV(userId, cvId);
      message.success("CV has been set as default successfully.");

      // Update the default CV state
      setDefaultCV({
        id: cvId,
        name: uploadedCV.filename,
        url: uploadedCV.file_Url,
      });

      // Update the preview URL to the uploaded file's URL
      setPreviewUrl(uploadedCV.file_Url);

      // Clear the selected file after saving
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving CV as default:", error);
      message.error("Failed to save CV as default.");
    }
  };

  const handlePreview = async (cvId) => {
    try {
      // Fetch the preview URL from the API
      const response = await cvApi.previewCV(cvId);
      setPreviewUrl(response.file_Url); // Assuming the API returns `file_Url` in the response
      setPreviewVisible(true);
    } catch (error) {
      console.error("Error previewing CV:", error);
      message.error("Failed to preview CV.");
    }
  };

  return (
    <div className='worker-cv-container'>
      <h1>My CV</h1>

      <p className='instruction-cv-text'>Please upload your CV in PDF format only below to utilize it throughout your application process.</p>

      {selectedFile && (
        <div className="worker-cv-preview">
          <h3>Preview your new CV:</h3>
          <Button
            // type="link"
            // style={{ color: "#1890ff", textDecoration: "underline" }}
            size='large'
            onClick={() => handlePreview(previewUrl)}>

            <FilePdfOutlined /> {selectedFile.name}
          </Button>
          <Modal
            open={previewVisible}
            title="Preview CV"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width="80%"
          >
            <embed
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          </Modal>
        </div>
      )}

      <h3>Your current default CV:</h3>
      {defaultCV ? (
        <div className="worker-cv-default">
          <Button size="large" onClick={() => handlePreview(defaultCV.id)}>
            <FilePdfOutlined /> {defaultCV.name}
          </Button>
          <Modal
            open={previewVisible}
            title="Preview Default CV"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width="80%"
          >
            <embed
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          </Modal>
        </div>
      ) : (
        <p>No default CV available</p>
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button type="primary" size="large" disabled={!selectedFile} onClick={handleSave}>
          <SaveOutlined /> Save
        </Button>
      </div>
    </div>
  );
};

export default WorkerCV;