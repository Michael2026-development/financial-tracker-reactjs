import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { formatCurrency, getBudgetStatus } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

export default function Categories() {
    const { categories, getCategorySpent, addCategory, updateCategory, deleteCategory } = useTransactionStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        icon: '',
        color: '#10b981',
        monthly_budget: ''
    })


    const handleOpenAdd = () => {
        setEditingId(null)
        setCategoryForm({ name: '', icon: '', color: '#10b981', monthly_budget: '' })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (category) => {
        setEditingId(category.id)
        setCategoryForm({
            name: category.name,
            icon: category.icon,
            color: category.color,
            monthly_budget: category.monthly_budget
        })
        setIsModalOpen(true)
    }

    const handleSaveCategory = () => {
        if (!categoryForm.name || !categoryForm.monthly_budget) return

        const payload = {
            ...categoryForm,
            monthly_budget: Number(categoryForm.monthly_budget)
        }

        if (editingId) {
            updateCategory(editingId, payload)
        } else {
            addCategory(payload)
        }

        setIsModalOpen(false)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id)
        }
    }

    return (
        <div className="px-4 lg:px-8 pt-8 pb-4 shrink-0">
            {/* Page Heading */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">Archive</span>
                        <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Management</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Kategori Pengeluaran</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">Add, edit, and manage your categories.</p>
                </div>
            </header>

            {/* Budget Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Over Limit Alert */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border-2 border-red-500/30 dark:border-red-500/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                        <p className="text-red-500 text-sm font-bold uppercase tracking-wider">Over Limit</p>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const overLimitCats = categories
                                .map(cat => ({
                                    ...cat,
                                    spent: getCategorySpent(cat.id),
                                    percentage: Math.round((getCategorySpent(cat.id) / cat.monthly_budget) * 100)
                                }))
                                .filter(cat => cat.spent > cat.monthly_budget)
                                .sort((a, b) => b.percentage - a.percentage);

                            if (overLimitCats.length > 0) {
                                const cat = overLimitCats[0];
                                return (
                                    <div key={cat.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                                            <p className="text-xs font-bold text-red-500">{cat.percentage}%</p>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `100%` }}></div>
                                        </div>
                                        <p className="text-xs text-red-500">
                                            {formatCurrency(cat.spent)} / {formatCurrency(cat.monthly_budget)}
                                        </p>
                                    </div>
                                );
                            }
                            return <p className="text-xs text-slate-400 italic">No categories over limit</p>;
                        })()}
                    </div>
                </div>

                {/* Warning Alert */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-amber-500 text-xl">warning</span>
                        <p className="text-amber-500 text-sm font-bold uppercase tracking-wider">Near Limit</p>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const nearLimitCats = categories
                                .map(cat => ({
                                    ...cat,
                                    spent: getCategorySpent(cat.id),
                                    percentage: Math.round((getCategorySpent(cat.id) / cat.monthly_budget) * 100)
                                }))
                                .filter(cat => cat.percentage >= 80 && cat.spent <= cat.monthly_budget)
                                .sort((a, b) => b.percentage - a.percentage);

                            if (nearLimitCats.length > 0) {
                                const cat = nearLimitCats[0];
                                return (
                                    <div key={cat.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                                            <p className="text-xs font-bold text-amber-500">{cat.percentage}%</p>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }}></div>
                                        </div>
                                        <p className="text-xs text-amber-500">
                                            {formatCurrency(cat.spent)} / {formatCurrency(cat.monthly_budget)}
                                        </p>
                                    </div>
                                );
                            }
                            return <p className="text-xs text-slate-400 italic">No categories near limit</p>;
                        })()}
                    </div>
                </div>

                {/* Safe Alert */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                        <p className="text-emerald-500 text-sm font-bold uppercase tracking-wider">Safe</p>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                            const safeCats = categories
                                .map(cat => ({
                                    ...cat,
                                    spent: getCategorySpent(cat.id),
                                    percentage: Math.round((getCategorySpent(cat.id) / cat.monthly_budget) * 100)
                                }))
                                .filter(cat => cat.percentage < 80)
                                .sort((a, b) => b.percentage - a.percentage);

                            if (safeCats.length > 0) {
                                const cat = safeCats[0];
                                return (
                                    <div key={cat.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                                            <p className="text-xs font-bold text-emerald-500">{cat.percentage}%</p>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%` }}></div>
                                        </div>
                                        <p className="text-xs text-emerald-500">
                                            {formatCurrency(cat.spent)} / {formatCurrency(cat.monthly_budget)}
                                        </p>
                                    </div>
                                );
                            }
                            return <p className="text-xs text-slate-400 italic">No safe categories</p>;
                        })()}
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const spent = getCategorySpent(category.id)
                    const { status, label } = getBudgetStatus(spent, category.monthly_budget)
                    const percentage = Math.min(Math.round((spent / category.monthly_budget) * 100), 100)
                    const remainingCat = category.monthly_budget - spent

                    // Style config based on status
                    let colorClass = "text-emerald-500"
                    let bgClass = "bg-emerald-500"
                    let bgOpacityClass = "bg-emerald-500/10"
                    let borderColorClass = "hover:border-emerald-500/30"

                    if (status === 'WARNING') {
                        colorClass = "text-amber-500"
                        bgClass = "bg-amber-500"
                        bgOpacityClass = "bg-amber-500/10"
                        borderColorClass = "hover:border-amber-500/30"
                    } else if (status === 'DANGER') {
                        colorClass = "text-red-500"
                        bgClass = "bg-red-500"
                        bgOpacityClass = "bg-red-500/10"
                        borderColorClass = "hover:border-red-500/30"
                    }

                    return (
                        <div key={category.id} className={`group bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col gap-5 ${borderColorClass} transition-all shadow-sm`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-xl ${bgOpacityClass} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${colorClass} text-2xl`}>{
                                            // Simple check if it's an emoji or material name
                                            category.icon && category.icon.length > 2 ? category.icon : 'category'
                                        }</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category.name}</h3>
                                        <p className="text-[#9795c6] text-xs">Monthly Budget</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEdit(category)}
                                        className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {formatCurrency(spent)} <span className="text-slate-400 dark:text-[#9795c6] text-xs font-normal">/ {formatCurrency(category.monthly_budget)}</span>
                                    </p>
                                    <p className={`text-xs font-bold ${colorClass}`}>{percentage}%</p>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                                    <div className={`h-full ${bgClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bgOpacityClass} ${colorClass}`}>
                                        {label.toUpperCase()}
                                    </span>
                                    <p className="text-[#9795c6] text-xs italic">Sisa: {formatCurrency(remainingCat)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Placeholder/Empty State Card for Adding New */}
                <div
                    onClick={handleOpenAdd}
                    className="border-2 border-dashed border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all group min-h-[200px]"
                >
                    <div className="size-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-slate-400 dark:text-[#9795c6]">add</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 dark:text-[#9795c6]">Tambah Kategori Baru</p>
                </div>
            </div>

            {/* Add/Edit Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="bg-[#1a1a35] border-[#383663] !p-0 max-w-[500px]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#383663]">
                    <h2 className="text-white tracking-tight text-[22px] font-extrabold leading-tight uppercase">
                        {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-[#9795c6] hover:text-white transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-4">
                        <Input
                            label="Nama Kategori"
                            placeholder="Contoh: Belanja"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            className="bg-[#1c1b3a] border-[#383663] text-white placeholder:text-[#5c5b8f] focus:border-primary focus:ring-primary/20"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Icon (Material Symbol)"
                                placeholder="shopping_cart"
                                value={categoryForm.icon}
                                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                className="bg-[#1c1b3a] border-[#383663] text-white placeholder:text-[#5c5b8f]"
                            />
                            <Input
                                label="Warna (Hex)"
                                placeholder="#10b981"
                                value={categoryForm.color}
                                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                className="bg-[#1c1b3a] border-[#383663] text-white placeholder:text-[#5c5b8f]"
                            />
                        </div>
                        <Input
                            label="Budget Bulanan"
                            type="number"
                            placeholder="0"
                            value={categoryForm.monthly_budget}
                            onChange={(e) => setCategoryForm({ ...categoryForm, monthly_budget: e.target.value })}
                            className="bg-[#1c1b3a] border-[#383663] text-white placeholder:text-[#5c5b8f]"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 bg-[#1c1b3a]/50 -mx-6 px-6 pb-6 border-t border-[#383663] justify-end">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-[#383663] hover:bg-[#272546] text-white text-base font-bold transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSaveCategory}
                            className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-opacity-90 text-white text-base font-bold shadow-lg shadow-primary/20 transition-all"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
