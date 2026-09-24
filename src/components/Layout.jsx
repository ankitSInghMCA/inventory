import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ breadcrumb, children, sidebar = false }) {
  return (
    <div className={`app${sidebar ? ' sidebar-layout' : ''}`}>
      {sidebar && <Sidebar />}
      <main className="main">
        <Topbar />
        <section className="content">
          {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
          {children}
        </section>
      </main>
    </div>
  )
}
