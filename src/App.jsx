import './App.css'
import LoginForWorker from './pages/AuthForWorker/LoginForWorker'
import RegisterForWorker from './pages/AuthForWorker/RegisterForWorker'
import FindingJob from './pages/FindingJob/FindingJob'
import FindingWorker from './pages/FindingWorker/FindingWorker'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login-for-worker" element={<LoginForWorker/>} />
        <Route path="/register-for-worker" element={<RegisterForWorker />} />

        <Route path ="/finding-worker" element={<FindingWorker />} />
        <Route path ="/finding-job" element={<FindingJob />} />
      </Routes>
    </>
  )
}

export default App
