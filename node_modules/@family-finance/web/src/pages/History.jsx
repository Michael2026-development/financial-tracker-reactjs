import { useState } from 'react'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { filterTransactions } from '@/lib/searchUtils'
import HistoryFilters from '@/components/history/HistoryFilters'
import HistoryTable from '@/components/history/HistoryTable'

export default function History() {
    const { transactions, categories } = useTransactionStore()
    const { searchQuery } = useSearchStore()
    const [categoryFilter, setCategoryFilter] = useState('All Categories')
    const [dateFilter, setDateFilter] = useState('This Month')

    // Helper function to get date range
    const getDateRange = (filter) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        if (filter === 'This Month') {
            return { start: startOfMonth, end: endOfMonth }
        } else if (filter === 'Last Month') {
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
            return { start: lastMonthStart, end: lastMonthEnd }
        } else if (filter === 'Last 3 Months') {
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
            return { start: threeMonthsAgo, end: endOfMonth }
        }
        return { start: new Date(0), end: new Date() }
    }

    // CSV Export function
    const handleExportCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Amount', 'Items']
        const rows = filteredTransactions.map(t => {
            const category = categories.find(c => c.id === t.category_id)
            const itemsCount = t.items?.length || 0
            return [
                t.transaction_date,
                t.description,
                category?.name || 'N/A',
                t.total_price,
                itemsCount
            ]
        })

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Filter logic - now uses global search
    const filteredTransactions = transactions.filter(transaction => {
        // Category filter
        let matchesCategory = true
        if (categoryFilter !== 'All Categories') {
            const category = categories.find(c => c.name === categoryFilter)
            matchesCategory = category && transaction.category_id === category.id
        }

        // Date filter
        const dateRange = getDateRange(dateFilter)
        const transactionDate = new Date(transaction.transaction_date)
        const matchesDate = transactionDate >= dateRange.start && transactionDate <= dateRange.end

        return matchesCategory && matchesDate
    })

    // Apply global search filter
    const searchFilteredTransactions = filterTransactions(filteredTransactions, searchQuery)

    return (
        <div className="flex-1 flex flex-col min-h-full bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Page Header */}
            <header className="px-4 lg:px-8 pt-8 pb-4 shrink-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Archive</span>
                            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction History Settings</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Transaction History</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">Advanced audit trail of all verified household financial movements and session logs.</p>
                    </div>

                    {/* Quick Stats Header */}
                    <div className="flex items-center gap-3 lg:gap-6 bg-white dark:bg-card-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Volume</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{formatCurrency(searchFilteredTransactions.reduce((s, t) => s + t.total_price, 0))}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-white/5"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Record Count</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{searchFilteredTransactions.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters Bar */}
            <HistoryFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onExportCSV={handleExportCSV}
                categories={categories}
            />

            {/* Content Area */}
            <section className="flex-1 px-4 lg:px-8 py-4 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                    <HistoryTable transactions={searchFilteredTransactions} />
                </div>
            </section>

            {/* Micro Footer */}
            <footer className="px-8 py-4 flex items-center justify-between opacity-50 border-t border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest">End of History Stream</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Last Sync: {new Date().toLocaleTimeString()}</span>
            </footer>
        </div>
    )
}

import { formatCurrency } from '@/lib/utils'
