# eSushrut Indent UI — React + Vite

Converted from the 3 static HTML mockups (`01-indent-desk.html`, `02-new-indent.html`, `03-indent-slip.html`) into a React + Vite app with client-side routing. All dummy content from the originals (stats, indent list, form defaults, invoice data) has been preserved and expanded, and lives in `src/data/dummyData.js` so it's easy to swap for real API calls later.

## What's new in this pass

- **Multi-select filters** — Store Name, Category, Request Type and Status on the Indent Desk are now checkbox multi-selects (`src/components/MultiSelect.jsx`) instead of plain single-value dropdowns.
- **Real data table** — the Indent List is now a reusable `DataTable` component (`src/components/DataTable.jsx`) with a search box, click-to-sort columns, and pagination, backed by 24 dummy rows.
- **New Indent opens in a modal** — clicking "＋ New Indent" no longer navigates to a new page; it opens `NewIndentModal` on top of the Indent Desk.
- **Modal → Invoice flow** — filling the form and clicking "Save Indent" swaps the modal's content to the generated Indent Slip/invoice (dummy data), inside the same modal.
- **Print / Close on the invoice** — the invoice step has a **Print / Download PDF** button (uses the browser's print dialog, scoped via print CSS so only the invoice prints — choose "Save as PDF" as the destination) and a **Close** button that dismisses the modal and returns to the Indent Desk.
- **Real AIIMS Raipur letterhead logo** — the invoice header now uses the uploaded AIIMS Raipur logo (`public/aiims-logo.jpg`) instead of the placeholder ◉ symbol.
- Saving a new indent also pushes a new "Pending" row onto the Indent Desk's data table, so the list reflects what you just created.

## Setup

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

```
public/
  aiims-logo.jpg        AIIMS Raipur letterhead logo, used on the invoice
src/
  components/
    Sidebar.jsx          shared left nav
    Topbar.jsx           shared top search/user bar
    Layout.jsx           wraps Sidebar + Topbar + page content
    MultiSelect.jsx       checkbox multi-select dropdown
    DataTable.jsx         search + sort + paginate table
    Modal.jsx              generic modal shell (Esc to close, click outside to close)
    NewIndentModal.jsx     New Indent form step → Invoice step, inside a Modal
    InvoiceView.jsx        shared invoice/indent-slip markup (used by the modal and the standalone route)
  pages/
    IndentDesk.jsx        screen 1 — indent list (DataTable) + multi-select filters + stats + opens NewIndentModal
    IndentSlip.jsx         standalone, shareable indent-slip route (kept for direct links)
  data/
    dummyData.js           all mock/dummy content used across screens (24 sample indents, catalogues, etc.)
  styles.css               global stylesheet, plus multi-select/modal/table/print styles
  App.jsx                  routes: "/" (Indent Desk) and "/indent-slip" (standalone slip)
  main.jsx                 React + Router entry point
```

## Notes on behavior

- "＋ New Indent" on the Indent Desk → opens `NewIndentModal` (no page navigation).
- Inside the modal: "Cancel"/"Reset" work on the form step; "Save Indent" switches the modal to the invoice step and adds a new "Pending" row to the Indent Desk table.
- On the invoice step: "Print / Download PDF" opens the browser print dialog scoped to just the invoice (pick "Save as PDF"); "Close" dismisses the modal and resets the form for next time.
- The eye icon (◉) on any Indent Desk row opens that row's invoice in a read-only modal, with the same Print/Close actions.
- Selecting a drug from the datalist auto-fills its Available Qty from `dummyData.js`.
- Status filter is a true multi-select (pick any combination of Final Approved / Pending / Rejected) and actually filters the table; the other filters are multi-select UI wired to dummy option lists, ready to be connected to real filtering logic.
- The Indent List table supports searching (indent no / store), column sorting (click a header), and pagination.
- Responsive behavior (collapsed icon-only sidebar under 900px) is preserved via the same media query.
