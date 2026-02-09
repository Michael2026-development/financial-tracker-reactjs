import api from "./client";
import { formatCurrency } from "@/lib/utils";

/**
 * Notifications API Service - Client-Side Implementation
 * Generates notifications from existing data instead of backend API
 */

/**
 * Get all notifications for the authenticated user
 * Generates notifications based on categories, transactions, and budget status
 */
export async function getNotifications() {
    try {
        // Fetch transactions and categories from existing APIs
        const [transactionsRes, categoriesRes] = await Promise.all([
            api.get("/transactions"),
            api.get("/categories")
        ]);

        const transactions = transactionsRes || [];
        const categories = categoriesRes || [];

        const notifications = [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Get dismissed notifications from localStorage
        const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');

        // 1. Welcome notification (only if no transactions)
        if (transactions.length === 0) {
            const welcomeId = 'welcome-tip';
            notifications.push({
                id: welcomeId,
                title: 'Welcome to Family Finance Tracker! 👋',
                message: 'Start tracking your expenses to stay on budget and reach your financial goals.',
                icon: 'info',
                type: 'tip',
                read: dismissed.includes(welcomeId),
                createdAt: new Date().toISOString(),
                priority: 10
            });
        }

        // 2. Recent transaction notifications (last 7 days instead of just today)
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentTransactions = transactions
            .filter(t => {
                const tDate = new Date(t.transactionDate);
                return tDate >= sevenDaysAgo;
            })
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

        recentTransactions.slice(0, 10).forEach(txn => {
            const notifId = `txn-${txn.id}`;
            const category = categories.find(c => c.id === txn.categoryId);

            // Calculate how long ago
            const txnDate = new Date(txn.transactionDate);
            const daysAgo = Math.floor((now - txnDate) / (1000 * 60 * 60 * 24));
            const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

            notifications.push({
                id: notifId,
                title: `💰 Transaction: ${txn.description}`,
                message: `${formatCurrency(txn.totalPrice)}${category ? ` in ${category.name}` : ''} • ${timeLabel}`,
                icon: 'receipt',
                type: 'transaction',
                read: dismissed.includes(notifId),
                createdAt: txn.transactionDate,
                priority: daysAgo === 0 ? 60 : 50 - daysAgo // Today's transactions get higher priority
            });
        });

        // 3. Budget alerts - fetch spent for each category
        for (const category of categories) {
            try {
                const spentRes = await api.get(`/categories/${category.id}/spent`);
                const spent = spentRes?.spent || 0;
                const percentage = category.monthlyBudget > 0
                    ? Math.round((spent / category.monthlyBudget) * 100)
                    : 0;

                // Over limit alert
                if (spent > category.monthlyBudget) {
                    const notifId = `budget-over-${category.id}`;
                    const overspent = spent - category.monthlyBudget;
                    notifications.push({
                        id: notifId,
                        title: `⚠️ Budget Alert: ${category.name}`,
                        message: `You've exceeded your budget by ${formatCurrency(overspent)}. Current spending: ${formatCurrency(spent)} / ${formatCurrency(category.monthlyBudget)}`,
                        icon: 'error',
                        type: 'budget_over',
                        read: dismissed.includes(notifId),
                        createdAt: new Date().toISOString(),
                        priority: 100
                    });
                }
                // Near limit warning (80-100%)
                else if (percentage >= 80) {
                    const notifId = `budget-near-${category.id}`;
                    notifications.push({
                        id: notifId,
                        title: `⚠️ Almost There: ${category.name}`,
                        message: `You're at ${percentage}% of your monthly budget. ${formatCurrency(category.monthlyBudget - spent)} remaining.`,
                        icon: 'warning',
                        type: 'budget_warning',
                        read: dismissed.includes(notifId),
                        createdAt: new Date().toISOString(),
                        priority: 80
                    });
                }
            } catch (err) {
                console.error(`Failed to fetch spent for category ${category.id}:`, err);
            }
        }

        // Sort by priority (highest first) then by date (newest first)
        return notifications.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    } catch (error) {
        console.error('Failed to generate notifications:', error);
        return [];
    }
}

/**
 * Get count of unread notifications
 */
export async function getUnreadCount() {
    const notifications = await getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    return { count: unreadCount };
}

/**
 * Mark a notification as read
 * @param {string} id - Notification ID
 */
export async function markAsRead(id) {
    const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
    if (!dismissed.includes(id)) {
        dismissed.push(id);
        localStorage.setItem('dismissedNotifications', JSON.stringify(dismissed));
    }
    return { success: true };
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
    const notifications = await getNotifications();
    const allIds = notifications.map(n => n.id);
    localStorage.setItem('dismissedNotifications', JSON.stringify(allIds));
    return { success: true };
}

/**
 * Delete a notification (dismiss it permanently)
 * @param {string} id - Notification ID
 */
export async function deleteNotification(id) {
    await markAsRead(id);
    return { success: true };
}
