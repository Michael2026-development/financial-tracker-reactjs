import { useState, useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency } from '@/lib/utils'
import clsx from 'clsx'

const PERIODS = [
    { id: 'today', label: 'HARI INI', days: 0 },
    { id: 'week', label: 'MINGGU', days: 7 },
    { id: 'month', label: 'BULAN', days: 30 },
    { id: '3months', label: '3 BULAN', days: 90 }
]

// Neon color mapping for categories
const NEON_COLORS = ['#00f3ff', '#ff007f', '#0d59f2', '#00f3ff', '#ff007f']

// Helper to format date in Indonesian
const formatDateIndo = (dateStr) => {
    const date = new Date(dateStr)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return { formatted: `${day} ${month} ${year}`, dayName }
}

export default function Reports() {
    const [selectedPeriod, setSelectedPeriod] = useState('month')

    // Use API hooks instead of local store
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactions()
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

    const transactions = transactionsData || []
    const categories = categoriesData || []

    // Filter transactions by selected period
    // eslint-disable-next-line
    const filteredTransactions = useMemo(() => {
        const now = new Date()
        now.setHours(23, 59, 59, 999)

        const period = PERIODS.find(p => p.id === selectedPeriod)

        return transactions.filter(t => {
            const tDate = new Date(t.transactionDate) // camelCase

            if (selectedPeriod === 'today') {
                const today = new Date()
                return tDate.toDateString() === today.toDateString()
            }

            const startDate = new Date(now)
            startDate.setDate(startDate.getDate() - period.days)
            startDate.setHours(0, 0, 0, 0)

            return tDate >= startDate && tDate <= now
        }).sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    }, [transactions, selectedPeriod])

    // Calculate total expenses for the period
    const totalExpenses = useMemo(() => {
        return filteredTransactions.reduce((sum, t) => sum + t.totalPrice, 0) // camelCase
    }, [filteredTransactions])

    // Group transactions by date
    const groupedTransactions = useMemo(() => {
        const groups = {}

        filteredTransactions.forEach(t => {
            const dateKey = t.transactionDate // camelCase
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].push(t)
        })

        return Object.entries(groups).map(([date, txns]) => ({
            date,
            ...formatDateIndo(date),
            transactions: txns,
            dayTotal: txns.reduce((sum, t) => sum + t.totalPrice, 0) // camelCase
        }))
    }, [filteredTransactions])

    // Get category by ID with neon color
    const getCategory = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId) || { name: 'Uncategorized', icon: '📦', color: '#94a3b8' }
        return {
            ...cat,
            neonColor: NEON_COLORS[categoryId % NEON_COLORS.length]
        }
    }

    if (transactionsLoading || categoriesLoading) {
        return (
            <div className="px-4 lg:px-8 pt-8 pb-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 lg:px-8 pt-8 pb-4 shrink-0">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Archive</span>
                        <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Report</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Laporan Keuangan</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">Analisis pengeluaran berdasarkan periode waktu.</p>
                </div>
            </header>

            {/* Period Selector Tabs */}
            <div className="px-0 py-2">
                <div className="flex glass-card rounded-xl p-1 justify-between">
                    {PERIODS.map(period => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={clsx(
                                "flex flex-col items-center justify-center py-2 flex-1 rounded-lg transition-all",
                                selectedPeriod === period.id
                                    ? "bg-primary text-white neon-glow-primary"
                                    : "text-slate-500 dark:text-[#90a4cb] hover:bg-slate-100 dark:hover:bg-white/5"
                            )}
                        >
                            <p className="text-xs font-bold tracking-wider">{period.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Total Spending Section */}
            <div className="py-6">
                <div className="flex flex-col gap-1 mb-4">
                    <p className="text-slate-500 dark:text-[#90a4cb] text-sm font-medium uppercase tracking-widest">
                        Total Pengeluaran {selectedPeriod === 'week' ? 'Mingguan' : selectedPeriod === 'today' ? 'Hari Ini' : selectedPeriod === '3months' ? '3 Bulan' : 'Bulanan'}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold">
                            {formatCurrency(totalExpenses)}
                        </p>
                        <span className="text-sm font-medium text-primary dark:text-[#00f3ff]">
                            {filteredTransactions.length} transaksi
                        </span>
                    </div>
                </div>
            </div>

            {/* Grouped Transaction List */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                        Aktivitas Terbaru
                    </h3>
                </div>

                <div className="flex flex-col gap-3">
                    {groupedTransactions.length > 0 ? (
                        groupedTransactions.flatMap(group =>
                            group.transactions.map((txn) => {
                                const category = getCategory(txn.categoryId) // camelCase
                                return (
                                    <div key={txn.id} className="flex items-center justify-between glass-card p-4 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="size-12 rounded-xl flex items-center justify-center text-lg border"
                                                style={{
                                                    backgroundColor: `${category.neonColor}20`,
                                                    color: category.neonColor,
                                                    borderColor: `${category.neonColor}30`
                                                }}
                                            >
                                                {category.icon}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-bold">{txn.description}</p>
                                                <p className="text-slate-500 dark:text-[#90a4cb] text-xs">
                                                    {formatDateIndo(txn.transactionDate).formatted} • {category.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-900 dark:text-white font-bold">-{formatCurrency(txn.totalPrice)}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div className="text-center py-16 glass-card rounded-2xl">
                            <div className="size-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-[#90a4cb]">receipt_long</span>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white mb-1">Tidak ada transaksi</p>
                            <p className="text-sm text-slate-500 dark:text-[#90a4cb]">
                                Belum ada pengeluaran untuk periode ini
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
