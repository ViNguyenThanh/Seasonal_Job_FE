import React from 'react';
import { SearchOutlined, BankOutlined, UploadOutlined } from '@ant-design/icons';
import './Platform.css';

const Platform = () => {
    return (
        <div className="platform-container">
            <div className="platform-title">
                <h2 className="platform-header">Connecting Job Opportunities <br /> A Stepping Stone for Your Career!</h2>
                <p className="platform-subheader">Are you looking for your dream job or an ideal work environment? Join our platform – where talented candidates connect with top companies quickly and efficiently!</p>
            </div>
            <div className="platform-list-card">
                <div className="platform-card">
                    <div className="platform-card-icon"><SearchOutlined /></div>
                    <div className="platform-card-header">Easy Job Search</div>
                    <div className="platform-card-content">Browse thousands of job listings from reputable companies that match your skills and career goals.</div>
                </div>
                <div className="platform-card">
                    <div className="platform-card-icon"><BankOutlined /></div>
                    <div className="platform-card-header">Explore Employers</div>
                    <div className="platform-card-content">Get detailed insights into companies, their work culture, and employee reviews before applying.</div>
                </div>
                <div className="platform-card">
                    <div className="platform-card-icon"><UploadOutlined /></div>
                    <div className="platform-card-header">Quick CV Submission</div>
                    <div className="platform-card-content">With just a few clicks, you can submit your resume to employers and increase your chances of getting an interview!

</div>
                </div>
            </div>
        </div>
    );
};

export default Platform;
