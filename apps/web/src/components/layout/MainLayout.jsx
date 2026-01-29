import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setIsSidebarOpen(false)

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 h-full overflow-hidden">
                {/* Top Navbar */}
                <Header onMenuClick={toggleSidebar} />

                {/* Content */}
                <div className="flex-1 overflow-y-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
