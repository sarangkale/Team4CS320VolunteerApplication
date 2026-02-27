import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './pages/App.tsx'
import LoginPage from "./pages/login.tsx"
import Dashboard from './pages/dashboard.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route index element = { <App /> } />
            <Route path="/login" element = {<LoginPage />} />
            <Route path="/dashboard" element = {<Dashboard />} />
        </Routes>
    </BrowserRouter>,
)
