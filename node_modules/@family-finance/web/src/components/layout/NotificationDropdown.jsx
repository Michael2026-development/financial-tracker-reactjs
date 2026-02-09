import { useRef, useEffect } from 'react'
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '@/hooks/useNotifications'
import clsx from 'clsx'

const NotificationDropdown = ({ isOpen, onClose, anchorRef }) => {
    const dropdownRef = useRef(null)
    const { data: notifications, isLoading } = useNotifications()
    const markAllAsRead = useMarkAllAsRead()
    const markAsRead = useMarkAsRead()

    const notificationList = notifications || []

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target)
            ) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose, anchorRef])

    const unreadCount = notificationList.filter(n => !n.read).length

    const handleMarkAllRead = () => {
        markAllAsRead.mutate() // Will auto-refetch via query invalidation
    }

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead.mutate(notification.id)
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#1a1f35] border border-slate-700/50 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between bg-[#1a1f35]">
                <h3 className="font-bold text-white text-sm">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-3">
                                <div className="size-10 bg-slate-700 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notificationList.length > 0 ? (
                    notificationList.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={clsx(
                                "px-4 py-3 border-b border-slate-700/30 last:border-0 hover:bg-white/5 transition-all cursor-pointer relative",
                                !notification.read && "bg-primary/10 border-l-4 border-l-primary"
                            )}
                        >
                            <div className="flex gap-3">
                                <div className={clsx(
                                    "size-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
                                    !notification.read
                                        ? "bg-primary/30 text-primary ring-2 ring-primary/50"
                                        : "bg-slate-700/50 text-slate-400"
                                )}>
                                    <span className="material-symbols-outlined text-xl">{notification.icon || 'notifications'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <p className={clsx(
                                            "font-bold text-sm",
                                            !notification.read ? "text-white" : "text-slate-300"
                                        )}>
                                            {notification.title}
                                        </p>
                                        {!notification.read && (
                                            <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5 animate-pulse"></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-1.5">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : notification.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                        <p className="text-sm">No notifications</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-700/50 text-center bg-[#1a1f35]">
                <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    View all notifications
                </button>
            </div>
        </div>
    )
}

export default NotificationDropdown
