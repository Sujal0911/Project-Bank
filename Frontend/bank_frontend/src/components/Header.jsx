import { Link } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
            <rect x="6" y="10" width="36" height="6" rx="2" fill="currentColor"/>
            <circle cx="15" cy="24" r="2" fill="currentColor"/>
            <circle cx="24" cy="24" r="2" fill="currentColor"/>
            <circle cx="33" cy="24" r="2" fill="currentColor"/>
          </svg>
        </div>
        <span>Bank</span>
      </Link>
    </header>
  )
}

export default Header
