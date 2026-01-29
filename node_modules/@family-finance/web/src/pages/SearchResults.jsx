import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchStore } from '@/stores/useSearchStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { filterTransactions } from '@/lib/searchUtils'
import { formatCurrency } from '@/lib/utils'

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const { setSearchQuery } = useSearchStore()
    const { transactions, categories } = useTransactionStore()

    // Update global search store when query changes
    useEffect(() => {
        if (query) {
            setSearchQuery(query)
        }
    }, [query, setSearchQuery])

    // Filter transactions based on query
    const results = filterTransactions(transactions, query)

    // Calculate total
    const totalAmount = results.reduce((sum, t) => sum + t.total_price, 0)

    return (
        <div className="flex-1 flex flex-col min-h-full bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Page Header */}
            <header className="px-4 lg:px-8 pt-8 pb-4 shrink-0">
                <div className="flex flex-col gap-4">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Search Results</span>
                            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span className="text-xs text-slate-400 font-mono">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            Results for "{query}"
                        </h2>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 lg:gap-6 bg-white dark:bg-card-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Found</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{formatCurrency(totalAmount)}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-white/5"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transactions</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{results.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <section className="flex-1 px-4 lg:px-8 py-4 overflow-auto">
                {results.length > 0 ? (
                    <div className="grid gap-3">
                        {results.map((transaction) => {
                            const category = categories.find(c => c.id === transaction.category_id)
                            return (
                                <div
                                    key={transaction.id}
                                    className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-white/5 p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                    {transaction.description}
                                                </span>
                                                {category && (
                                                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                                                        {category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                                                </span>
                                                {transaction.storeName && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">store</span>
                                                            {transaction.storeName}
                                                        </span>
                                                    </>
                                                )}
                                                {transaction.items && transaction.items.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{transaction.items.length} items</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white font-mono shrink-0">
                                            {formatCurrency(transaction.total_price)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">
                            search_off
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            No results found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            We couldn't find any transactions matching "{query}". Try searching with different keywords.
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
