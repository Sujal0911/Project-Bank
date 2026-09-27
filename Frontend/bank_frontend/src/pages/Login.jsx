import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import '../styles/Auth.css'
import { Link } from 'react-router-dom'
const backendUrl = import.meta.env.VITE_BACKEND_URL

function Login() {
  const [accountId, setAccountId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
  const credentials = btoa(`${accountId}:${password}`)

  const response = await fetch(`${backendUrl}/accounts/login`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    },
  })
  if (!response.ok) { throw new Error('Invalid account ID or password') }
  const user = await response.json();
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('credentials', credentials)
  navigate("/deposit-withdraw")
}

  return (
    <div className="app-container">
      <Header />
      <div className="page-container auth-container">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">accountId</label>
            <input
              id="accountId"
              type="text"
              placeholder="example"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New here?{' '}
            <Link to="/create-account" className="link">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
