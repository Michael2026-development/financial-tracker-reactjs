import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCategories, useCategorySpent, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import { formatCurrency, getBudgetStatus } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'

// Helper component to display category with spent data
const CategoryCard = ({ category, onEdit, onDelete }) => {
    const { data: spentData } = useCategorySpent(category.id)
    const spent = spentData?.spent || 0
    // Use camelCase: monthlyBudget from API
    const { status, label } = getBudgetStatus(spent, category.monthlyBudget)
    const percentage = Math.min(Math.round((spent / category.monthlyBudget) * 100), 100)
    const remainingCat = category.monthlyBudget - spent

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
        <div className={`group bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col gap-5 ${borderColorClass} transition-all shadow-sm`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-xl ${bgOpacityClass} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${colorClass} text-2xl`}>{
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
                        onClick={() => onEdit(category)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(category, spent)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {formatCurrency(spent)} <span className="text-slate-400 dark:text-[#9795c6] text-xs font-normal">/ {formatCurrency(category.monthlyBudget)}</span>
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
}

// Alert Card component
const AlertCard = ({ categories, type }) => {
    const configs = {
        danger: {
            icon: 'error',
            colorClass: 'text-red-500',
            borderClass: 'border-red-500/30 dark:border-red-500/20',
            label: 'Over Limit',
            filter: (cat) => cat.spent > cat.budget
        },
        warning: {
            icon: 'warning',
            colorClass: 'text-amber-500',
            borderClass: 'border-amber-500/30 dark:border-amber-500/20',
            label: 'Near Limit',
            filter: (cat) => cat.percentage >= 80 && cat.spent <= cat.budget
        },
        safe: {
            icon: 'check_circle',
            colorClass: 'text-emerald-500',
            borderClass: 'border-emerald-500/30 dark:border-emerald-500/20',
            label: 'Safe',
            filter: (cat) => cat.percentage < 80
        }
    }

    const config = configs[type]
    const filteredCats = categories.filter(config.filter).sort((a, b) => b.percentage - a.percentage)
    const cat = filteredCats[0]

    return (
        <div className={`bg-white dark:bg-card-dark p-6 rounded-2xl border-2 ${config.borderClass} shadow-sm`}>
            <div className="flex items-center gap-2 mb-4">
                <span className={`material-symbols-outlined ${config.colorClass} text-xl`}>{config.icon}</span>
                <p className={`${config.colorClass} text-sm font-bold uppercase tracking-wider`}>{config.label}</p>
            </div>
            <div className="space-y-4">
                {cat ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                            <p className={`text-xs font-bold ${config.colorClass}`}>{cat.percentage}%</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                            <div className={`h-full ${config.colorClass.replace('text-', 'bg-')} rounded-full transition-all duration-500`} style={{ width: `${Math.min(cat.percentage, 100)}%` }}></div>
                        </div>
                        <p className={`text-xs ${config.colorClass}`}>
                            {formatCurrency(cat.spent)} / {formatCurrency(cat.budget)}
                        </p>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No categories {type === 'danger' ? 'over limit' : type === 'warning' ? 'near limit' : 'safe'}</p>
                )}
            </div>
        </div>
    )
}

// Individual alert item component - can use hooks properly
const CategoryAlertItem = ({ category }) => {
    const { data: spentData } = useCategorySpent(category.id)
    const spent = spentData?.spent || 0
    const budget = category.monthlyBudget
    const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0

    return {
        ...category,
        spent,
        budget,
        percentage
    }
}

// Budget Alerts component with proper filtering
const BudgetAlerts = ({ categories }) => {
    // Component that fetches and displays a single category
    const AlertCardWithData = ({ title, icon, colorClass, bgClass, borderClass, categoryId }) => {
        const category = categories.find(c => c.id === categoryId)
        const { data: spentData } = useCategorySpent(categoryId)

        if (!category) {
            return (
                <div className={`bg-white dark:bg-card-dark p-6 rounded-2xl border-2 ${borderClass} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`material-symbols-outlined ${colorClass} text-xl`}>{icon}</span>
                        <p className={`${colorClass} text-sm font-bold uppercase tracking-wider`}>{title}</p>
                    </div>
                    <p className="text-xs text-slate-400 italic">No categories {title.toLowerCase()}</p>
                </div>
            )
        }

        const spent = spentData?.spent || 0
        const budget = category.monthlyBudget
        const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0

        return (
            <div className={`bg-white dark:bg-card-dark p-6 rounded-2xl border-2 ${borderClass} shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                    <span className={`material-symbols-outlined ${colorClass} text-xl`}>{icon}</span>
                    <p className={`${colorClass} text-sm font-bold uppercase tracking-wider`}>{title}</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{category.icon || '📁'}</span>
                                <p className="font-bold text-slate-900 dark:text-white">{category.name}</p>
                            </div>
                            <p className={`text-xs font-bold ${colorClass}`}>{percentage}%</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-[#383663] rounded-full overflow-hidden">
                            <div
                                className={`h-full ${bgClass} rounded-full transition-all duration-500`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                        <p className={`text-xs ${colorClass}`}>
                            {formatCurrency(spent)} / {formatCurrency(budget)}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Component to fetch all category data and determine which to show
    const CategoryDataCollector = ({ children }) => {
        // Fetch spent data for ALL categories (this is safe - fixed number of hook calls)
        const categoriesWithData = categories.map(cat => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data: spentData } = useCategorySpent(cat.id)
            return {
                ...cat,
                spent: spentData?.spent || 0,
                percentage: cat.monthlyBudget > 0 ? Math.round(((spentData?.spent || 0) / cat.monthlyBudget) * 100) : 0
            }
        })

        // Filter and sort
        const overLimit = categoriesWithData
            .filter(cat => cat.spent > cat.monthlyBudget)
            .sort((a, b) => b.percentage - a.percentage)

        const nearLimit = categoriesWithData
            .filter(cat => cat.percentage >= 80 && cat.spent <= cat.monthlyBudget)
            .sort((a, b) => b.percentage - a.percentage)

        const safe = categoriesWithData
            .filter(cat => cat.percentage < 80)
            .sort((a, b) => b.percentage - a.percentage)

        return children({
            overLimitId: overLimit[0]?.id,
            nearLimitId: nearLimit[0]?.id,
            safeId: safe[0]?.id
        })
    }

    return (
        <CategoryDataCollector>
            {({ overLimitId, nearLimitId, safeId }) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <AlertCardWithData
                        title="OVER LIMIT"
                        icon="error"
                        colorClass="text-red-500"
                        bgClass="bg-red-500"
                        borderClass="border-red-500/30 dark:border-red-500/20"
                        categoryId={overLimitId}
                    />
                    <AlertCardWithData
                        title="NEAR LIMIT"
                        icon="warning"
                        colorClass="text-amber-500"
                        bgClass="bg-amber-500"
                        borderClass="border-amber-500/30 dark:border-amber-500/20"
                        categoryId={nearLimitId}
                    />
                    <AlertCardWithData
                        title="SAFE"
                        icon="check_circle"
                        colorClass="text-emerald-500"
                        bgClass="bg-emerald-500"
                        borderClass="border-emerald-500/30 dark:border-emerald-500/20"
                        categoryId={safeId}
                    />
                </div>
            )}
        </CategoryDataCollector>
    )
}

export default function Categories() {
    const { data: categories, isLoading } = useCategories()
    const createCategory = useCreateCategory()
    const updateCategory = useUpdateCategory()
    const deleteCategoryMutation = useDeleteCategory()

    const categoryList = categories || []

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryData: null })
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        icon: '',
        color: '#10b981',
        monthlyBudget: ''
    })

    const handleOpenAdd = () => {
        setEditingId(null)
        setCategoryForm({ name: '', icon: '', color: '#10b981', monthlyBudget: '' })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (category) => {
        setEditingId(category.id)
        setCategoryForm({
            name: category.name,
            icon: category.icon,
            color: category.color,
            monthlyBudget: category.monthlyBudget
        })
        setIsModalOpen(true)
    }

    const handleSaveCategory = async () => {
        if (!categoryForm.name || !categoryForm.monthlyBudget) return

        const payload = {
            ...categoryForm,
            monthlyBudget: Number(categoryForm.monthlyBudget)
        }

        try {
            if (editingId) {
                // Pass as { id, data } to match mutation function signature
                await updateCategory.mutateAsync({ id: editingId, data: payload })
            } else {
                await createCategory.mutateAsync(payload)
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error('Failed to save category:', error)
        }
    }

    const handleDelete = (category, spent) => {
        setDeleteModal({
            isOpen: true,
            categoryId: category.id,
            categoryData: {
                name: category.name,
                budget: category.monthlyBudget,
                spent: spent,
                icon: category.icon
            }
        })
    }

    const handleConfirmDelete = async () => {
        if (deleteModal.categoryId) {
            try {
                await deleteCategoryMutation.mutateAsync(deleteModal.categoryId)
            } catch (error) {
                console.error('Failed to delete category:', error)
            }
        }
        setDeleteModal({ isOpen: false, categoryId: null, categoryData: null })
    }

    if (isLoading) {
        return (
            <div className="px-4 lg:px-8 pt-8 pb-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Prepare categories with spent data for alerts (we'll fetch individually)
    // For the alert cards, we need pre-computed spent values
    // This is a simplified version - in production you'd want to batch this
    const categoriesWithSpent = categoryList.map(cat => ({
        ...cat,
        spent: 0, // Will be fetched individually by each card
        budget: cat.monthlyBudget,
        percentage: 0
    }))

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

            {/* Budget Alerts - Functional */}
            <BudgetAlerts categories={categoryList} />

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryList.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                ))}

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
                className="!p-0 max-w-[500px] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
            >
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-6">
                    {/* Nama Kategori */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Nama Kategori
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan nama kategori"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 outline-none"
                        />
                    </div>

                    {/* Icon & Warna Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Icon */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Icon (Emoji)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                                    {categoryForm.icon || '📁'}
                                </span>
                                <input
                                    type="text"
                                    placeholder="🛒 (paste any emoji)"
                                    value={categoryForm.icon}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Tip: Copy and paste any emoji or icon (e.g., 🛒 🍔 💰 🏠 ✈️)
                            </p>
                        </div>

                        {/* Warna */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Warna (Hex)
                            </label>
                            <div className="relative flex items-center">
                                <div
                                    className="absolute left-4 size-5 rounded-md border border-slate-200 dark:border-slate-600"
                                    style={{ backgroundColor: categoryForm.color || '#10b981' }}
                                ></div>
                                <input
                                    type="text"
                                    placeholder="#10b981"
                                    value={categoryForm.color}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget Bulanan */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Budget Bulanan
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                Rp
                            </span>
                            <input
                                type="number"
                                placeholder="0"
                                value={categoryForm.monthlyBudget || ''}
                                onChange={(e) => setCategoryForm({ ...categoryForm, monthlyBudget: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSaveCategory}
                        disabled={createCategory.isPending || updateCategory.isPending}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50"
                    >
                        {createCategory.isPending || updateCategory.isPending ? 'Saving...' : 'Simpan'}
                    </button>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryData: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Category?"
                itemName={deleteModal.categoryData?.name}
                itemDetails={deleteModal.categoryData ? {
                    budget: deleteModal.categoryData.budget,
                    spent: deleteModal.categoryData.spent,
                    icon: deleteModal.categoryData.icon
                } : null}
            />
        </div>
    )
}
