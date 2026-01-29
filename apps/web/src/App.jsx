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
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/stores/useAuthStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

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


