// Dummy/mock data extracted from the original static screens.
// Replace with real API calls when wiring this UI up to a backend.

export const navItems = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'registration', label: 'Registration' },
  { icon: 'hospital', label: 'Operation Theater' },
  { icon: 'files', label: 'BMED' },
  { icon: 'warehouse', label: 'Inventory', active: true },
]

export const currentUser = {
  initials: 'I',
  name: 'Invapp',
  ward: 'C 5 B Ward',
}

export const indentStats = {
  total: 35,
  finalApproved: 12,
  pending: 20,
  rejected: 3,
}

const stores = ['Amrit Pharmacy (Drug)', 'Central Store', 'Ayushman Bharat', 'Surgical Store']
const statuses = ['Final Approved', 'Pending', 'Rejected']

export const indentList = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1
  return {
    id: n,
    sNo: n,
    indentNo: `17038267530${String(n).padStart(2, '0')}`,
    indentDate: `28-Jul-2026 ${String(10 + Math.floor(n / 6)).padStart(2, '0')}:${String((51 + n) % 60).padStart(2, '0')}`,
    issuingStore: stores[n % stores.length],
    status: statuses[n % statuses.length],
  }
})

export const storeOptions = ['C 5 B Ward', 'C 5 A Ward', 'ICU Ward', 'OT Complex', 'Emergency Ward']
export const categoryOptions = ['Drug', 'Consumable', 'Surgical', 'Linen', 'Diet']
export const requestTypeOptions = ['Indent For Issue (DEPT)', 'Indent For Return', 'Indent For Transfer']
export const statusOptions = ['Final Approved', 'Pending', 'Rejected']

export const issuingStoreOptions = ['Ayushman Bharat', 'Central Store', 'Amrit Pharmacy', 'Surgical Store']
export const indentPeriodOptions = ['Monthly', 'Weekly']

// A small searchable drug catalogue for the "Add Items" table
export const drugCatalogue = [
  { name: '0.45 DEXTROSE NORMAL SALINE 500ML [CPA00001]', type: 'Drug', availableQty: 240 },
  { name: 'PARACETAMOL 500MG TABLET [CPA00002]', type: 'Drug', availableQty: 1500 },
  { name: 'NORMAL SALINE 0.9% 500ML [CPA00003]', type: 'Drug', availableQty: 380 },
  { name: 'AMOXICILLIN 500MG CAPSULE [CPA00004]', type: 'Drug', availableQty: 620 },
  { name: 'RINGER LACTATE 500ML [CPA00005]', type: 'Drug', availableQty: 190 },
]

export const defaultIndentSlip = {
  raisingStore: 'C 5 B Ward',
  indentNo: '170220926120452',
  indenter: 'Invapp',
  facultyName: 'NA',
  category: 'Drug',
  indentType: 'Indent For Issue (DEPT)',
  indentDate: '22-Sep-2026',
  toStore: 'Central Store',
  items: [
    { sNo: 1, itemName: '0.45 DEXTROSE NORMAL SALINE 500ML [CPA00001]', reqQty: '1 No.', approvedQty: '1' },
  ],
  remarks: 'Indent Generated',
  issueRemarks: '- Indent Generated',
}
