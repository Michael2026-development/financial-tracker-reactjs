import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { revokeImagePreview } from '@/services/receiptScanner'
import clsx from 'clsx'

const ScanConfirmModal = ({ isOpen, onClose, scanData, onConfirm }) => {
    const [items, setItems] = useState([])
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        if (scanData?.items) {
            setItems(scanData.items)
        }
    }, [scanData])

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
        onConfirm(items)
        onClose()
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <header className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Confirm Scanned Items</h3>
                                {scanData?.aiProvider && (
                                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                                        {scanData.aiProvider}
                                    </span>
                                )}
                                {scanData?.confidence && (
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                                        scanData.confidence >= 0.8 ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                    )}>
                                        {Math.round(scanData.confidence * 100)}% Confident
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Review and edit items from {scanData?.storeName || 'receipt'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Receipt Preview */}
                        {scanData?.imagePreview && (
                            <div className="lg:w-48 shrink-0">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Receipt Preview</p>
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-border-dark">
                                    <img
                                        src={scanData.imagePreview}
                                        alt="Receipt"
                                        className="w-full h-auto max-h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                Extracted Items ({items.length})
                            </p>

                            {items.length > 0 ? (
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={clsx(
                                                "p-4 rounded-xl border transition-all",
                                                editingId === item.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-slate-900/50"
                                            )}
                                        >
                                            {editingId === item.id ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-border-dark text-sm focus:ring-2 focus:ring-primary outline-none"
                                                        placeholder="Item name"
                                                    />
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                                            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-border-dark text-sm focus:ring-2 focus:ring-primary outline-none"
                                                            placeholder="Qty"
                                                            min="1"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                                                            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-border-dark text-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                                                            placeholder="Price"
                                                        />
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {item.quantity} × {formatCurrency(item.price)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                                                            {formatCurrency(item.total)}
                                                        </span>
                                                        <button
                                                            onClick={() => setEditingId(item.id)}
                                                            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                                    <p>No items to add</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="p-6 border-t border-slate-200 dark:border-border-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount:</span>
                        <span className="text-xl font-black text-primary font-mono">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={items.length === 0}
                            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Add All Items ({items.length})
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ScanConfirmModal
