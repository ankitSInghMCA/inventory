import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartColumn,
  faChevronDown,
  faFileLines,
  faGear,
  faHospital,
  faHouse,
  faBars,
  faRightFromBracket,
  faXmark,
  faUsers,
  faUtensils,
  faWarehouse,
} from '@fortawesome/free-solid-svg-icons'
import { currentUser, navItems } from '../data/dummyData'
import Modal from './Modal'

const iconMap = {
  dashboard: faHouse,
  registration: faFileLines,
  hospital: faHospital,
  files: faFileLines,
  warehouse: faWarehouse,
  utensils: faUtensils,
  chart: faChartColumn,
  gear: faGear,
  users: faUsers,
}

export default function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="brand-mark" aria-hidden="true">
          <FontAwesomeIcon icon={faHouse} />
          <span className="brand-mark-accent" />
        </span>
        <div>
          <strong className="brand-name"><span>e</span>Sushrut</strong>
          <small>AIIMS Inventory Management</small>
        </div>
      </div>
      <nav className="topbar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <span key={item.label} className={`topbar-nav-item${item.active ? ' active' : ''}`}>
            <FontAwesomeIcon icon={iconMap[item.icon] || faFileLines} />
            <span>{item.label}</span>
          </span>
        ))}
      </nav>
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {mobileNavOpen && (
        <div className="mobile-nav-layer">
          <button
            type="button"
            className="mobile-nav-backdrop"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          />
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            <div className="mobile-nav-header">
              <strong>Menu</strong>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label}
                className={`mobile-nav-item${item.active ? ' active' : ''}`}
                onClick={() => setMobileNavOpen(false)}
              >
                <FontAwesomeIcon icon={iconMap[item.icon] || faFileLines} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
      <div className="user-menu" ref={userMenuRef}>
        <button
          type="button"
          className="user user-trigger"
          onClick={() => setUserMenuOpen((open) => !open)}
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
        >
          <span className="avatar">{currentUser.initials}</span>
          <span className="user-meta">
            <b>Welcome, {currentUser.name}</b>
            <small>{currentUser.ward}</small>
          </span>
          <span className="chevron"><FontAwesomeIcon icon={faChevronDown} /></span>
        </button>
        {userMenuOpen && (
          <div className="user-dropdown" role="menu">
            <button type="button" role="menuitem" className="user-dropdown-item">
              <FontAwesomeIcon icon={faGear} />
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              className="user-dropdown-item logout-item"
              onClick={() => {
                setUserMenuOpen(false)
                setLogoutOpen(true)
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </div>
        )}
      </div>
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Confirm Logout">
        <p className="logout-message">Are you sure you want to logout?</p>
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={() => setLogoutOpen(false)}>Cancel</button>
          <button type="button" className="btn primary" onClick={() => setLogoutOpen(false)}>Logout</button>
        </div>
      </Modal>
    </header>
  )
}
