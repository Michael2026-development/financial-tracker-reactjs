import { useState } from 'react'

const AddItemForm = ({ onAddItem }) => {
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        location: '',
        quantity: 1,
        price: '',
        category: 'groceries'
    })

    const handleAdd = () => {
        if (!newItem.name || !newItem.price) return

        onAddItem({
            ...newItem,
            id: Date.now(),
            price: Number(newItem.price),
            quantity: Number(newItem.quantity),
            total: Number(newItem.price) * Number(newItem.quantity)
        })

        setNewItem({
            name: '',
            description: '',
            location: '',
            quantity: 1,
            price: '',
            category: 'groceries'
        })
    }

    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add Item Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Name</label>
                    <input
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Milk"
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                    <input
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Weekly shopping"
                        type="text"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</label>
                    <div className="relative">
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Supermarket"
                            type="text"
                            value={newItem.location}
                            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        />
                        {newItem.location && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newItem.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                title="Search on Google Maps"
                            >
                                <span className="material-symbols-outlined text-lg">map</span>
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
                    <div className="relative">
                        <select
                            className="appearance-none w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer"
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            <option value="groceries">Groceries</option>
                            <option value="utilities">Utilities</option>
                            <option value="dining">Dining Out</option>
                            <option value="transport">Transportation</option>
                            <option value="other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quantity</label>
                    <input
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        min="1"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit Price (Rp)</label>
                    <div className="relative">
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-border-dark rounded-lg pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono"
                            placeholder="0"
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                        <button
                            onClick={handleAdd}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AddItemForm
