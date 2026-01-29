import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/useSearchStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import NotificationDropdown from './NotificationDropdown'
import SearchModal from '@/components/search/SearchModal'

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate()
    const { searchQuery, setSearchQuery, clearSearch } = useSearchStore()
    const { user } = useAuthStore()
    const { getUnreadCount } = useNotificationStore()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const notificationButtonRef = useRef(null)

    const unreadCount = getUnreadCount()

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleClearSearch = () => {
        clearSearch()
    }

    const handleProfileClick = () => {
        navigate('/settings')
    }

    return (
        <header className="h-16 border-b border-slate-200 dark:border-border-dark flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-background-dark shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-lg lg:text-xl font-bold tracking-tight truncate max-w-[150px] sm:max-w-none">
                    Dashboard Overview
                </h2>
            </div>
            <div className="flex items-center gap-3 lg:gap-6">
                {/* Search Bar - Desktop */}
                <div className="relative hidden md:block w-48 lg:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">search</span>
                    <input
                        className="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-lg pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none cursor-pointer"
                        placeholder="Search transactions..."
                        type="text"
                        value={searchQuery}
                        onClick={() => setShowSearchModal(true)}
                        readOnly
                    />
                    {searchQuery && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                clearSearch()
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    {/* Search Button - Mobile */}
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            ref={notificationButtonRef}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 cursor-pointer"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <NotificationDropdown
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                            anchorRef={notificationButtonRef}
                        />
                    </div>

                    {/* Profile */}
                    <button
                        onClick={handleProfileClick}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                        title="Go to Settings"
                    >
                        {user?.name?.substring(0, 2).toUpperCase() || 'MF'}
                    </button>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
            />
        </header>
    )
}

export default Header
