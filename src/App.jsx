import './App.css'
import FindingJob from './pages/FindingJob/FindingJob'
import FindingWorker from './pages/FindingWorker/FindingWorker'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path ="/finding-worker" element={<FindingWorker />} />
        <Route path ="/finding-job" element={<FindingJob />} />
      </Routes>
    </>
  )
}

export default App
