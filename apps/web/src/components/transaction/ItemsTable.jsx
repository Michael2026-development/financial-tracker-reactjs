import { useState } from 'react'
import { formatCurrency } from "@/lib/utils"
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'

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
                className="absolute inset-0 bg-black/30 backdrop-blur-[4px]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-[480px] w-full animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Item</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Item Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Item Name</label>
                        <input
                            type="text"
                            value={editedItem.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Description</label>
                        <input
                            type="text"
                            value={editedItem.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Location</label>
                        <input
                            type="text"
                            value={editedItem.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={editedItem.date || new Date().toISOString().split('T')[0]}
                                onChange={(e) => handleChange('date', e.target.value)}
                                className="w-full h-11 pl-4 pr-10 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xl pointer-events-none">
                                calendar_month
                            </span>
                        </div>
                    </div>

                    {/* Quantity & Unit Price Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={editedItem.quantity}
                                onChange={(e) => handleChange('quantity', e.target.value)}
                                className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Unit Price</label>
                            <input
                                type="number"
                                min="0"
                                value={editedItem.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                            />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 mt-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(editedItem.total)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-6 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-12 flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 h-12 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
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
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null })

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
                                <th className="px-6 py-4">Date</th>
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
                                    <td colSpan="8" className="px-6 py-8 text-center text-slate-500 italic">
                                        No items added yet. Use the form below to add items.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex flex-col">
                                                <span>{item.name}</span>
                                                <span className="text-xs text-slate-400 font-mono">ID: {String(index + 1).padStart(3, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.description || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
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
                                                    onClick={() => setDeleteModal({ isOpen: true, item })}
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={() => {
                    if (deleteModal.item) {
                        onDelete(deleteModal.item.id)
                        setDeleteModal({ isOpen: false, item: null })
                    }
                }}
                title="Delete Item?"
                itemName={deleteModal.item?.name}
                itemDetails={deleteModal.item ? {
                    price: deleteModal.item.price,
                    quantity: deleteModal.item.quantity,
                    total: deleteModal.item.total
                } : null}
            />
        </>
    )
}

export default ItemsTable
