import { create } from 'zustand'

const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'New transaction added',
        message: 'Shopping at Supermarket ABC - Rp 750,000',
        time: '5 minutes ago',
        read: false,
        icon: 'shopping_cart'
    },
    {
        id: 2,
        title: 'Budget alert',
        message: 'You have reached 80% of your monthly budget',
        time: '2 hours ago',
        read: false,
        icon: 'error'
    },
    {
        id: 3,
        title: 'Receipt scanned',
        message: 'Successfully scanned 3 items from your receipt',
        time: '1 day ago',
        read: true,
        icon: 'check_circle'
    },
    {
        id: 4,
        title: 'Expense report ready',
        message: 'Your weekly expense report is ready to view',
        time: '2 days ago',
        read: true,
        icon: 'description'
    }
]

export const useNotificationStore = create((set, get) => ({
    notifications: INITIAL_NOTIFICATIONS,

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),

    getUnreadCount: () => {
        const state = get()
        return state.notifications.filter(n => !n.read).length
    }
}))
