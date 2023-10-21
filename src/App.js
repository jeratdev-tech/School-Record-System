import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Error, Register, SelectPreference } from './pages'
import {
  Dashboard,
  Classes,
  AcademicSessions,
  Students,
  Teachers,
  Subjects,
} from './pages/admin/Pages'
import Layout from './pages/admin/AdminLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/select-preference' element={<SelectPreference />} />
        <Route path='/register' element={<Register />} />

        <Route path='/dashboard' element={<Layout />}>
          <Route path='/dashboard' index element={<Dashboard />} />
          <Route path='classes' element={<Classes />} />
          <Route path='academic-sessions' element={<AcademicSessions />} />
          <Route path='teachers' element={<Teachers />} />
          <Route path='students' element={<Students />} />
          <Route path='subjects' element={<Subjects />} />
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
