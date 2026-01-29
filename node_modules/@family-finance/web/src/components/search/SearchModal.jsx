import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/useSearchStore'
import clsx from 'clsx'

const SEARCH_RECOMMENDATIONS = [
    { id: 1, query: 'Shopping expenses', icon: 'shopping_bag' },
    { id: 2, query: 'Monthly subscriptions', icon: 'subscriptions' },
    { id: 3, query: 'Food and dining', icon: 'restaurant' },
    { id: 4, query: 'Transportation', icon: 'directions_car' },
    { id: 5, query: 'Utilities and bills', icon: 'receipt_long' }
]

const PAGE_NAVIGATION = [
    { name: 'Transactions', icon: 'receipt', path: '/add', value: 'transactions' },
    { name: 'Categories', icon: 'folder', path: '/categories', value: 'categories' },
    { name: 'History', icon: 'history', path: '/history', value: 'history' }
]

const SearchModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const modalRef = useRef(null)
    const inputRef = useRef(null)
    const { searchQuery, setSearchQuery } = useSearchStore()
    const [localQuery, setLocalQuery] = useState('')

    // Sync local query with global search query when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalQuery(searchQuery)
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }, [isOpen, searchQuery])

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    const handleSearch = () => {
        if (localQuery.trim()) {
            setSearchQuery(localQuery)
            navigate(`/search?q=${encodeURIComponent(localQuery)}`)
            onClose()
        }
    }

    const handleRecommendationClick = (query) => {
        setLocalQuery(query)
        setSearchQuery(query)
        navigate(`/search?q=${encodeURIComponent(query)}`)
        onClose()
    }

    const handlePageNavigation = (path) => {
        navigate(path)
        onClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-[#1a1f35] rounded-3xl shadow-2xl border-2 border-primary/50 animate-in slide-in-from-top-4 duration-300"
            >
                {/* Search Input */}
                <div className="p-6 pb-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
                            search
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search transactions..."
                            className="w-full bg-transparent border-2 border-primary/40 rounded-2xl pl-14 pr-6 py-4 text-white text-lg placeholder:text-slate-500 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="px-6 pb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Navigation</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {PAGE_NAVIGATION.map((page) => (
                            <button
                                key={page.value}
                                onClick={() => handlePageNavigation(page.path)}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-primary hover:text-white border border-slate-700/50 hover:border-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-2xl">{page.icon}</span>
                                <span className="text-sm font-medium">{page.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Recommendations */}
                <div className="px-6 pb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Search Recommendations</h3>
                    <div className="space-y-2">
                        {SEARCH_RECOMMENDATIONS.map((recommendation) => (
                            <button
                                key={recommendation.id}
                                onClick={() => handleRecommendationClick(recommendation.query)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 text-white transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">
                                        {recommendation.icon}
                                    </span>
                                    <span className="text-sm font-medium">{recommendation.query}</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 transition-colors">
                                    arrow_forward
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!localQuery.trim()}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchModal
