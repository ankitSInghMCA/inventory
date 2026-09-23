import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

export default function InvoiceView({ slip, onPrint, onClose, showActions = true }) {
  return (
    <div>
      {showActions && (
        <div className="actions modal-actions-noprint" style={{ marginTop: 0, marginBottom: 18 }}>
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button className="btn primary" onClick={onPrint}><FontAwesomeIcon icon={faPrint} /> Print / Download PDF</button>
        </div>
      )}
      <div className="invoice">
        <div className="invoice-head">
          <img src="/aiims-logo.jpg" alt="AIIMS Raipur logo" className="invoice-logo" />
          <h2>All India Institute of Medical Sciences, Raipur</h2>
          <p>अखिल भारतीय आयुर्विज्ञान संस्थान, रायपुर</p>
          <h2><u>Indent Slip</u></h2>
        </div>

        <div className="info-grid">
          <div>
            <b>Raising Store:</b> {slip.raisingStore}<br />
            <b>Indent No:</b> {slip.indentNo}<br />
            <b>Indenter:</b> {slip.indenter}<br />
            <b>Faculty Name:</b> {slip.facultyName}
          </div>
          <div>
            <b>Category:</b> {slip.category}<br />
            <b>Indent Type:</b> {slip.indentType}<br />
            <b>Indent Date:</b> {slip.indentDate}<br />
            <b>To Store:</b> {slip.toStore}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Item Name</th>
              <th>Req Qty</th>
              <th>Approved / Issue Qty</th>
            </tr>
          </thead>
          <tbody>
            {slip.items.map((item) => (
              <tr key={item.sNo}>
                <td>{item.sNo}</td>
                <td>{item.itemName}</td>
                <td>{item.reqQty}</td>
                <td>{item.approvedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Authority Name</th>
              <th>Level</th>
              <th>Approval Date</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={3} style={{ textAlign: 'center' }}>No Record Found For Approval Level</td></tr>
            <tr><td colSpan={3} style={{ textAlign: 'center' }}>No Record Found For Approval Level</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: 25 }}>
          <b>Remarks:</b> {slip.remarks}<br />
          <b>Issue Remarks:</b> {slip.issueRemarks}
        </div>

        <div className="footer">
          Serving the Nation in Health<br /><br />
          Centre for Development of Advanced Computing (C-DAC) | eSushrut v5.0
        </div>
      </div>
    </div>
  )
}
