/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Rate } from 'antd'
import { DownOutlined, EnvironmentOutlined, DollarOutlined, FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import './CompanySpotlight.css'
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../apis/user.request';

const data = [
  {
    title: '',
    location: '',
    salary: '',
    duration: '',
    description: '',
    imgSrc: ''
  }
];

export default function CompanySpotlight() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Thêm sự kiện resize để theo dõi thay đổi kích thước màn hình
    window.addEventListener('resize', handleResize);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch companies and then fetch user details for each company ID
    userApi.getUserCompanies()
      .then(companiesResponse => {
        console.log('Companies Spotlight:', companiesResponse.data);
        const companiesData = companiesResponse.data.data;

        // Fetch user details for each company and update the avatar and description
        if (Array.isArray(companiesData) && companiesData.length > 0) {
          const updatedCompanies = companiesData.map(company => {
            return userApi.getPublicUserById(company.id)
              .then(userResponse => {
                console.log(`User Details Company Spotlight for Company ID ${company.id}:`, userResponse.data);
                return {
                  ...company,
                  description: userResponse.data.data.description, // Add description
                  avatar: userResponse.data.data.avatar // Add avatar
                };
              })
              .catch(error => {
                console.error(`Error fetching user details for Company ID ${company.id}:`, error);
                return company; // Return the original company if there's an error
              });
          });

          // Wait for all promises to resolve and update the state
          Promise.all(updatedCompanies).then(resolvedCompanies => {
            setCompanies(resolvedCompanies);
          });
        } else {
          setCompanies(companiesData); // Set companies if no additional user details are fetched
        }
      })
      .catch(error => {
        console.error('Error fetching companies:', error);
      });
  }, []);

  return (
    <div className='company-spotlight-container'>
      <div className="companies-spotlight-info">
        <div className="companies-spotlight-header">
          <p>Companies <span>Spotlight</span></p>
        </div>
        <div className="companies-spotlight-content">
          <div className="companies-spotlight-items">
            {companies.map((company, index) => (
              index === 8 && screenWidth < 1170 ? null : (
                <div
                  key={index}
                  className="company-list-spotlight"
                  onClick={() => {
                    navigate(`/company-detail/${company.id}`)
                    window.scrollTo({ top: 0 });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="company-list-spotlight-img">
                    {/* <img src={company.avatar || "/assets/background_colour.jpg"} alt={company.companyName || "Company"} /> */}
                    {company.avatar  ? (
                      <img src={company.avatar } />
                    ) : (
                      <p className='no-avatar'><UserOutlined /></p>
                    )}
                  </div>
                  <div className="company-list-spotlight-info">
                    <h3>{company.companyName}</h3>
                    <div className='company-list-spotlight-info-location'>
                      <ConfigProvider
                        theme={{
                          components: {
                            Rate: {
                              starSize: 10,
                              starBg: '#B0B7BD',
                            },
                          },
                          token: {
                            marginXS: 3
                          }
                        }}
                      >
                        <Rate style={{ height: 'fit-content', marginTop: '10px' }} disabled defaultValue={company.avgRating || 0} />
                      </ConfigProvider>
                      {/* <p><FileSearchOutlined /> {company.jobs || "0 jobs"}</p> */}            
                      <p>
                        <EnvironmentOutlined /> {company.address ? company.address.split(',')[0] : "Location not available"}
                      </p>
                    </div>
                    {/* <p>
                      {company.description
                        ? new DOMParser().parseFromString(company.description, 'text/html').body.textContent
                        : 'Loading...'}
                    </p> */}
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="companies-spotlight-btn">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBorderColor: 'var(--btn-primary-color)',
                    defaultColor: 'var(--btn-primary-color)',
                    defaultHoverBg: 'var(--btn-primary-color)',
                    defaultHoverColor: 'white',
                  }
                },
                token: { fontSize: 20 }
              }}
            >
              <Button
                icon={<DownOutlined />}
                size='large'
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  navigate('/finding-company');
                }}
              >
                View All
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
