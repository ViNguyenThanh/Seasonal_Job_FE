import React, { useState } from 'react'
import './Dashboard.css'
import { ShoppingOutlined, TeamOutlined } from '@ant-design/icons';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
    const [selectedYear, setSelectedYear] = useState('2023');

    const revenueData = {
        2023: [
            { name: 'Jan', revenue: 1200 }, { name: 'Feb', revenue: 2100 }, { name: 'Mar', revenue: 800 },
            { name: 'Apr', revenue: 2780 }, { name: 'May', revenue: 1890 }, { name: 'Jun', revenue: 2390 },
            { name: 'Jul', revenue: 3490 }, { name: 'Aug', revenue: 3000 }, { name: 'Sep', revenue: 2000 },
            { name: 'Oct', revenue: 2500 }, { name: 'Nov', revenue: 3200 }, { name: 'Dec', revenue: 4100 }
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
                    <p className="card-value"><TeamOutlined /> 10</p>
                </div>
                <div className="card-general card-total-employers">
                    <h3 className="card-title">Total Employers</h3>
                    <p className="card-value"><TeamOutlined /> 25</p>
                </div>
                <div className="card-general card-job-groups">
                    <h3 className="card-title">Total Job Groups</h3>
                    <p className="card-value"><ShoppingOutlined /> 125</p>
                </div>
                <div className="card-general card-job-postings">
                    <h3 className="card-title">Total Job Postings</h3>
                    <p className="card-value"><ShoppingOutlined /> 125</p>
                </div>
            </div>

            {/* Chart for revenue */}
            <div className="card chart-card">
                <div className="chart-card-header">
                    <h4 className="card-title">Revenue of {selectedYear}</h4>
                    <div className="chart-selector-wrapper">
                        <select className="year-selector" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
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
