import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './pages/App.tsx'
import LoginPage from "./pages/login.tsx"
import OrganizationDashboard from './pages/organization_dashboard.jsx'
import CreateOpportunity from './pages/CreateOpp.jsx'
import SignupPage from './pages/signup.tsx'
import VolunteerDashboard from './pages/volunteer_dashboard_events.jsx'
import VolunteerProfile from './pages/volunteer_dashboard_profile.jsx'
import VolunteerActivity from './pages/volunteer_dashboard_activity.jsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route index element = { <App /> } />
            <Route path="/login" element = {<LoginPage />} />
            <Route path="/signup" element = {<SignupPage />} />
            <Route path="/organization_dashboard" element = {<OrganizationDashboard />} />
            <Route path="/organization_dashboard/create_opportunity" element = {<CreateOpportunity />} />
            <Route path="/volunteer_dashboard/events" element = {<VolunteerDashboard />} />
            <Route path="/volunteer_dashboard/profile" element = {<VolunteerProfile />} />
            <Route path="/volunteer_dashboard/activity" element = {<VolunteerActivity />} />
        </Routes>
    </BrowserRouter>,
)
