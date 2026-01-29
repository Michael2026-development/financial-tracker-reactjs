import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Demo credentials
const DEMO_EMAIL = 'demo@familyfinance.com'
const DEMO_PASSWORD = 'password123'

export const useAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            error: null,

            // Login function
            login: (email, password) => {
                // Simple demo authentication
                if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
                    set({
                        isAuthenticated: true,
                        user: {
                            email,
                            name: 'Michael Frans',
                            avatar: null
                        },
                        error: null
                    })
                    return { success: true }
                } else {
                    set({ error: 'Invalid email or password' })
                    return { success: false, error: 'Invalid email or password' }
                }
            },

            // Logout function
            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    error: null
                })
            },

            // Clear error
            clearError: () => {
                set({ error: null })
            }
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user
            })
        }
    )
)
