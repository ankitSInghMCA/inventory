import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function MultiSelect({ label, options, selected, onChange, placeholder = 'All' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function toggleOption(opt) {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  return (
    <div className="multiselect" ref={ref}>
      {label && <label>{label}</label>}
      <div className="multiselect-field-wrap">
        <button type="button" className="multiselect-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="multiselect-main-value">
            {selected.length === 0 ? placeholder : `${selected.length} selected`}
          </span>
          <span className="multiselect-actions">
            <span className="multiselect-caret"><FontAwesomeIcon icon={faChevronDown} /></span>
          </span>
        </button>
        {selected.length > 0 && (
          <div className="multiselect-pills">
            {selected.map((opt) => (
              <span key={opt} className="filter-pill">{opt}</span>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="multiselect-panel">
          {options.map((opt) => (
            <label key={opt} className="multiselect-option">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
              />
              {opt}
            </label>
          ))}
          <div className="multiselect-footer">
            <button type="button" className="link-btn" onClick={() => onChange([])}>Clear</button>
            <button type="button" className="link-btn" onClick={() => onChange(options)}>Select all</button>
          </div>
        </div>
      )}
    </div>
  )
}
