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
import { Route, Routes } from 'react-router-dom'
import JobDetailView from './pages/JobDetailView/JobDetailView'
import FindingCompnay from './pages/FindingCompany/FindingCompany'

import JobPostingFlow from './pages/JobPostingFlow/JobPostingFlow'
import PostingNotifications from './components/JobPostingFlow/PostingNotifications/PostingNotifications'
import JobPostingFlowLayout from './components/JobPostingFlow/JobPostingFlowLayout/JobPostingFlowLayout'

import CompanyDetail from './pages/CompanyDetail/CompanyDetail'
import EmployerHome from './pages/EmployerHome/EmployerHome'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employer-home" element={<EmployerHome />} />

        {/* Auth */}
        <Route path="/login-for-worker" element={<LoginForWorker />} />
        <Route path="/register-for-worker" element={<RegisterForWorker />} />
        <Route path="/login-for-employer" element={<LoginForEmployer />} />
        <Route path="/register-for-employer" element={<RegisterForEmployer />} />
        <Route path="/sjcp-admin-login" element={<LoginForAdmin />} />
        <Route path="/sjcp-support-staff-login" element={<LoginForSupportStaff />} />


        <Route path="/finding-worker" element={<FindingWorker />} />
        <Route path="/finding-job" element={<FindingJob />} />
        <Route path="/job-detail-view/:id" element={<JobDetailView />} />
        <Route path="/finding-company" element={<FindingCompnay />} />
        <Route path ="/company-detail" element={<CompanyDetail />} />

        {/* Job Posting Flow */}
        <Route path='/job-posting-flow/*' element={<JobPostingFlow />}>
        <Route path='posting-notifications' element={<PostingNotifications/>}/>
          <Route path="creating-new-job-group" element={<JobPostingFlowLayout />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
