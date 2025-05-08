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
import WorkerProfile from './components/Worker/WorkerProfile/WorkerProfile'
import WorkerRatings from './components/Worker/WorkerProfile/WorkerRatings'
import WorkerCV from './components/Worker/WorkerCV/WorkerCV'
import WorkerApplications from './components/Worker/WorkerApplications/WorkerApplications'
import WorkerJobs from './components/Worker/WorkerJobs/WorkerJobs'
import WorkerJobDetail from './components/Worker/WorkerJobs/WorkerJobDetail'
import WorkerTransactions from './components/Worker/WorkerTransactions/WorkerTransactions'
import WorkerTransactionDetail from './components/Worker/WorkerTransactions/WorkerTransactionDetail'


import { getUserFromToken } from './utils/Token'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Admin from './pages/Admin/Admin'

import Employer from './pages/Employer/Employer'
import EmployerProfile from './components/Employer/EmployerProfile/EmployerProfile'
import EmployerRatings from './components/Employer/EmployerProfile/EmployerRatings'
import EmployerJobGroups from './components/Employer/EmployerJobGroups/EmployerJobGroups'
import EmployerJobGroupDetail from './components/Employer/EmployerJobGroupDetail/EmployerJobGroupDetail'
import EmployerJobPostingDetail from './components/Employer/EmployerJobPostingDetail/EmployerJobPostingDetail'
import WorkerDetailForEmployer from './components/Employer/WorkerDetailForEmployer/WorkerDetailForEmployer'
import ApplicationJobGroups from './components/Employer/ApplicationJobGroups/ApplicationJobGroups'
import ApplicationsByJobPostings from './components/Employer/ApplicationsByJobPostings/ApplicationsByJobPostings'
import ApplicationWorkerDetail from './components/Employer/ApplicationWorkerDetail/ApplicationWorkerDetail'
import EmployerTransactions from './components/Employer/EmployerTransactions/EmployerTransactions'
import EmployerTransactionDetail from './components/Employer/EmployerTransactions/EmployerTransactionDetail'
import Dashboard from './components/Admin/Dashboard/Dashboard'
import AccountManagement from './components/Admin/ManageAccounts/AccountManagement'
import AccessDeniedPage from './pages/AccessDeniedPage/AccessDeniedPage'
import SupportStaff from './pages/SupportStaff/SupportStaff'
import ManageComplaints from './components/SupportStaff/ManageComplaints/ManageComplaints'
import SupportStaffJobGroup from './components/SupportStaff/ManageJobExecute/SupportStaffJobGroup'
import SupportStaffJobPosting from './components/SupportStaff/ManageJobExecute/SupportStaffJobPosting'
import ManageJobExecute from './components/SupportStaff/ManageJobExecute/ManageJobExecute'

import EmployerPremiumPage from './pages/EmployerPremiumPage/EmployerPremiumPage'
import PaymentServiceSuccessful from './pages/PaymentServiceSuccessful/PaymentServiceSuccessful'

import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import ResetPassword from './pages/ResetPassword/ResetPassword'




function App() {
  const { payload } = useSelector((state) => state.authReducer);
  const [newUser, setNewUser] = useState(() => {
    const { user } = getUserFromToken();
    return user;
  });

  useEffect(() => {
    const { user } = getUserFromToken();
    setNewUser(user);
  }, [payload]);

  return (
    <>
      <Routes>
        <Route path='/access-denied' element={<AccessDeniedPage />} />
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

        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/sjcp-admin-login" element={<LoginForAdmin />} />
        <Route path="/sjcp-support-staff-login" element={<LoginForSupportStaff />} />


        <Route path="/finding-worker" element={<FindingWorker />} />
        <Route path="/finding-job" element={<FindingJob />} />
        <Route path="/job-detail-view/:id" element={<JobDetailView />} />
        <Route path="/finding-company" element={<FindingCompnay />} />
        <Route path="/company-detail/:id" element={<CompanyDetail />} />

        {/* Job Posting Flow */}
        <Route path='/job-posting-flow/*' element={<JobPostingFlow />}>
          <Route path='posting-notifications' element={<PostingNotifications />} />
          <Route path="creating-new-job-group" element={<JobPostingFlowLayout />} />
        </Route>

        {/* Worker */}
        <Route path='/worker/*' element={
          newUser && newUser.role === 'worker'
            ? <Worker />
            : <Navigate to="/login-for-worker" />
        }>
          <Route path='worker-profile' element={<WorkerProfile />} />
          <Route path='worker-ratings' element={<WorkerRatings />} />
          <Route path='worker-cv' element={<WorkerCV />} />
          <Route path='worker-applications' element={<WorkerApplications />} />
          <Route path="worker-jobs" element={<WorkerJobs />} />
          <Route path="worker-jobs/worker-job-detail/:id" element={<WorkerJobDetail />} />
          <Route path="worker-transactions" element={<WorkerTransactions newUser={newUser} />} />
          <Route path="worker-transactions/worker-transaction-detail/:id" element={<WorkerTransactionDetail />} />
        </Route>

        {/* Employer */}
        <Route path='/employer/*' element={
          newUser && newUser.role === 'employer'
            ? <Employer />
            : <Navigate to="/login-for-employer" />
        }>
          {/* Profile */}
          <Route path='employer-profile' element={<EmployerProfile />} />
          <Route path='employer-ratings' element={<EmployerRatings />} />
          {/* Application */}
          <Route path='application/job-groups' element={<ApplicationJobGroups />} />
          <Route path='application/job-groups/:jobGroupId' element={<ApplicationsByJobPostings />} />
          <Route path='application/job-groups/:jobGroupId/:workerId' element={<ApplicationWorkerDetail />} />
          {/* Jobs Management */}
          <Route path='employer-job-groups' element={<EmployerJobGroups />} />
          <Route path='employer-job-groups/employer-job-group-detail/:id' element={<EmployerJobGroupDetail />} />
          <Route path='employer-job-groups/employer-job-group-detail/:id/employer-job-posting-detail/:id' element={<EmployerJobPostingDetail />} />
          <Route path='employer-job-groups/employer-job-group-detail/:groupId/employer-job-posting-detail/:postingId/worker-detail/:workerId' element={<WorkerDetailForEmployer newUser={newUser} />} />
          {/* Transactions */}
          <Route path='employer-transactions' element={<EmployerTransactions newUser={newUser} />} />
          <Route path="employer-transactions/employer-transaction-detail/:id" element={<EmployerTransactionDetail />} />
        </Route>

        {/* Employer Premium */}
        <Route path='/employer-premium' element={<EmployerPremiumPage />} />
        <Route path='/payment-service-successful' element={<PaymentServiceSuccessful />} />

        {/* Admin */}
        <Route path='/admin/*' element={
          newUser && newUser.role === 'admin'
            ? <Admin />
            : <Navigate to="/sjcp-admin-login" />
        }>
          <Route path='manage-accounts' element={<AccountManagement />} />
          <Route path='dashboard' element={<Dashboard />} />
        </Route>

        {/* support staff */}
        <Route path='/support-staff/*' element={
          newUser && newUser.role === 'support staff'
            ? <SupportStaff />
            : <Navigate to="/sjcp-support-staff-login" />
        }>
          <Route path='manage-complaints' element={<ManageComplaints />} />
          <Route path='manage-jobExecute' element={<SupportStaffJobGroup />} />
          <Route path='manage-jobExecute/:jobGroupId' element={<SupportStaffJobPosting />} />
          <Route path='manage-jobExecute/:jobGroupId/:jobPostingId' element={<ManageJobExecute />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
