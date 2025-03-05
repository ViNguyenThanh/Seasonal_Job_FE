import './App.css'
import FindingWorker from './pages/FindingWorker/FindingWorker'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path ="/finding-worker" element={<FindingWorker />} />
      </Routes>
    </>
  )
}

export default App
