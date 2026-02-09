import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateSessionId, generateUUID } from '@/lib/utils'

// Mock data for development
const mockCategories = [
    { id: 1, name: 'Makanan', icon: '🛒', color: '#10b981', monthly_budget: 2000000 },
    { id: 2, name: 'Transportasi', icon: '🚗', color: '#f59e0b', monthly_budget: 500000 },
    { id: 3, name: 'Hiburan', icon: '🎮', color: '#8b5cf6', monthly_budget: 300000 },
    { id: 4, name: 'Utilities', icon: '💡', color: '#3b82f6', monthly_budget: 800000 },
    { id: 5, name: 'Kesehatan', icon: '💊', color: '#ef4444', monthly_budget: 400000 },
]

// Empty transactions array for clean testing state
const mockTransactions = []

export const useTransactionStore = create(
    persist(
        (set, get) => ({
            // State
            transactions: mockTransactions,
            categories: mockCategories,
            currentSession: null,
            currentItems: [],
            isReviewModalOpen: false,
            reviewData: null,

            // Actions - Categories
            getCategory: (id) => {
                return get().categories.find(cat => cat.id === id)
            },

            addCategory: (category) => {
                set(state => ({
                    categories: [...state.categories, { ...category, id: Date.now() }]
                }))
            },

            updateCategory: (id, updatedData) => {
                set(state => ({
                    categories: state.categories.map(cat =>
                        cat.id === id ? { ...cat, ...updatedData } : cat
                    )
                }))
            },

            deleteCategory: (id) => {
                set(state => ({
                    categories: state.categories.filter(cat => cat.id !== id)
                }))
            },

            getCategorySpent: (categoryId) => {
                const transactions = get().transactions
                const now = new Date()
                const currentMonth = now.getMonth()
                const currentYear = now.getFullYear()

                return transactions
                    .filter(t => {
                        const tDate = new Date(t.transaction_date)
                        return t.category_id === categoryId &&
                            tDate.getMonth() === currentMonth &&
                            tDate.getFullYear() === currentYear
                    })
                    .reduce((sum, t) => sum + t.total_price, 0)
            },

            // Actions - Transactions
            startNewSession: () => {
                set({
                    currentSession: generateSessionId(),
                    currentItems: []
                })
            },

            addItemToSession: (item) => {
                set(state => ({
                    currentItems: [
                        ...state.currentItems,
                        {
                            ...item,
                            product_number: state.currentItems.length + 1,
                            total_price: item.quantity * item.unit_price
                        }
                    ]
                }))
            },

            removeItemFromSession: (index) => {
                set(state => ({
                    currentItems: state.currentItems
                        .filter((_, i) => i !== index)
                        .map((item, i) => ({ ...item, product_number: i + 1 }))
                }))
            },

            clearSession: () => {
                set({
                    currentSession: null,
                    currentItems: []
                })
            },

            // Calculate session total
            getSessionTotal: () => {
                return get().currentItems.reduce((sum, item) => sum + item.total_price, 0)
            },

            // Review Modal
            openReviewModal: (categoryId) => {
                const category = get().getCategory(categoryId)
                const currentSpent = get().getCategorySpent(categoryId)
                const sessionTotal = get().getSessionTotal()
                const projectedTotal = currentSpent + sessionTotal
                const budget = category?.monthly_budget || 0

                let status = 'SAFE'
                if (projectedTotal > budget) status = 'DANGER'
                else if (projectedTotal > budget * 0.8) status = 'WARNING'

                set({
                    isReviewModalOpen: true,
                    reviewData: {
                        category,
                        currentSpent,
                        sessionTotal,
                        projectedTotal,
                        remaining: budget - projectedTotal,
                        percentageUsed: budget > 0 ? (projectedTotal / budget) * 100 : 0,
                        status
                    }
                })
            },

            closeReviewModal: () => {
                set({ isReviewModalOpen: false, reviewData: null })
            },

            // Save Transaction
            saveTransaction: (categoryId, date) => {
                const state = get()
                const newTransaction = {
                    id: generateUUID(),
                    session_id: state.currentSession,
                    category_id: categoryId,
                    description: state.currentItems.length === 1
                        ? state.currentItems[0].description
                        : `${state.currentItems.length} items`,
                    quantity: 1,
                    unit_price: state.getSessionTotal(),
                    total_price: state.getSessionTotal(),
                    transaction_date: date,
                    items: [...state.currentItems]
                }

                set(s => ({
                    transactions: [newTransaction, ...s.transactions],
                    currentSession: null,
                    currentItems: [],
                    isReviewModalOpen: false,
                    reviewData: null
                }))

                return newTransaction
            },

            // Add Transaction (from Add Transaction page)
            addTransaction: (transaction) => {
                set(state => ({
                    transactions: [transaction, ...state.transactions]
                }))
            },

            // Stats
            getMonthlyStats: () => {
                const transactions = get().transactions
                const now = new Date()
                const currentMonth = now.getMonth()
                const currentYear = now.getFullYear()

                const monthlyTransactions = transactions.filter(t => {
                    const tDate = new Date(t.transaction_date)
                    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
                })

                const totalExpense = monthlyTransactions.reduce((sum, t) => sum + t.total_price, 0)

                // Mock income for demo
                const totalIncome = 8000000

                return {
                    totalIncome,
                    totalExpense,
                    balance: totalIncome - totalExpense,
                    transactionCount: monthlyTransactions.length
                }
            },

            getRecentTransactions: (limit = 5) => {
                return get().transactions.slice(0, limit)
            },

            // Reset all data to clean state
            resetAllData: () => {
                set({
                    transactions: [],
                    currentSession: null,
                    currentItems: [],
                    isReviewModalOpen: false,
                    reviewData: null
                })
            },

            // Delete a single item from a transaction
            deleteItemFromTransaction: (transactionId, itemIndex) => {
                set(state => ({
                    transactions: state.transactions.map(t => {
                        if (t.id === transactionId) {
                            const newItems = t.items.filter((_, idx) => idx !== itemIndex)

                            // If no items left, mark transaction for deletion
                            if (newItems.length === 0) {
                                return null
                            }

                            // Recalculate total
                            const newTotal = newItems.reduce((sum, item) => sum + (item.total_price || item.total || 0), 0)

                            return {
                                ...t,
                                items: newItems,
                                total_price: newTotal,
                                unit_price: newTotal,
                                description: newItems.length === 1
                                    ? newItems[0].name || newItems[0].description
                                    : `Multiple items (${newItems.length})`
                            }
                        }
                        return t
                    }).filter(Boolean) // Remove null transactions
                }))
            },

            // Delete a single transaction
            deleteTransaction: (id) => {
                set(state => ({
                    transactions: state.transactions.filter(t => t.id !== id)
                }))
            }
        }),
        {
            name: 'transaction-storage', // unique name for localStorage key
            partialize: (state) => ({
                transactions: state.transactions,
                categories: state.categories
            })
        }
    )
)
