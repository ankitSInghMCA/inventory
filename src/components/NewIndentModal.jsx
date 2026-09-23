import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faPlus,
  faTrash,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal'
import InvoiceView from './InvoiceView'
import {
  storeOptions,
  requestTypeOptions,
  categoryOptions,
  issuingStoreOptions,
  indentPeriodOptions,
  drugCatalogue,
} from '../data/dummyData'

let nextRowId = 2
let nextIndentSeq = 170220926120453

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDisplayDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function DrugDropdown({ value, onChange, onSelect, placeholder, className = '' }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const query = value.trim().toLowerCase()
  const filteredOptions = drugCatalogue.filter((drug) => drug.name.toLowerCase().includes(query))

  useEffect(() => {
    function onClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className={`drug-dropdown ${className}`.trim()} ref={dropdownRef}>
      <input
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && (
        <div className="drug-dropdown-menu" role="listbox">
          {filteredOptions.length > 0 ? filteredOptions.map((drug) => (
            <button
              type="button"
              className="drug-dropdown-option"
              key={drug.name}
              onClick={() => {
                onSelect(drug.name)
                setOpen(false)
              }}
            >
              <span>{drug.name}</span>
              <small>{drug.availableQty} available</small>
            </button>
          )) : (
            <div className="drug-dropdown-empty">No matching item found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function NewIndentModal({ open, onClose, onSaved }) {
  const [step, setStep] = useState('form') // 'form' | 'invoice'
  const [store, setStore] = useState(storeOptions[0])
  const [indentDate, setIndentDate] = useState(todayISO())
  const [dateOpen, setDateOpen] = useState(false)
  const [indentType, setIndentType] = useState(requestTypeOptions[0])
  const [category, setCategory] = useState(categoryOptions[0])
  const [issuingStore, setIssuingStore] = useState(issuingStoreOptions[0])
  const [indentPeriod, setIndentPeriod] = useState(indentPeriodOptions[0])
  const [rows, setRows] = useState([{ id: 1, drug: '', type: 'Drug', availableQty: '', quantity: '1' }])
  const [itemSearch, setItemSearch] = useState('')
  const [remarks, setRemarks] = useState('Indent Generated')
  const [slip, setSlip] = useState(null)
  const dateRef = useRef(null)

  useEffect(() => {
    if (!open) {
      // reset whenever the modal is fully closed so it opens fresh next time
      setStep('form')
      setDateOpen(false)
      setRows([{ id: nextRowId++, drug: '', type: 'Drug', availableQty: '', quantity: '1' }])
      setItemSearch('')
      setRemarks('Indent Generated')
      setSlip(null)
    }
  }, [open])

  useEffect(() => {
    function onClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function addRow() {
    setRows((prev) => [...prev, { id: nextRowId++, drug: '', type: 'Drug', availableQty: '', quantity: '1' }])
  }

  function removeRow(id) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))
  }

  function updateRow(id, field, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function selectDrug(id, drugName) {
    const found = drugCatalogue.find((d) => d.name === drugName)
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, drug: drugName, availableQty: found ? found.availableQty : '', type: found ? found.type : r.type }
          : r
      )
    )
  }

  function addItemFromSearch(drugName) {
    const emptyRow = rows.find((row) => !row.drug.trim())
    if (emptyRow) {
      selectDrug(emptyRow.id, drugName)
    } else {
      const newRow = { id: nextRowId++, drug: '', type: 'Drug', availableQty: '', quantity: '1' }
      setRows((prev) => [...prev, newRow])
      selectDrug(newRow.id, drugName)
    }
    setItemSearch('')
  }

  function resetForm() {
    setRows([{ id: nextRowId++, drug: '', type: 'Drug', availableQty: '', quantity: '1' }])
    setItemSearch('')
    setRemarks('Indent Generated')
  }

  function saveIndent() {
    const chosenRows = rows.filter((r) => r.drug.trim() !== '')
    const items = (chosenRows.length ? chosenRows : rows).map((r, idx) => ({
      sNo: idx + 1,
      itemName: r.drug || '0.45 DEXTROSE NORMAL SALINE 500ML [CPA00001]',
      reqQty: `${r.quantity || 1} No.`,
      approvedQty: String(r.quantity || 1),
    }))

    const newSlip = {
      raisingStore: store,
      indentNo: String(nextIndentSeq++),
      indenter: 'Invapp',
      facultyName: 'NA',
      category,
      indentType,
      indentDate: formatDisplayDate(indentDate),
      toStore: issuingStore,
      items,
      remarks,
      issueRemarks: `- ${remarks}`,
    }
    onSaved?.(newSlip)
    onClose?.()
  }

  function handlePrint() {
    document.body.classList.add('printing-invoice')
    window.print()
  }

  useEffect(() => {
    function cleanup() { document.body.classList.remove('printing-invoice') }
    window.addEventListener('afterprint', cleanup)
    return () => window.removeEventListener('afterprint', cleanup)
  }, [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={step === 'form' ? 'New Indent For Issue' : 'Indent Slip / Invoice'}
    >
      {step === 'form' && (
        <>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e0e9f2' }}>
            <div className="section-title">Indent Details</div>
            <div className="form-grid">
              <div>
                <label>Store Name *</label>
                <select value={store} onChange={(e) => setStore(e.target.value)}>
                  {storeOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="new-indent-date-field" ref={dateRef}>
                <label>Indent Date *</label>
                <button type="button" className="date-range-trigger" onClick={() => setDateOpen((prev) => !prev)}>
                  <span className="date-range-text">{formatDisplayDate(indentDate)}</span>
                  <span className="date-range-icon"><FontAwesomeIcon icon={faCalendarDays} /></span>
                </button>
                {dateOpen && (
                  <div className="new-indent-date-popover">
                    <Calendar
                      date={new Date(`${indentDate}T00:00:00`)}
                      onChange={(date) => {
                        setIndentDate(date.toISOString().slice(0, 10))
                        setDateOpen(false)
                      }}
                      color="#087bd0"
                      className="custom-date-range"
                    />
                  </div>
                )}
              </div>
              <div>
                <label>Indent Type *</label>
                <select value={indentType} onChange={(e) => setIndentType(e.target.value)}>
                  {requestTypeOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label>Item Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categoryOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label>Indent Status</label>
                <input type="text" defaultValue="Normal / External-Urgent" />
              </div>
              <div>
                <label>Issuing Store *</label>
                <select value={issuingStore} onChange={(e) => setIssuingStore(e.target.value)}>
                  {issuingStoreOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label>Indent Period *</label>
                <select value={indentPeriod} onChange={(e) => setIndentPeriod(e.target.value)}>
                  {indentPeriodOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e0e9f2' }}>
            <div className="section-title">Add Items</div>
            <div className="search-wrap modal-search-wrap">
              <span className="search-icon"><FontAwesomeIcon icon={faPlus} /></span>
              <DrugDropdown
                value={itemSearch}
                onChange={setItemSearch}
                onSelect={addItemFromSearch}
                placeholder="Enter first 3 characters of Drug Name to Search"
              />
            </div>
            <br /><br />
            <table className="item-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug/Item Name</th>
                  <th>Item Type</th>
                  <th>Available Qty</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <DrugDropdown
                        placeholder="Select Drug/Item"
                        value={row.drug}
                        onChange={(value) => selectDrug(row.id, value)}
                        onSelect={(drugName) => selectDrug(row.id, drugName)}
                      />
                    </td>
                    <td>{row.type}</td>
                    <td><input value={row.availableQty} readOnly /></td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="icon-btn" title="Remove item" onClick={() => removeRow(row.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <button className="btn secondary" onClick={addRow}><FontAwesomeIcon icon={faPlus} /> Add More Item</button>
          </div>

          <div className="card" style={{ boxShadow: 'none', border: '1px solid #e0e9f2', marginBottom: 0 }}>
            <label>Remarks</label>
            <textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            <div className="actions">
              <button className="btn secondary" onClick={resetForm}>Reset</button>
              <button className="btn secondary" onClick={onClose}>Cancel</button>
              <button className="btn primary" onClick={saveIndent}><FontAwesomeIcon icon={faFloppyDisk} /> Save Indent</button>
            </div>
          </div>
        </>
      )}

      {step === 'invoice' && slip && (
        <InvoiceView slip={slip} onPrint={handlePrint} onClose={onClose} />
      )}
    </Modal>
  )
}
