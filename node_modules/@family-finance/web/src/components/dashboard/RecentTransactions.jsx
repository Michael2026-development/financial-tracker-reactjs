import { Link } from 'react-router-dom'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency } from '@/lib/utils'

const RecentTransactions = () => {
    const { data: transactionsData, isLoading } = useTransactions({ limit: 5 })
    const { data: categoriesData } = useCategories()

    // API returns array directly
    const transactions = Array.isArray(transactionsData) ? transactionsData : []
    const categories = categoriesData || []

    const getCategory = (id) => categories.find(cat => cat.id === id)

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Transactions</h3>
                <Link to="/history" className="text-primary text-sm font-bold hover:underline cursor-pointer">View All History</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-border-dark">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 w-[15%]">Date</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 w-[40%]">Description</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 w-[25%]">Category</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-right w-[20%]">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                        {transactions.length > 0 ? (
                            transactions.map(transaction => {
                                // Use camelCase field names from API
                                const category = getCategory(transaction.categoryId)
                                const isIncome = transaction.categoryId === 'income' || (category && category.name === 'Income')
                                const dateObj = new Date(transaction.transactionDate)
                                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                const amountClass = isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                const amountPrefix = isIncome ? "+" : "-"

                                return (
                                    <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                            {dateStr}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded-lg flex shrink-0 items-center justify-center ${isIncome ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                                                    <span className="material-symbols-outlined text-lg">
                                                        {category?.icon || (isIncome ? 'payments' : 'shopping_basket')}
                                                    </span>
                                                </div>
                                                <span className="truncate max-w-[200px]">{transaction.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase inline-block whitespace-nowrap ${isIncome ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                                                {category?.name || (isIncome ? 'Income' : 'General')}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold font-mono whitespace-nowrap ${amountClass}`}>
                                            {amountPrefix}{formatCurrency(transaction.totalPrice)}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 italic">
                                    No recent transactions
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentTransactions
