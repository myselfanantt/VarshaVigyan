import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RegimeClassifier from './pages/RegimeClassifier.jsx'
import BiasCorrection from './pages/BiasCorrection.jsx'
import ForecastMap from './pages/ForecastMap.jsx'
import VerificationReport from './pages/VerificationReport.jsx'
import Settings from './pages/Settings.jsx'
import Toast from './components/ui/Toast.jsx'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/regime-classifier" element={<RegimeClassifier />} />
            <Route path="/bias-correction" element={<BiasCorrection />} />
            <Route path="/forecast-map" element={<ForecastMap />} />
            <Route path="/verification" element={<VerificationReport />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  )
}
