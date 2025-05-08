/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './EmployerHome.css'
import EmployerHeader from '../../components/EmployerHeader/EmployerHeader';
import Footer from '../../components/Footer/Footer'
import { CommentOutlined, PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Form, Image, Input, message, Modal, Upload } from 'antd';
import ShortTermHiring from '../../components/EmployerHome/ShortTermHiring/ShortTermHiring';
import WhyChooseUs from '../../components/EmployerHome/WhyChooseUs/WhyChooseUs';
import ServiceOverview from '../../components/EmployerHome/ServiceOverview/ServiceOverview';
import JobPostingProcess from '../../components/EmployerHome/RecruitmentFlow/JobPostingProcess';
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
        onSubmit: (values) => {
            setConfirmLoading(true);
            setTimeout(() => {
                message.success('Feedback submitted successfully!');
                // Xử lý khi bấm Submit
                setFileList([]);
                setConfirmLoading(false);
                setConfirmVisible(false);
                formik.resetForm();
            }, 2000);
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
                <ShortTermHiring/>
                <WhyChooseUs/>
                <ServiceOverview/>
                <JobPostingProcess/>
            </div>
            <Footer />
        </div>
    )
}

export default EmployerHome