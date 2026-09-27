import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import DepositWithdraw from './pages/DepositWithdraw'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/deposit-withdraw" element={<DepositWithdraw />} />
      </Routes>
    </Router>
  )
}

export default App
