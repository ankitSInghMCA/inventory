import Topbar from './Topbar'

export default function Layout({ breadcrumb, children }) {
  return (
    <div className="app">
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
