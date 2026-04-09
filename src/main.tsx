import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './pages/App.tsx'
import LoginPage from "./pages/login.tsx"
import OrganizationDashboard from './pages/organization_dashboard.jsx'
import SignupPage from './pages/signup.tsx'
import VolunteerDashboard from './pages/volunteer_dashboard.jsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route index element = { <App /> } />
            <Route path="/login" element = {<LoginPage />} />
            <Route path="/signup" element = {<SignupPage />} />
            <Route path="/organization_dashboard" element = {<OrganizationDashboard />} />
            <Route path="/volunteer_dashboard" element = {<VolunteerDashboard />} />
        </Routes>
    </BrowserRouter>,
)
