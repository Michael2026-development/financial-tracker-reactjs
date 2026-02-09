import { formatCurrency } from '@/lib/utils'

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item?",
    itemName,
    itemDetails,
    isLastItem = false
}) {
    if (!isOpen) return null

    return (
        <>
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            >
                {/* Modal Content */}
                <div
                    className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-200"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Warning Icon */}
                    <div className="mb-5 flex items-center justify-center size-14 rounded-full bg-red-50 dark:bg-red-950/30">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-3xl">warning</span>
                    </div>

                    {/* Headline Text */}
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight text-center pb-2">
                        {title}
                    </h3>

                    {/* Body Text */}
                    <div className="text-slate-600 dark:text-slate-400 text-[15px] font-normal leading-relaxed pb-6 px-4 text-center">
                        {isLastItem && (
                            <p className="mb-3 text-orange-600 dark:text-orange-400 font-semibold">
                                ⚠️ This is the last item!<br />
                                The entire transaction will be deleted.
                            </p>
                        )}
                        <p>
                            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">'{itemName}'</span>?
                        </p>
                        {itemDetails && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm space-y-1.5">
                                {itemDetails.category && (
                                    <p>Category: <span className="font-semibold text-slate-900 dark:text-white">{itemDetails.category}</span></p>
                                )}
                                {itemDetails.itemCount !== undefined && (
                                    <p>Items: <span className="font-semibold text-slate-900 dark:text-white">{itemDetails.itemCount} item(s)</span></p>
                                )}
                                {itemDetails.budget !== undefined && (
                                    <p>Monthly Budget: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(itemDetails.budget)}</span></p>
                                )}
                                {itemDetails.spent !== undefined && (
                                    <p>Currently Spent: <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(itemDetails.spent)}</span></p>
                                )}
                                {itemDetails.price && (
                                    <p>Total: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(itemDetails.price)}</span></p>
                                )}
                                {itemDetails.quantity && (
                                    <p>Quantity: <span className="font-semibold text-slate-900 dark:text-white">x{itemDetails.quantity}</span></p>
                                )}
                                {itemDetails.newTotal !== undefined && itemDetails.newTotal !== null && (
                                    <p className="pt-2 text-amber-600 dark:text-amber-400 font-medium">
                                        → New total: {formatCurrency(itemDetails.newTotal)}
                                    </p>
                                )}
                            </div>
                        )}
                        <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Button Group */}
                    <div className="flex w-full gap-3 px-2">
                        <button
                            onClick={onClose}
                            className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="truncate">Cancel</span>
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                        >
                            <span className="truncate">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
