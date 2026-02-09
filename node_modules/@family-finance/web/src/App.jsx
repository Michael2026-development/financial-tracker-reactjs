import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import AddTransaction from '@/pages/AddTransaction'
import History from '@/pages/History'
import Categories from '@/pages/Categories'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Reports from '@/pages/Reports'
import SearchResults from '@/pages/SearchResults'
import ResetData from '@/pages/ResetData'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/stores/useAuthStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // System Dark Mode Detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Initial check
    handleChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddTransaction />} />
          <Route path="history" element={<History />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reset-data" element={<ResetData />} />
          <Route path="search" element={<SearchResults />} />
        </Route>

        {/* Redirect any unknown routes to login if not authenticated, dashboard if authenticated */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
