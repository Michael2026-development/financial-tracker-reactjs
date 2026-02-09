import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signIn, signUp, signOut, authClient } from '@/lib/auth-client'

/**
 * Clear all app-related localStorage data
 * Called on logout and when switching users
 */
function clearAllAppData() {
    // Clear all known app storage keys
    const appStorageKeys = [
        'auth-storage',
        'transaction-storage',
        'notification-storage',
        'search-storage',
    ]

    appStorageKeys.forEach(key => {
        localStorage.removeItem(key)
    })
}

/**
 * Auth Store using Better Auth
 * Manages authentication state and provides login/logout/register functions
 */
export const useAuthStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            error: null,
            isLoading: false,

            /**
             * Set auth state from session
             */
            setSession: (session) => {
                if (session?.user) {
                    const currentUser = get().user

                    // If a different user is logging in, clear all app data
                    if (currentUser && currentUser.id !== session.user.id) {
                        clearAllAppData()
                    }

                    set({
                        isAuthenticated: true,
                        user: {
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.name,
                            image: session.user.image,
                        },
                        error: null,
                    })
                } else {
                    set({
                        isAuthenticated: false,
                        user: null,
                    })
                }
            },

            /**
             * Login with email and password
             */
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const currentUser = get().user

                    const result = await signIn.email({
                        email,
                        password,
                    })

                    if (result.error) {
                        set({ error: result.error.message, isLoading: false })
                        return { success: false, error: result.error.message }
                    }

                    // Fetch session after login
                    const session = await authClient.getSession()

                    // If different user, clear all data before setting session
                    if (currentUser && session.data?.user?.id !== currentUser.id) {
                        clearAllAppData()
                    }

                    get().setSession(session.data)
                    set({ isLoading: false })
                    return { success: true }
                } catch (error) {
                    const message = error.message || 'Login failed'
                    set({ error: message, isLoading: false })
                    return { success: false, error: message }
                }
            },

            /**
             * Register new user with email and password
             */
            register: async (name, email, password) => {
                set({ isLoading: true, error: null })
                try {
                    // Clear any existing data for new user registration
                    clearAllAppData()

                    const result = await signUp.email({
                        name,
                        email,
                        password,
                    })

                    if (result.error) {
                        set({ error: result.error.message, isLoading: false })
                        return { success: false, error: result.error.message }
                    }

                    // Fetch session after signup
                    const session = await authClient.getSession()
                    get().setSession(session.data)
                    set({ isLoading: false })
                    return { success: true }
                } catch (error) {
                    const message = error.message || 'Registration failed'
                    set({ error: message, isLoading: false })
                    return { success: false, error: message }
                }
            },

            /**
             * Logout user and clear all app data
             */
            logout: async () => {
                set({ isLoading: true })
                try {
                    await signOut()
                } catch (error) {
                    console.error('Logout error:', error)
                }

                // Clear all app data on logout
                clearAllAppData()

                set({
                    isAuthenticated: false,
                    user: null,
                    error: null,
                    isLoading: false,
                })
            },

            /**
             * Check and restore session
             */
            checkSession: async () => {
                try {
                    const session = await authClient.getSession()
                    get().setSession(session.data)
                } catch (error) {
                    console.error('Session check error:', error)
                    set({ isAuthenticated: false, user: null })
                }
            },

            /**
             * Clear error
             */
            clearError: () => {
                set({ error: null })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
)
