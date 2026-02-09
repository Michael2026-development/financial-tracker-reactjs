import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { revokeImagePreview } from '@/services/receiptScanner'
import { useCategories } from '@/hooks/useCategories'
import clsx from 'clsx'

const ScanConfirmModal = ({ isOpen, onClose, scanData, onConfirm }) => {
    const [items, setItems] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const { data: categoriesData } = useCategories()
    const categories = categoriesData || []

    useEffect(() => {
        if (scanData?.items) {
            setItems(scanData.items)
        }
        // Set default category to first available
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id)
        }
    }, [scanData, categories, selectedCategory])

    // Cleanup preview URL when modal closes
    useEffect(() => {
        return () => {
            if (scanData?.imagePreview) {
                revokeImagePreview(scanData.imagePreview)
            }
        }
    }, [scanData])

    if (!isOpen) return null

    const handleItemChange = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value }
                // Recalculate total if price or quantity changed
                if (field === 'price' || field === 'quantity') {
                    updated.total = Number(updated.price) * Number(updated.quantity)
                }
                return updated
            }
            return item
        }))
    }

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleConfirm = () => {
        // Apply selected category to all items
        const itemsWithCategory = items.map(item => ({
            ...item,
            category: selectedCategory
        }))
        onConfirm(itemsWithCategory)
        onClose()
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container - Mobile Card Style */}
            <div className="relative w-full max-w-[430px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5">

                {/* Header */}
                <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-4 flex items-center">
                    <button
                        onClick={onClose}
                        className="size-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1 text-center pr-8">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Scanned Items</h1>
                    </div>
                </header>

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* Receipt Preview Section */}
                    {scanData?.imagePreview && (
                        <section className="p-5 pb-2">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Receipt Preview</h3>
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                                    {scanData?.confidence ? `${Math.round(scanData.confidence * 100)}% Match` : 'Scanned'}
                                </span>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 group">
                                <div className="h-[240px] w-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800/50">
                                    <img
                                        src={scanData.imagePreview}
                                        alt="Receipt Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </section>
                    )}

                    {/* Extracted Items Section */}
                    <section className="p-5 pt-2 pb-44">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Extracted Items ({items.length})</h3>
                        </div>

                        <div className="space-y-3">
                            {items.length > 0 ? items.map((item) => (
                                <div
                                    key={item.id}
                                    className={clsx(
                                        "p-4 rounded-2xl border transition-all duration-200",
                                        editingId === item.id
                                            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 ring-1 ring-indigo-500/20"
                                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50"
                                    )}
                                >
                                    {editingId === item.id ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name</label>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="Item name"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                                                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-1">
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(item.total)}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setEditingId(item.id)}
                                                        className="p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit_square</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2"> receipt_long </span>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm">No items found.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer - Fixed at bottom */}
                <footer className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 pb-8">
                    <div className="flex items-center justify-between mb-5 px-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full ring-1 ring-emerald-100 dark:ring-emerald-900/30">
                                Scanned Successfully
                            </span>
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">
                        {/* Category Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-1">
                                Category for All Items
                            </label>
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.25rem'
                                }}
                            >
                                <option value="" disabled>Select a category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!selectedCategory || items.length === 0}
                            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Add All Items ({items.length})
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            Discard Selection
                        </button>
                    </div>
                </footer>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                }
            `}</style>
        </div>
    )
}

export default ScanConfirmModal
