/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './WorkerCV.css';
import { Button, message, Modal, Upload } from 'antd';
import { FilePdfOutlined, InboxOutlined, SaveOutlined } from '@ant-design/icons';
import { cvApi } from '../../../apis/cv.request'; // Import the cvApi for API calls
import { getToken } from '../../../utils/Token'; // Import token utility
const { Dragger } = Upload;
import { userApi } from '../../../apis/user.request'; // Import the userApi

const WorkerCV = () => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [previewVisible, setPreviewVisible] = useState(false); // State to control preview modal visibility
  const [previewUrl, setPreviewUrl] = useState(null); // For the uploaded CV preview
  const [defaultPreviewVisible, setDefaultPreviewVisible] = useState(false); // For the default CV modal visibility
  const [defaultPreviewUrl, setDefaultPreviewUrl] = useState(null); // For the default CV preview
  const [defaultCV, setDefaultCV] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentWorker, setCurrentWorker] = useState(null); // State to store current worker data

  // Handle file selection
  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      const file = info.file.originFileObj; // Get the selected file
      console.log("File selected:", file); // Log the file details
      setSelectedFile(file); // Store the file in state
      setPreviewUrl(URL.createObjectURL(file)); // Set preview URL for the uploaded CV
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

  useEffect(() => {
    const fetchCurrentWorker = async () => {
      const token = getToken();
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to get the user ID
        const userId = decodedToken.id;

        try {
          const response = await userApi.getUserById(userId); // Fetch the worker's data
          setCurrentWorker(response.data.data); // Store the worker's data in state
        } catch (error) {
          console.error("Error fetching current worker:", error);
        }
      }
    };

    fetchCurrentWorker();
  }, []);

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
      const cvId = uploadResponse.data.data; // Access the nested `data` property for the CV ID

      if (!cvId) {
        console.error("Upload response missing required fields:", uploadResponse);
        throw new Error("CV ID is missing in the upload response.");
      }

      // Fetch the uploaded CV details
      const userCVsResponse = await cvApi.getUserCVs(userId);
      const userCVs = userCVsResponse.data; // Ensure you access the correct array of CVs

      if (!Array.isArray(userCVs)) {
        throw new Error("Invalid response format: CVs data is not an array.");
      }

      const uploadedCV = userCVs.find((cv) => cv.id === cvId);

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

      // Clear the selected file after saving
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving CV as default:", error);
      message.error("Failed to save CV as default.");
    }
  };

  const handleDefaultPreview = async () => {
    try {
      // Fetch the file as a Blob
      const response = await fetch(defaultCV.url);
      const blob = await response.blob();

      // Force the Blob to be treated as a PDF
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(pdfBlob);

      setDefaultPreviewUrl(objectUrl); // Set the object URL for the default CV preview
      setDefaultPreviewVisible(true); // Open the modal
    } catch (error) {
      console.error("Error fetching the PDF:", error);
      message.error("Failed to load the CV for preview.");
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
            size="large"
            onClick={() => setPreviewVisible(true)} // Directly set previewVisible to true
          >
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
              src={previewUrl} // Use the preview URL for the uploaded CV
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
          <Button
            size="large"
            onClick={handleDefaultPreview} // Use a separate handler for the default CV preview
          >
            <FilePdfOutlined /> {`${currentWorker?.fullName}'s CV`}
          </Button>
          <Modal
            open={defaultPreviewVisible}
            title="Preview Default CV"
            footer={null}
            onCancel={() => {
              setDefaultPreviewVisible(false);
              setDefaultPreviewUrl(null); // Clean up the object URL for the default CV
            }}
            width="80%"
          >
            {defaultPreviewUrl && (
              <iframe
                src={defaultPreviewUrl} // Use the object URL for the default CV
                type="application/pdf"
                width="100%"
                height="500px"
                style={{ border: "none" }} // Remove iframe border
              />
            )}
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