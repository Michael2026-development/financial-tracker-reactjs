import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "@/services/api/notifications";

// Query keys
export const notificationKeys = {
    all: ["notifications"],
    list: () => [...notificationKeys.all, "list"],
    unreadCount: () => [...notificationKeys.all, "unread-count"],
};

/**
 * Fetch all notifications
 */
export function useNotifications() {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: getNotifications,
    });
}

/**
 * Fetch unread notification count
 */
export function useUnreadNotificationCount() {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadCount,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

/**
 * Mark a notification as read
 */
export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

/**
 * Delete a notification
 */
export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}
