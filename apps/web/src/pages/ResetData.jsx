import { useTransactionStore } from '@/stores/useTransactionStore'
import { useNavigate } from 'react-router-dom'

export default function ResetData() {
    const resetAllData = useTransactionStore(state => state.resetAllData)
    const navigate = useNavigate()

    const handleReset = () => {
        if (confirm('⚠️ Apakah Anda yakin ingin menghapus SEMUA data transaksi?\n\nIni akan menghapus:\n- Semua transaksi\n- Semua history\n- Dashboard akan kembali ke Rp 0\n\nCategories tetap tersimpan.')) {
            resetAllData()
            alert('✅ Semua data berhasil dihapus!')
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-red-500 text-4xl">delete_forever</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Reset All Data</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Menghapus semua data transaksi untuk testing bersih
                        </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-6">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-amber-500">warning</span>
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Peringatan</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Tindakan ini akan menghapus SEMUA transaksi yang ada dan tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <h3 className="font-bold text-lg">Yang akan dihapus:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-red-500">close</span>
                                Semua transaksi
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-red-500">close</span>
                                History transaksi
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-red-500">close</span>
                                Data dashboard (kembali ke Rp 0)
                            </li>
                        </ul>

                        <h3 className="font-bold text-lg pt-4">Yang tetap tersimpan:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-green-500">check</span>
                                Categories (Makanan, Transportasi, dll)
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-green-500">check</span>
                                Settings & preferences
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-bold"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">delete_forever</span>
                            Reset Semua Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
