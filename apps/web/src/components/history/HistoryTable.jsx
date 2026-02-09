import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { useCategories } from '@/hooks/useCategories'
import { useDeleteTransaction, useDeleteTransactionItem } from '@/hooks/useTransactions'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'
import clsx from 'clsx'

const HistoryTableRow = ({ transaction, categories = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, itemId: null, itemData: null })

    const deleteTransaction = useDeleteTransaction()
    const deleteItem = useDeleteTransactionItem()

    const getCategory = (id) => categories.find(cat => cat.id === id)
    // Use camelCase: categoryId from API
    const category = getCategory(transaction.categoryId)
    const isIncome = transaction.categoryId === 'income' || (category && category.name === 'Income')

    // Use camelCase: transactionDate from API
    const dateObj = new Date(transaction.transactionDate)
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const amountClass = isIncome ? "text-emerald-500" : "text-rose-500"
    const amountPrefix = isIncome ? "+" : "-"

    const handleDeleteConfirm = async () => {
        try {
            if (deleteModal.type === 'transaction') {
                await deleteTransaction.mutateAsync(transaction.id)
            } else if (deleteModal.type === 'item') {
                await deleteItem.mutateAsync({
                    transactionId: transaction.id,
                    itemId: deleteModal.itemId
                })
            }
        } catch (error) {
            console.error('Delete failed:', error)
        }
        setDeleteModal({ isOpen: false, type: null, itemId: null, itemData: null })
    }

    return (
        <>
            <tr
                onClick={() => setIsExpanded(!isExpanded)}
                className={clsx(
                    "group transition-all duration-200 border-b border-slate-100 dark:border-white/5 cursor-pointer",
                    isExpanded ? "bg-slate-50/80 dark:bg-white/[0.03]" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                )}
            >
                <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{dateStr}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">Session #{transaction.id.toString().slice(-6)}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-3.5">
                        <div className={clsx(
                            "size-10 rounded-xl flex shrink-0 items-center justify-center shadow-sm transition-transform group-hover:scale-110 text-xl",
                            isIncome ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10"
                        )}>
                            {category?.icon || (isIncome ? '💰' : '🛒')}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{transaction.description}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{transaction.items?.length || 0} items attached</span>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={clsx(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight inline-flex items-center gap-1.5",
                        isIncome ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    )}>
                        <span className="size-1.5 rounded-full bg-current"></span>
                        {category?.name || (isIncome ? 'Income' : 'General')}
                    </span>
                </td>
                {/* Use camelCase: totalPrice from API */}
                <td className={clsx("px-6 py-5 text-right whitespace-nowrap", amountClass)}>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black font-mono tracking-tight">{amountPrefix}{formatCurrency(transaction.totalPrice)}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">Transacted</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-right w-12">
                    <div className={clsx(
                        "size-8 rounded-lg flex items-center justify-center text-slate-400 transition-all",
                        isExpanded ? "rotate-180 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white" : "group-hover:bg-slate-100 dark:group-hover:bg-white/5"
                    )}>
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                    </div>
                </td>
            </tr>

            {isExpanded && (
                <tr className="bg-slate-50/50 dark:bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <td colSpan="5" className="px-6 py-6 border-b border-slate-200 dark:border-white/5">
                        <div className="pl-14 pr-6">
                            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 group-hover:bg-white/5 dark:bg-white/[0.02] flex items-center justify-between">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Transaction Details Log</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-[10px] font-bold text-slate-400">Verified</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteModal({
                                                    isOpen: true,
                                                    type: 'transaction',
                                                    itemData: {
                                                        name: `Transaction on ${new Date(transaction.transactionDate).toLocaleDateString('id-ID')}`,
                                                        category: category?.name || 'General',
                                                        price: transaction.totalPrice,
                                                        itemCount: transaction.items?.length || 0
                                                    }
                                                })
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-200 flex items-center gap-1.5 group/delete"
                                            title="Delete Transaction"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            <span className="text-[10px] font-bold">Delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-0">
                                    {transaction.items && transaction.items.length > 0 ? (
                                        <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
                                            {transaction.items.map((item, idx) => (
                                                <div key={item.id || idx} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors items-center group/item">
                                                    <div className="col-span-5 flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.name || 'Item'}</span>
                                                        <span className="text-[10px] text-slate-400 truncate italic">{item.description || 'No description provided'}</span>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {item.date && (
                                                                <span className="text-[10px] text-primary font-bold">📅 {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            )}
                                                            {item.location && (
                                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">📍 {item.location}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 flex justify-center">
                                                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-4 text-right flex flex-col items-end">
                                                        {/* Use camelCase: totalPrice, unitPrice from API */}
                                                        <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{formatCurrency(item.totalPrice || item.total || 0)}</span>
                                                        <span className="text-[10px] text-slate-400">@{formatCurrency(item.unitPrice || item.price || 0)}</span>
                                                    </div>
                                                    <div className="col-span-1 flex justify-end">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const itemTotal = item.totalPrice || item.total || 0
                                                                const newTotal = transaction.totalPrice - itemTotal
                                                                const isLastItem = transaction.items.length === 1

                                                                setDeleteModal({
                                                                    isOpen: true,
                                                                    type: 'item',
                                                                    itemId: item.id,
                                                                    itemData: {
                                                                        name: item.name || 'Item',
                                                                        price: itemTotal,
                                                                        quantity: item.quantity,
                                                                        newTotal: isLastItem ? null : newTotal,
                                                                        isLastItem
                                                                    }
                                                                })
                                                            }}
                                                            className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-all"
                                                            title="Delete Item"
                                                        >
                                                            <span className="material-symbols-outlined text-base">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-6 py-8 text-center bg-slate-50/50 dark:bg-transparent">
                                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl mb-2">inventory_2</span>
                                            <p className="text-slate-400 italic text-sm">No fine-grained item details found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: null, itemId: null, itemData: null })}
                onConfirm={handleDeleteConfirm}
                title={deleteModal.type === 'transaction' ? 'Delete Transaction?' : 'Delete Item?'}
                itemName={deleteModal.itemData?.name}
                itemDetails={deleteModal.type === 'transaction'
                    ? {
                        category: deleteModal.itemData?.category,
                        price: deleteModal.itemData?.price,
                        itemCount: deleteModal.itemData?.itemCount
                    }
                    : {
                        price: deleteModal.itemData?.price,
                        quantity: deleteModal.itemData?.quantity,
                        newTotal: deleteModal.itemData?.newTotal
                    }
                }
                isLastItem={deleteModal.itemData?.isLastItem}
            />
        </>
    )
}

// Helper function to group transactions by item dates
const groupTransactionsByDate = (transactions) => {
    const grouped = {}

    transactions.forEach(transaction => {
        // If transaction has items with dates, group by item date
        if (transaction.items && transaction.items.length > 0) {
            transaction.items.forEach(item => {
                // Use camelCase: transactionDate from API
                const itemDate = item.date || transaction.transactionDate
                if (!grouped[itemDate]) {
                    grouped[itemDate] = []
                }
                // Check if this transaction is already in the group for this date
                if (!grouped[itemDate].find(t => t.id === transaction.id)) {
                    grouped[itemDate].push(transaction)
                }
            })
        } else {
            // If no items, use transaction date
            const txDate = transaction.transactionDate
            if (!grouped[txDate]) {
                grouped[txDate] = []
            }
            grouped[txDate].push(transaction)
        }
    })

    // Convert to array and sort by date descending
    return Object.entries(grouped)
        .map(([date, txs]) => ({ date, transactions: txs }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default function HistoryTable({ transactions }) {
    const { data: categories } = useCategories()
    const categoryList = categories || []
    const groupedData = groupTransactionsByDate(transactions)

    return (
        <div className="space-y-6">
            {groupedData.length > 0 ? (
                groupedData.map(({ date, transactions: dateTxs }) => (
                    <div key={date} className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                        {/* Date Header */}
                        <div className="px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                    {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {dateTxs.length} transaction{dateTxs.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Transactions Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 w-[15%]">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 w-[40%]">Activity / Description</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 w-[20%]">Tag / Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 text-right w-[20%]">Amount Value</th>
                                        <th className="px-4 py-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {dateTxs.map(t => (
                                        <HistoryTableRow key={t.id} transaction={t} categories={categoryList} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                            <p className="text-sm font-bold italic">No matching transaction records found</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
