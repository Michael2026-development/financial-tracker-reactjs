import { create } from 'zustand'
import { generateSessionId, generateUUID } from '@/lib/utils'

// Mock data for development
const mockCategories = [
    { id: 1, name: 'Makanan', icon: '🛒', color: '#10b981', monthly_budget: 2000000 },
    { id: 2, name: 'Transportasi', icon: '🚗', color: '#f59e0b', monthly_budget: 500000 },
    { id: 3, name: 'Hiburan', icon: '🎮', color: '#8b5cf6', monthly_budget: 300000 },
    { id: 4, name: 'Utilities', icon: '💡', color: '#3b82f6', monthly_budget: 800000 },
    { id: 5, name: 'Kesehatan', icon: '💊', color: '#ef4444', monthly_budget: 400000 },
]

const mockTransactions = [
    {
        id: generateUUID(),
        session_id: 'STR-2026012301',
        category_id: 1,
        description: 'Belanja Bulanan',
        quantity: 1,
        unit_price: 450000,
        total_price: 450000,
        transaction_date: '2026-01-23',
        items: [
            { product_number: 1, description: 'Beras 5kg', quantity: 1, unit_price: 75000, total_price: 75000, category: 'Food' },
            { product_number: 2, description: 'Minyak Goreng 2L', quantity: 2, unit_price: 35000, total_price: 70000, category: 'Food' },
            { product_number: 3, description: 'Telur 1kg', quantity: 1, unit_price: 28000, total_price: 28000, category: 'Food' },
        ]
    },
    {
        id: generateUUID(),
        session_id: 'STR-2026012302',
        category_id: 2,
        description: 'Bensin Motor',
        quantity: 1,
        unit_price: 50000,
        total_price: 50000,
        transaction_date: '2026-01-22',
        items: []
    },
    {
        id: generateUUID(),
        session_id: 'STR-2026012001',
        category_id: 1, // Makanan
        description: 'Makan Siang',
        quantity: 1,
        unit_price: 35000,
        total_price: 35000,
        transaction_date: '2026-01-20',
        items: []
    },
    // Adding more transactions to match the visual expectation (~2.25m Food, ~600k Transport)
    {
        id: generateUUID(),
        session_id: 'STR-2026011501',
        category_id: 1, // Makanan
        description: 'Dinner Party',
        quantity: 1,
        unit_price: 1500000,
        total_price: 1500000,
        transaction_date: '2026-01-15',
        items: []
    },
    {
        id: generateUUID(),
        session_id: 'STR-2026011001',
        category_id: 1, // Makanan
        description: 'Groceries Week 2',
        quantity: 1,
        unit_price: 265000,
        total_price: 265000,
        transaction_date: '2026-01-10',
        items: []
    },
    {
        id: generateUUID(),
        session_id: 'STR-2026011801',
        category_id: 2, // Transport
        description: 'Car Service',
        quantity: 1,
        unit_price: 550000,
        total_price: 550000,
        transaction_date: '2026-01-18',
        items: []
    },
    {
        id: generateUUID(),
        session_id: 'STR-2026010501',
        category_id: 3, // Hiburan
        description: 'Console Game',
        quantity: 1,
        unit_price: 850000,
        total_price: 850000,
        transaction_date: '2026-01-05',
        items: []
    },
]

export const useTransactionStore = create((set, get) => ({
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
    }
}))
