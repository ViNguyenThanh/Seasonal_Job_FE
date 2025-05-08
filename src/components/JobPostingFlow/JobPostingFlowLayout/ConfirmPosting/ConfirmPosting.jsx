import React, { useEffect, useState } from 'react'
import './ConfirmPosting.css'
import { Rate } from 'antd'
import { ScheduleOutlined } from '@ant-design/icons';
import { serviceApi } from '../../../../apis/service.request';
import { getUserFromToken } from '../../../../utils/Token';


const ConfirmPosting = ({ jobGroupName, startDate, endDate, jobPostings }) => {
  const [isService, setIsService] = useState(false);

  const jobPostingsTemporaryData = [
    {
      id: 1,
      name: 'Clean the floor',
      address: '15 đường Cách Mạng Tháng 8, phường 4, quận 1, TP.HCM',
      rating: 2,
      workers: 5,
      salary: 700000,
      totalSalary: 3500000,
    },
    {
      id: 2,
      name: 'Clean the floor',
      address: '15 đường Cách Mạng Tháng 8, phường 4, quận 1, TP.HCM',
      rating: 2.5,
      workers: 5,
      salary: 700000,
      totalSalary: 3500000,
    },
  ];
  // console.log("jobPostings in ConfirmPosting:", jobPostings);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { user } = getUserFromToken();
        const res = await serviceApi.getServices();
        console.log(res.data);
        if (res.data.length > 0) {
          const existService = res.data.some(service => service.userId === user.id && service.status === 'active');
          if (existService) {
            setIsService(true);
          }else{
            setIsService(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchService();
  }, [])
  return (
    <div className='confirm-posting-container'>

      <div className="confirm-posting-header">
        <h2>{jobGroupName}</h2>
        <div className="start-end-date">
          <p><ScheduleOutlined /> Start Date: {startDate}</p>
          <p><ScheduleOutlined /> End Date: {endDate}</p>
        </div>
      </div>

      <div className="confirm-posting-whole-table">
        <table className="confirm-posting-table">
          <thead>
            <tr>
              <th className="no-column">No</th>
              <th className="job-posting-name">Job Posting Name</th>
              <th className="address">Address</th>
              <th className="rating">Minimum rating <br /> for worker</th>
              <th className="number-of-workers">Number of workers</th>
              <th className="salary">Salary per <br />person (VND)</th>
              <th className="total-salary">Total salary (VND)</th>
            </tr>
          </thead>
          <tbody>
            {/*jobPostingsTemporaryData*/jobPostings.map((job, index) => (
              <tr key={index}>
                <td className="no-column">{index + 1}</td>
                <td className="job-posting-name">{job.jobPostingName}</td>
                <td className="address">{job.address}, {job.ward}, {job.district}, {job.city}</td>
                <td className="rating"><Rate disabled allowHalf defaultValue={job.rating} /></td>
                <td className="number-of-workers">{job.numberOfPeople}</td>
                <td className="salary">{job.salary.toLocaleString('vi-VN')}</td>
                <td className="total-salary">{(job.salary * job.numberOfPeople).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="payable-amount">
        <p className='job-total-salary'>Total salary: {jobPostings.reduce((total, job) => total + job.salary * job.numberOfPeople, 0).toLocaleString('vi-VN')} VND</p>
        {!isService && <p className='service-fee'>Service fee: 50.000 VND</p>}
        <div className='total-amount-border'></div>
        {isService ? (
          <p className='total-amount'>
            Total amount payable: <br className="break-line" />  {jobPostings.reduce((total, job) => total + job.salary * job.numberOfPeople, 0).toLocaleString('vi-VN')} VND
          </p>
        ) : (
          <p className='total-amount'>
            Total amount payable: <br className="break-line" />  {jobPostings.reduce((total, job) => 50000 + total + job.salary * job.numberOfPeople, 0).toLocaleString('vi-VN')} VND
          </p>
        )}
      </div>
    </div >
  )
}

export default ConfirmPosting