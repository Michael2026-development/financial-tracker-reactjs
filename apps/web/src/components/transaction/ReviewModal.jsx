import clsx from 'clsx'
import { formatCurrency } from '@/lib/utils'

const ReviewModal = ({ isOpen, onClose, onSave, items = [], totalAmount = 0 }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-[700px] bg-[#1a1a35] border border-[#383663] rounded-xl shadow-2xl overflow-hidden animate-fade-in text-white">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-3 p-6 border-b border-[#383663]">
                    <p className="text-white tracking-tight text-[24px] font-extrabold leading-tight uppercase">Review Transaksi</p>
                    <button
                        onClick={onClose}
                        className="text-[#9795c6] hover:text-white transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[80vh]">
                    {/* Transaction Items */}
                    <div className="p-6">
                        <h3 className="text-white text-lg font-bold mb-4">Transaction Items</h3>
                        {items.length > 0 ? (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={item.id} className="flex justify-between items-start p-4 bg-[#1c1b3a] rounded-lg border border-[#383663]">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-white font-bold">{item.name}</p>
                                                    <p className="text-[#9795c6] text-sm">{item.description || '-'}</p>
                                                    {item.location && (
                                                        <p className="text-primary text-xs mt-1">📍 {item.location}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-mono text-sm">
                                                        {item.quantity} x {formatCurrency(item.price)}
                                                    </p>
                                                    <p className="text-white font-bold font-mono">{formatCurrency(item.total)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#9795c6]">
                                <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                                <p>No items added yet</p>
                            </div>
                        )}
                    </div>

                    {/* Grand Total */}
                    <div className="px-6 pb-6">
                        <div className="flex justify-between items-center p-5 bg-primary/10 border border-primary/50 rounded-xl">
                            <div>
                                <p className="text-[#9795c6] text-sm font-medium">Grand Total</p>
                                <p className="text-xs text-[#9795c6] mt-1">{items.length} items</p>
                            </div>
                            <p className="text-white tracking-tight text-2xl font-extrabold font-mono">{formatCurrency(totalAmount)}</p>
                        </div>
                    </div>

                    {/* Warning Box (Optional - can be made dynamic based on budget) */}
                    {totalAmount > 100000 && (
                        <div className="px-6 pb-4">
                            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5">
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-400/20 p-2 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-amber-400">info</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-amber-400 text-base font-bold leading-tight uppercase tracking-wider">Info</p>
                                        <p className="text-white/90 text-base font-medium leading-normal">
                                            Transaksi ini akan disimpan ke history Anda
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Button Group */}
                    <div className="flex flex-col sm:flex-row gap-3 p-6 bg-[#1c1b3a]/50 border-t border-[#383663] justify-end">
                        <button
                            onClick={onClose}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border border-[#383663] hover:bg-[#272546] text-white text-base font-bold transition-all"
                        >
                            <span className="truncate">Kembali</span>
                        </button>
                        <button
                            onClick={onSave}
                            disabled={items.length === 0}
                            className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-opacity-90 text-white text-base font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">Simpan Transaksi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal
