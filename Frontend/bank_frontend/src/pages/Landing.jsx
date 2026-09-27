import { Link } from 'react-router-dom'
import '../styles/Landing.css'

function Landing() {
  return (
    <div className="app-container">
      <div className="page-container">
        <div className="logo-section">
          <div className="logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="6" y="10" width="36" height="6" rx="2" fill="currentColor"/>
              <circle cx="15" cy="24" r="2" fill="currentColor"/>
              <circle cx="24" cy="24" r="2" fill="currentColor"/>
              <circle cx="33" cy="24" r="2" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="bank-name">Bank</h1>
        </div>

        <div className="content-section">
          <h2 className="headline">Modern Banking</h2>
          <p className="description">
            Clean, secure, and simple. Banking that works the way you do.
          </p>
        </div>

        <div className="button-section">
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/create-account" className="btn btn-secondary">
            Create Account
          </Link>
        </div>

        <div className="demo-link">
          <Link to="/deposit-withdraw" className="subtle-link">
            Try Deposit & Withdraw →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
