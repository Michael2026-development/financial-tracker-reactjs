import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, checkSession } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check session on mount only if we think we're authenticated
        const verifySession = async () => {
            if (isAuthenticated) {
                await checkSession()
            }
            setIsChecking(false)
        }
        verifySession()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Show loading while checking session
    if (isChecking) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                        progress_activity
                    </span>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}
