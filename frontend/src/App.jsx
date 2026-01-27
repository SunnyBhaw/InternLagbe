import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import AdminDashboard from './pages/AdminDashboard'
import AdminInternships from './pages/AdminInternships'
import AdminReports from './pages/AdminReports'
import BrowseInternships from './pages/BrowseInternships'
import CompanyApplications from './pages/CompanyApplications'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyOnboarding from './pages/CompanyOnboarding'
import CompanyProfile from './pages/CompanyProfile'
import EditInternship from './pages/EditInternship'
import InternshipDetail from './pages/InternshipDetail'
import Login from './pages/Login'
import ManageInternships from './pages/ManageInternships'
import MyApplications from './pages/MyApplications'
import PostInternship from './pages/PostInternship'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import StudentOnboarding from './pages/StudentOnboarding'
import StudentProfile from './pages/StudentProfile'
import UserManagement from './pages/UserManagement'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/internships" element={<AdminInternships />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/onboarding" element={<CompanyOnboarding />} />
        <Route path="/company/post" element={<PostInternship />} />
        <Route path="/company/internships" element={<ManageInternships />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/edit/:id" element={<EditInternship />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/onboarding" element={<StudentOnboarding />} />
        <Route path="/student/browse" element={<BrowseInternships />} />
        <Route path="/student/internship/:id" element={<InternshipDetail />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Routes>
    </Router>
  )
}

export default App

