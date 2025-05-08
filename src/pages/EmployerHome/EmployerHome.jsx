/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './EmployerHome.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader';
import Footer from '../../components/Footer/Footer'
// import { Typography, Button, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
import { CommentOutlined, PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { Button, Form, Image, Input, message, Modal, Upload } from 'antd'
import { Typography, Button, Row, Col, Form, Image, Input, message, Modal, Upload } from 'antd';
import { getToken } from '../../utils/Token';
import { complaintApi } from '../../apis/complaint.request';
const { TextArea } = Input;


const EmployerHome = () => {

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // Mở modal
    const showConfirmModal = () => {
        setConfirmVisible(true);
    };

    // Đóng modal
    const closeConfirm = () => {
        setConfirmVisible(false);
        setPreviewImage('');
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            image: [],
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
                .required("* Required"),
            description: Yup.string()
                .test("no-leading-space", "* No spaces at the beginning", value => !/^\s/.test(value || ""))
                .required("* Required"),
        }),
        onSubmit: async (values) => {
            setConfirmLoading(true);
            try {
                const token = getToken();
                if (!token) {
                    message.error('Please log in to submit feedback.');
                    setFileList([]);
                    setConfirmLoading(false);
                    setConfirmVisible(false);
                    formik.resetForm();
                    return
                }
                const formData = new FormData();
                formData.append("type", values.title);
                formData.append("description", values.description);
                fileList.forEach((file) => {
                    formData.append("images", file.originFileObj);
                });

                const res = await complaintApi.createComplaint(formData);
                // console.log(res);

                message.success('Feedback submitted successfully!');
                // Xử lý khi bấm Submit
                setFileList([]);
                setConfirmLoading(false);
                setConfirmVisible(false);
                formik.resetForm();
            } catch (error) {
                console.log(error);
                setFileList([]);
                message.error('Failed to submit feedback.');
                setConfirmLoading(false);
                setConfirmVisible(false);
                formik.resetForm();
            }
        },
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div className='employer-home-whole-container'>
            <EmployerHeader />

            <button className="employer-home-feedback-btn" onClick={showConfirmModal}>
                <CommentOutlined /> Feedback
            </button>

            <Modal
                title="Submit Feedback"
                open={confirmVisible}
                onCancel={closeConfirm}
                footer={null}
            >
                <form onSubmit={formik.handleSubmit} className="employer-home-feedback-form">
                    <div className="employer-home-feedback-field">
                        <p><span>*</span> Title: </p>
                        <Form.Item
                            validateStatus={formik.errors.title && formik.touched.title ? "error" : ""}
                            help={formik.errors.title && formik.touched.title ? formik.errors.title : ""}
                        >
                            <Input
                                className='input'
                                placeholder="Input title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Item>
                    </div>
                    <div className="employer-home-feedback-field">
                        <p>Images: </p>
                        <Upload
                            action="https://your-upload-api-endpoint"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/'); // Kiểm tra xem file có phải là ảnh không
                                if (!isImage) {
                                    message.error('You can only upload image files!');
                                    return Upload.LIST_IGNORE;
                                }
                                return false; // Nếu không phải ảnh, sẽ không cho upload
                            }}
                        >
                            {fileList.length < 5 ?
                                <Button style={{ border: 0, background: 'none' }} icon={<PlusOutlined />}>
                                    Upload
                                </Button>
                                : null}
                        </Upload>
                        <div className="uploaded-images">
                            {fileList.length > 0 && fileList.map((file) => (
                                <Image
                                    key={file.uid}
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="employer-home-feedback-field">
                        <p><span>*</span> Description: </p>
                        <Form.Item
                            validateStatus={formik.errors.description && formik.touched.description ? "error" : ""}
                            help={formik.errors.description && formik.touched.description ? formik.errors.description : ""}
                        >
                            <TextArea
                                className='input'
                                placeholder="Input your description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ height: 120, resize: 'none' }}
                            />
                        </Form.Item>
                    </div>
                    <div className="submit-btn">
                        <Button
                            type="primary"
                            onClick={formik.handleSubmit}
                            // htmlType="submit"
                            loading={confirmLoading}
                            size='large'
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal>

            <div className="employer-home-container">

                <div className="employer-home-first-section">
                    <div>
                        <Title level={1} style={{ color: '#023b5f', fontSize: '60px', fontWeight: 'bold' }}>
                            Hire Short-Term<br></br>Workers
                        </Title>
                        <Paragraph style={{ fontSize: '25px' }}>
                            Find qualified candidates for temporary <br></br> and seasonal positions with ease.<br></br>
                            Our platform connects you with workers<br></br> quickly and efficiently, helping you meet<br></br> your staffing needs without the hassle.
                        </Paragraph>
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                type="primary"
                                size="large"
                                style={{ width: '200px', height: '55px', fontSize: '25px', fontWeight: '500', padding: '10px 20px' }}
                            >
                                Post a Job
                            </Button>
                        </div>
                    </div>
                    <div>
                        <img
                            className="employer-home-image1"
                            src="../assets/Work-On-Computer.png"
                        />
                    </div>
                </div>

                <div className="employer-home-second-section">
                    <div style={{ marginLeft: '6em' }}>
                        <Title level={1} style={{ color: '#023b5f', fontSize: '50px', fontWeight: '700' }}>
                            Lý do lựa chọn SJCP
                        </Title>
                        <Paragraph style={{ fontSize: '25px' }}>
                            Các lợi ích khi sử dụng trang web
                        </Paragraph>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-13em' }}>
                        <div className="employer-home-reason-container">
                            <Row gutter={[16, 16]} justify="center">
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image2"
                                            src="../assets/laptop.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600', margin: 0 }}>
                                            Giao diện <br></br>dễ sử dụng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image3"
                                            src="../assets/customer-service.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Hỗ trợ <br></br>nhanh chóng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image4"
                                            src="../assets/shield.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Đảm bảo <br></br>chất lượng
                                        </Paragraph>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12} lg={12}>
                                    <div className="employer-home-reason-content">
                                        <img
                                            className="employer-home-image5"
                                            src="../assets/flexible.png"
                                        />
                                        <Paragraph style={{ fontSize: '25px', fontWeight: '600' }}>
                                            Linh hoạt <br></br>và tiện lợi
                                        </Paragraph>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <img
                                className="employer-home-image6"
                                src="../assets/Introducing-Man.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '2000px' }}></div>
            <Footer />
        </div>
    )
}

export default EmployerHome