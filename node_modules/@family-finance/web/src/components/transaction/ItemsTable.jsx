import { useState } from 'react'
import { formatCurrency } from "@/lib/utils"

const EditItemModal = ({ item, isOpen, onClose, onSave }) => {
    const [editedItem, setEditedItem] = useState(item)

    const handleChange = (field, value) => {
        const updated = { ...editedItem, [field]: value }

        // Recalculate total if price or quantity changed
        if (field === 'price' || field === 'quantity') {
            updated.total = Number(updated.price) * Number(updated.quantity)
        }

        setEditedItem(updated)
    }

    const handleSave = () => {
        onSave(editedItem)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                    <h3 className="font-bold text-lg">Edit Item</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Item Name</label>
                        <input
                            type="text"
                            value={editedItem.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Description</label>
                        <input
                            type="text"
                            value={editedItem.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Location</label>
                        <input
                            type="text"
                            value={editedItem.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={editedItem.quantity}
                                onChange={(e) => handleChange('quantity', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Unit Price</label>
                            <input
                                type="number"
                                min="0"
                                value={editedItem.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Total</span>
                            <span className="text-xl font-black font-mono">{formatCurrency(editedItem.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-border-dark flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-white/5 font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

const ItemsTable = ({ items = [], onDelete, onEdit }) => {
    const [editingItem, setEditingItem] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleEdit = (item) => {
        setEditingItem(item)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = (editedItem) => {
        onEdit(editedItem)
        setEditingItem(null)
    }

    return (
        <>
            <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                    <h3 className="font-bold text-lg">Transaction Items</h3>
                    <span className="text-xs text-slate-400">{items.length} items added</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-center">Quantity</th>
                                <th className="px-6 py-4 text-right">Unit Price</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 italic">
                                        No items added yet. Use the form below to add items.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex flex-col">
                                                <span>{item.name}</span>
                                                <span className="text-xs text-slate-400 capitalize">{item.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.description || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.location ? (
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                                    {item.location}
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center font-mono">{item.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-right font-mono text-slate-500">{formatCurrency(item.price)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(item.total)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                                    title="Edit item"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="Delete item"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete_outline</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Edit Modal */}
            {editingItem && (
                <EditItemModal
                    item={editingItem}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setEditingItem(null)
                    }}
                    onSave={handleSaveEdit}
                />
            )}
        </>
    )
}

export default ItemsTable
