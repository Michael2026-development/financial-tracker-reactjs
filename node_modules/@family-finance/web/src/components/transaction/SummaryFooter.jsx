import { formatCurrency } from '@/lib/utils'

const SummaryFooter = ({ totalAmount = 0, onReview }) => {
    return (
        <div className="mt-8 lg:mt-12 flex flex-col md:flex-row items-center justify-between p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-xl shadow-primary/5">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grand Total</p>
                    <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{formatCurrency(totalAmount)}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button className="w-full sm:w-auto px-6 lg:px-8 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer">
                    Batal
                </button>
                <button
                    onClick={onReview}
                    className="w-full sm:w-auto px-6 lg:px-8 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                    <span>Review & Simpan</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    )
}

export default SummaryFooter
