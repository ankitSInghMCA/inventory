import { Routes, Route } from 'react-router-dom'
import IndentDesk from './pages/IndentDesk'
import IndentSlipPage from './pages/IndentSlipPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndentDesk />} />
      <Route path="/indent-slip" element={<IndentSlipPage />} />
    </Routes>
  )
}
