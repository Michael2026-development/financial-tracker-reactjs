
import { formatCurrency } from '@/lib/utils'

const ReviewModal = ({ isOpen, onClose, onSave, items = [], totalAmount = 0 }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-[520px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Review Transaksi</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content Scrollable Area */}
                <div className="px-6 py-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {/* Transaction Items Label */}
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Transaction Items</p>

                    {/* Items List */}
                    {items.length > 0 ? (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors"
                                >
                                    {/* Item Header */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 dark:text-white">{item.name}</h4>
                                            {item.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </p>
                                            <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(item.total)}</p>
                                        </div>
                                    </div>

                                    {/* Item Meta (Date & Location) */}
                                    {(item.date || item.location) && (
                                        <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                                            {item.date && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            )}
                                            {item.location && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span className="material-symbols-outlined text-sm text-rose-500">location_on</span>
                                                    {item.location}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                            <span className="material-symbols-outlined text-5xl mb-3 block">inventory_2</span>
                            <p className="font-medium">No items added yet</p>
                        </div>
                    )}

                    {/* Grand Total Section */}
                    {items.length > 0 && (
                        <div className="mt-6 p-5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Grand Total</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{items.length} item{items.length > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-tight">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    {items.length > 0 && (
                        <div className="mt-6 flex gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                            <div className="flex-shrink-0">
                                <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 block text-lg">info</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">INFO</p>
                                <p className="text-sm text-amber-700 dark:text-amber-500 leading-tight">Transaksi ini akan disimpan ke history Anda.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={onClose}
                        className="px-6 h-11 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={onSave}
                        disabled={items.length === 0}
                        className="px-8 h-11 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                    >
                        Simpan Transaksi
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                }
            `}</style>
        </div>
    )
}

export default ReviewModal
