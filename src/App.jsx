import './App.css'
import LoginForEmployer from './pages/AuthForEmployer/LoginForEmployer'
import RegisterForEmployer from './pages/AuthForEmployer/RegisterForEmployer'
import LoginForWorker from './pages/AuthForWorker/LoginForWorker'
import RegisterForWorker from './pages/AuthForWorker/RegisterForWorker'
import FindingJob from './pages/FindingJob/FindingJob'
import FindingWorker from './pages/FindingWorker/FindingWorker'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import JobDetailView from './pages/JobDetailView/JobDetailView'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login-for-worker" element={<LoginForWorker/>} />
        <Route path="/register-for-worker" element={<RegisterForWorker />} />
        <Route path="/login-for-employer" element={<LoginForEmployer/>} />
        <Route path="/register-for-employer" element={<RegisterForEmployer />} />

        <Route path ="/finding-worker" element={<FindingWorker />} />
        <Route path ="/finding-job" element={<FindingJob />} />
        <Route path ="/job-detail-view" element={<JobDetailView />} />
      </Routes>
    </>
  )
}

export default App
