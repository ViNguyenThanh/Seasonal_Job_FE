import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { ShoppingOutlined, TeamOutlined } from '@ant-design/icons';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { userApi } from '../../../apis/user.request';
import { jobGroupApi } from '../../../apis/job-group.request';
import { jobApi } from '../../../apis/job.request';

export default function Dashboard() {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [totalWorker, setTotalWorker] = useState(0);
    const [totalEmployer, setTotalEmployer] = useState(0);

    useEffect(() => {
        const fetchTotalAccounts = async () => {
            try {
                const res = await userApi.getAllUsers();
                const workers = res.data.data.filter(user => user.role === 'worker');
                const employers = res.data.data.filter(user => user.role === 'employer');
                setTotalWorker(workers.length);
                setTotalEmployer(employers.length);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTotalAccounts();
    }, [])

    // useEffect(() => {
    //     const fetchJob = async () => {
    //         try {
    //             const res = await jobApi.getTotalJob();
    //             console.log(res);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     fetchJob()
    // })

    const revenueData = {
        2025: [
            { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 },
            { name: 'Apr', revenue: 250000 }, { name: 'May', revenue: 500000 }, { name: 'Jun', revenue: 0 },
            { name: 'Jul', revenue: 0 }, { name: 'Aug', revenue: 0 }, { name: 'Sep', revenue: 0 },
            { name: 'Oct', revenue: 0 }, { name: 'Nov', revenue: 0 }, { name: 'Dec', revenue: 0 }
        ],
        2024: [
            { name: 'Jan', revenue: 1800 }, { name: 'Feb', revenue: 2200 }, { name: 'Mar', revenue: 1700 },
            { name: 'Apr', revenue: 2900 }, { name: 'May', revenue: 2400 }, { name: 'Jun', revenue: 3100 },
            { name: 'Jul', revenue: 2800 }, { name: 'Aug', revenue: 3300 }, { name: 'Sep', revenue: 2600 },
            { name: 'Oct', revenue: 3000 }, { name: 'Nov', revenue: 3700 }, { name: 'Dec', revenue: 4200 }
        ]
    };

    return (
        <div className="dashboard-container">
            {/* Top Cards */}
            <div className="dashboard-top-cards">
                <div className="card-general card-total-workers">
                    <h3 className="card-title">Total Workers</h3>
                    <p className="card-value"><TeamOutlined /> {totalWorker}</p>
                </div>
                <div className="card-general card-total-employers">
                    <h3 className="card-title">Total Employers</h3>
                    <p className="card-value"><TeamOutlined /> {totalEmployer}</p>
                </div>
                <div className="card-general card-job-groups">
                    <h3 className="card-title">Total Job Groups</h3>
                    <p className="card-value"><ShoppingOutlined /> 41</p>
                </div>
                <div className="card-general card-job-postings">
                    <h3 className="card-title">Total Job Postings</h3>
                    <p className="card-value"><ShoppingOutlined /> 53</p>
                </div>
            </div>

            {/* Chart for revenue */}
            <div className="card chart-card">
                <div className="chart-card-header">
                    <h4 className="card-title">Revenue of {selectedYear}</h4>
                    <div className="chart-selector-wrapper">
                        <select className="year-selector" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="2025">2025</option>
                            {/* <option value="2024">2024</option> */}
                        </select>
                    </div>
                </div>
                <AreaChart width={1200} height={300} data={revenueData[selectedYear]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
                    <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
            </div>

        </div>
    )
}
