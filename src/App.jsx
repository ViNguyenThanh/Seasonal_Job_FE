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
import Worker from './pages/Worker/Worker'
import WorkerJobs from './components/Worker/WorkerJobs/WorkerJobs'
import WorkerJobDetail from './components/Worker/WorkerJobs/WorkerJobDetail'
import Employer from './pages/Employer/Employer'
import EmployerJobGroups from './components/Employer/EmployerJobGroups/EmployerJobGroups'
import EmployerJobGroupDetail from './components/Employer/EmployerJobGroupDetail/EmployerJobGroupDetail'
import EmployerJobPostingDetail from './components/Employer/EmployerJobPostingDetail/EmployerJobPostingDetail'



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
        <Route path="/job-detail-view" element={<JobDetailView />} />
        <Route path="/finding-company" element={<FindingCompnay />} />
        <Route path ="/company-detail" element={<CompanyDetail />} />

        {/* Job Posting Flow */}
        <Route path='/job-posting-flow/*' element={<JobPostingFlow />}>
        <Route path='posting-notifications' element={<PostingNotifications/>}/>
          <Route path="creating-new-job-group" element={<JobPostingFlowLayout />} />
        </Route>

        {/* Worker */}
        <Route path='/worker/*' element={<Worker/>}>
            <Route path="worker-jobs" element={<WorkerJobs/>}/>
            <Route path="worker-jobs/worker-job-detail/:id" element={<WorkerJobDetail/>}/>
        </Route>

        {/* Employer */}
        <Route path='/employer/*' element={<Employer/>}>
            <Route path='employer-job-groups' element={<EmployerJobGroups/>}/>
            <Route path='employer-job-groups/employer-job-group-detail/:id' element={<EmployerJobGroupDetail/>}/>
            <Route path='employer-job-groups/employer-job-group-detail/:id/employer-job-posting-detail/:id' element={<EmployerJobPostingDetail/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
