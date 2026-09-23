import Layout from '../components/Layout'
import InvoiceView from '../components/InvoiceView'
import { defaultIndentSlip } from '../data/dummyData'

export default function IndentSlipPage() {
  return (
    <Layout breadcrumb={<>Home&nbsp;&nbsp;›&nbsp;&nbsp;Inventory&nbsp;&nbsp;›&nbsp;&nbsp;<b>Indent Slip</b></>}>
      <div className="desk-content">
        <InvoiceView
          slip={defaultIndentSlip}
          showActions={false}
        />
      </div>
    </Layout>
  )
}
