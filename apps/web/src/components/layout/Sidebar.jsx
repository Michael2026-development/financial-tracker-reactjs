import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import clsx from 'clsx'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuthStore()

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <>
            {/* Backdrop Overlay for Mobile */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold leading-none text-slate-900 dark:text-white">Family Finance</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Home Budget Tracker</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive('/')
                                ? "bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined" style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/add"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive('/add')
                                ? "bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined" style={isActive('/add') ? { fontVariationSettings: "'FILL' 1" } : {}}>receipt_long</span>
                        <span className="text-sm font-medium">Transactions</span>
                    </Link>

                    <Link
                        to="/history"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive('/history')
                                ? "bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined" style={isActive('/history') ? { fontVariationSettings: "'FILL' 1" } : {}}>history</span>
                        <span className="text-sm font-medium">History</span>
                    </Link>

                    <Link
                        to="/categories"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive('/categories')
                                ? "bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined" style={isActive('/categories') ? { fontVariationSettings: "'FILL' 1" } : {}}>category</span>
                        <span className="text-sm font-medium">Categories</span>
                    </Link>

                    <Link
                        to="/reports"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive('/reports')
                                ? "bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined" style={isActive('/reports') ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
                        <span className="text-sm font-medium">Reports</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-200 dark:border-border-dark">
                    <Link
                        to="/settings"
                        onClick={onClose}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive('/settings')
                                ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>

                    {/* User Account Section */}
                    <div className="mt-4 flex items-center gap-2 px-2.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5">
                        <div className="size-9 rounded-full bg-gradient-to-br from-primary via-purple-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                            MF
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Michael Frans'}</span>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary text-white shrink-0">ADMIN</span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'demo@familyfinance.com'}</span>
                        </div>
                        <button
                            onClick={() => {
                                logout()
                                navigate('/login')
                                onClose()
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer shrink-0"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-[20px]">exit_to_app</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
