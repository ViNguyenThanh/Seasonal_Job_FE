import './App.css'
import LoginForEmployer from './pages/AuthForEmployer/LoginForEmployer'
import RegisterForEmployer from './pages/AuthForEmployer/RegisterForEmployer'
import LoginForAdmin from './pages/AuthForManagementTeam/LoginForAdmin'
import LoginForSupportStaff from './pages/AuthForManagementTeam/LoginForSupportStaff'
import LoginForWorker from './pages/AuthForWorker/LoginForWorker'
import RegisterForWorker from './pages/AuthForWorker/RegisterForWorker'
import FindingJob from './pages/FindingJob/FindingJob'
import FindingWorker from './pages/FindingWorker/FindingWorker'
import Home from './pages/Home/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import JobDetailView from './pages/JobDetailView/JobDetailView'
import FindingCompnay from './pages/FindingCompany/FindingCompany'

import JobPostingFlow from './pages/JobPostingFlow/JobPostingFlow'
import PostingNotifications from './components/JobPostingFlow/PostingNotifications/PostingNotifications'
import JobPostingFlowLayout from './components/JobPostingFlow/JobPostingFlowLayout/JobPostingFlowLayout'

import CompanyDetail from './pages/CompanyDetail/CompanyDetail'
import EmployerHome from './pages/EmployerHome/EmployerHome'
import Worker from './pages/Worker/Worker'
import WorkerJobs from './components/Worker/WorkerJobs/WorkerJobs'
import WorkerJobDetail from './components/Worker/WorkerJobs/WorkerJobDetail'
import { getUserFromToken } from './utils/Token'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'



function App() {
  const { payload } = useSelector((state) => state.authReducer);
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    const { user } = getUserFromToken();
    setNewUser(user);
    console.log(user);
    
  }, [payload]);


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employer-home" element={<EmployerHome />} />

        {/* Auth */}
        <Route path="/login-for-worker" element={
          newUser && newUser.role === 'user' ? (
            <Navigate to="/" />
          ) : (
            <LoginForWorker />
          )
        } />
        <Route path="/register-for-worker" element={
          newUser && newUser.role === 'user' ? (
            <Navigate to="/" />
          ) : (
            <RegisterForWorker />
          )
        } />

        <Route path="/login-for-employer" element={
          newUser && newUser.role === 'employer' ? (
            <Navigate to="/employer-home" />
          ) : (
            < LoginForEmployer />
          )} />

        <Route path="/register-for-employer" element={
          newUser && newUser.role === 'employer' ? (
            <Navigate to="/employer-home" />
          ) : (
            < RegisterForEmployer />
          )} />

        <Route path="/sjcp-admin-login" element={<LoginForAdmin />} />
        <Route path="/sjcp-support-staff-login" element={<LoginForSupportStaff />} />


        <Route path="/finding-worker" element={<FindingWorker />} />
        <Route path="/finding-job" element={<FindingJob />} />
        <Route path="/job-detail-view" element={<JobDetailView />} />
        <Route path="/finding-company" element={<FindingCompnay />} />
        <Route path="/company-detail" element={<CompanyDetail />} />

        {/* Job Posting Flow */}
        {newUser &&newUser.role === 'employer' ? (
          <Route path='/job-posting-flow/*' element={<JobPostingFlow />}>
            <Route path='posting-notifications' element={<PostingNotifications />} />
            <Route path="creating-new-job-group" element={<JobPostingFlowLayout/>} />
          </Route>
        ) : (
          <Route path='/job-posting-flow/*' element={<Navigate to="/login-for-employer" />} />
        )}

        {/* User */}
        <Route path='/worker/*' element={<Worker />}>
          <Route path="worker-jobs" element={<WorkerJobs />} />
          <Route path="worker-jobs/worker-job-detail/:id" element={<WorkerJobDetail />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
