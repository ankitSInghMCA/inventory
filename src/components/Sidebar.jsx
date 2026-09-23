import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartColumn,
  faCircleQuestion,
  faFileLines,
  faGear,
  faHospital,
  faHouse,
  faUsers,
  faUtensils,
  faWarehouse,
} from '@fortawesome/free-solid-svg-icons'
import { navItems } from '../data/dummyData'

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

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><FontAwesomeIcon icon={faHouse} /></span>
        <span>eSushrut</span>
        <small>AIIMS Inventory Management</small>
      </div>
      <ul className="nav">
        {navItems.map((item) => (
          <li key={item.label} className={item.active ? 'active' : ''}>
            <span className="nav-icon"><FontAwesomeIcon icon={iconMap[item.icon] || faFileLines} /></span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
        {/* <li>
          <span className="nav-icon"><FontAwesomeIcon icon={faCircleQuestion} /></span>
          <span className="nav-label">Help</span>
        </li> */}
      </ul>
    </aside>
  )
}
