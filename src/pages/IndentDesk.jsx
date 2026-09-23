import { useEffect, useMemo, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faDownload,
  faEye,
  faFileInvoice,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/Layout'
import MultiSelect from '../components/MultiSelect'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import NewIndentModal from '../components/NewIndentModal'
import InvoiceView from '../components/InvoiceView'
import {
  indentList as baseIndentList,
  storeOptions,
  categoryOptions,
  requestTypeOptions,
  statusOptions,
  defaultIndentSlip,
} from '../data/dummyData'

function badgeClass(status) {
  if (status === 'Final Approved') return 'badge approved'
  if (status === 'Rejected') return 'badge rejected'
  return 'badge pending'
}

function parseIndentDate(value) {
  if (!value) return null

  const parsed = new Date(value.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDisplayDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function IndentDesk() {
  const [storeFilter, setStoreFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState([])
  const [requestTypeFilter, setRequestTypeFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ])
  const [dateOpen, setDateOpen] = useState(false)
  const dateRef = useRef(null)

  useEffect(() => {
    function onClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const [indentRows, setIndentRows] = useState(baseIndentList)
  const [newIndentOpen, setNewIndentOpen] = useState(false)
  const [viewSlip, setViewSlip] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const dateSummary = useMemo(() => {
    const selection = dateRange[0]
    if (!selection?.startDate && !selection?.endDate) return 'Select date range'
    if (selection.startDate && !selection.endDate) return formatDisplayDate(selection.startDate)
    if (selection.startDate && selection.endDate) {
      return `${formatDisplayDate(selection.startDate)} - ${formatDisplayDate(selection.endDate)}`
    }
    return 'Select date range'
  }, [dateRange])

  const datePills = useMemo(() => {
    const selection = dateRange[0]
    const pills = []
    if (selection?.startDate) pills.push(formatDisplayDate(selection.startDate))
    if (selection?.endDate) pills.push(formatDisplayDate(selection.endDate))
    return pills
  }, [dateRange])

  const filteredRows = useMemo(() => {
    let rows = [...indentRows]

    if (statusFilter.length) {
      rows = rows.filter((row) => statusFilter.includes(row.status))
    }

    const selectedRange = dateRange[0]
    if (selectedRange?.startDate || selectedRange?.endDate) {
      const start = selectedRange.startDate ? new Date(selectedRange.startDate) : null
      const end = selectedRange.endDate ? new Date(selectedRange.endDate) : null

      rows = rows.filter((row) => {
        const rowDate = parseIndentDate(row.indentDate)
        if (!rowDate) return false

        if (start && rowDate < new Date(start.setHours(0, 0, 0, 0))) return false
        if (end && rowDate > new Date(end.setHours(23, 59, 59, 999))) return false

        return true
      })
    }

    return rows
  }, [indentRows, statusFilter, dateRange])

  const stats = useMemo(() => ({
    total: indentRows.length,
    finalApproved: indentRows.filter((r) => r.status === 'Final Approved').length,
    pending: indentRows.filter((r) => r.status === 'Pending').length,
    rejected: indentRows.filter((r) => r.status === 'Rejected').length,
  }), [indentRows])

  function handleSaved(slip) {
    setIndentRows((prev) => [
      {
        id: (prev[prev.length - 1]?.id || 0) + 1,
        sNo: prev.length + 1,
        indentNo: slip.indentNo,
        indentDate: `${slip.indentDate} 12:00`,
        issuingStore: `${slip.toStore} (${slip.category})`,
        status: 'Pending',
      },
      ...prev,
    ])
    setToast(`Indent ${slip.indentNo} saved successfully`)
  }

  const columns = [
    { key: 'sNo', header: 'S.No', sortable: true },
    { key: 'indentNo', header: 'Indent No', sortable: true },
    { key: 'indentDate', header: 'Indent Date', sortable: true },
    { key: 'issuingStore', header: 'Issuing Store', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <span className={badgeClass(row.status)}>{row.status}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <>
          <button
            className="icon-btn"
            style={{ color: '#087bd0' }}
            title="View Indent Slip"
            onClick={() => setViewSlip({ ...defaultIndentSlip, indentNo: row.indentNo, indentDate: row.indentDate.split(' ')[0] })}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <span className="more-actions" aria-label="More actions"><FontAwesomeIcon icon={faFileInvoice} /></span>
        </>
      ),
    },
  ]

  return (
    <Layout breadcrumb={<>Home&nbsp;&nbsp;›&nbsp;&nbsp;Inventory&nbsp;&nbsp;›&nbsp;&nbsp;<b>Indent Desk</b></>}>
      {toast && <div className="toast toast-success" role="status">{toast}</div>}
      <div className="desk-content">
        <div className="heading">
          <div className="heading-text">
            <h1><span className="heading-icon"><FontAwesomeIcon icon={faFileInvoice} /></span>Indent Desk</h1>
            <p>Manage indent requests for medical supplies</p>
          </div>
          <div className="heading-actions">
            <button className="btn primary" onClick={() => setNewIndentOpen(true)}><FontAwesomeIcon icon={faPlus} /> New Indent</button>
            <button className="btn secondary"><FontAwesomeIcon icon={faDownload} /> Export</button>
          </div>
        </div>

        <div className="card">
          <div className="filters">
            <MultiSelect label="Store Name" options={storeOptions} selected={storeFilter} onChange={setStoreFilter} />
            <MultiSelect label="Category" options={categoryOptions} selected={categoryFilter} onChange={setCategoryFilter} />
            <MultiSelect label="Request Type" options={requestTypeOptions} selected={requestTypeFilter} onChange={setRequestTypeFilter} />
            <MultiSelect label="Status" options={statusOptions} selected={statusFilter} onChange={setStatusFilter} />
            <div className="date-range-filter" ref={dateRef}>
              <label>Indent Date Range</label>
              <div className="date-range-field-wrap">
                <button type="button" className="date-range-trigger" onClick={() => setDateOpen((prev) => !prev)}>
                  <span className="date-range-text">{dateSummary}</span>
                  <span className="date-range-icon"><FontAwesomeIcon icon={faCalendarDays} /></span>
                </button>
                {datePills.length > 0 && (
                  <div className="date-range-pills">
                    {datePills.map((pill) => (
                      <span key={pill} className="filter-pill">{pill}</span>
                    ))}
                  </div>
                )}
              </div>
              {dateOpen && (
                <div className="date-range-popover">
                  <DateRange
                    editableDateInputs
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    onChange={(item) => setDateRange([item.selection])}
                    className="custom-date-range"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">Total Indents<b>{stats.total}</b></div>
          <div className="stat green">Final Approved<b>{stats.finalApproved}</b></div>
          <div className="stat yellow">Pending<b>{stats.pending}</b></div>
          <div className="stat red">Rejected<b>{stats.rejected}</b></div>
        </div>

        <div className="card indent-list-card">
          <div className="section-title">Indent List</div>
          <DataTable
            columns={columns}
            data={filteredRows}
            pageSize={8}
            searchPlaceholder="Search by Indent No or Store..."
          />
        </div>
      </div>

      <NewIndentModal
        open={newIndentOpen}
        onClose={() => setNewIndentOpen(false)}
        onSaved={handleSaved}
      />

      <Modal open={!!viewSlip} onClose={() => setViewSlip(null)} wide title="Indent Slip / Invoice">
        {viewSlip && (
          <InvoiceView
            slip={viewSlip}
            onClose={() => setViewSlip(null)}
            onPrint={() => { document.body.classList.add('printing-invoice'); window.print() }}
          />
        )}
      </Modal>
    </Layout>
  )
}
