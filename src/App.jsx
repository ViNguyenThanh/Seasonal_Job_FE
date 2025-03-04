import './App.css'
import EmployerBrowseCandidate from './pages/EmployerBrowseCandidate/EmployerBrowseCandidate'
import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path ="/employer-browse-candidate" element={<EmployerBrowseCandidate />} />
      </Routes>
    </>
  )
}

export default App
