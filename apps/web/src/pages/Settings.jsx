import { Link } from 'react-router-dom'

export default function Settings() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="mb-8">
                <h3 className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">Pengaturan</h3>
                <p className="text-slate-500 dark:text-slate-400">Kelola akun dan preferensi aplikasi</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Security */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-bold">person</span>
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Profil</h4>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    MF
                                </div>
                                <button className="text-primary text-sm font-medium hover:underline cursor-pointer">Ubah Foto</button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        type="text"
                                        defaultValue="Michael Frans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        type="email"
                                        defaultValue="michael@example.com"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                                    <input
                                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                        disabled
                                        type="text"
                                        value="Admin"
                                    />
                                </div>
                                <div className="md:col-span-2 mt-2">
                                    <button className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none cursor-pointer">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-bold">security</span>
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Keamanan</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password Lama</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password Baru</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Konfirmasi Password</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-medium transition-all cursor-pointer">
                                    Ubah Password
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Notifications, Preferences & Help */}
                <div className="space-y-8">
                    {/* Notifications Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-bold">notifications_active</span>
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Notifikasi</h4>
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Peringatan Budget</span>
                                <input defaultChecked className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer relative checked:bg-primary transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-5 before:transition-transform" type="checkbox" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Laporan Mingguan</span>
                                <input className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer relative checked:bg-primary transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-5 before:transition-transform" type="checkbox" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Tips Keuangan</span>
                                <input defaultChecked className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer relative checked:bg-primary transition-colors before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-5 before:transition-transform" type="checkbox" />
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-bold">settings_suggest</span>
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Preferensi</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mata Uang</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                                    <option>IDR - Rupiah</option>
                                    <option>USD - US Dollar</option>
                                    <option>EUR - Euro</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bahasa</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                                    <option>Indonesia</option>
                                    <option>English</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Help Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined font-bold">help</span>
                            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Bantuan</h4>
                        </div>
                        <div className="space-y-1">
                            <a className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group cursor-pointer" href="#">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">menu_book</span>
                                <span className="text-sm font-medium">Panduan Penggunaan</span>
                            </a>
                            <a className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group cursor-pointer" href="#">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">support_agent</span>
                                <span className="text-sm font-medium">Hubungi Support</span>
                            </a>
                            <Link className="flex items-center gap-3 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group mt-2" to="/login">
                                <span className="material-symbols-outlined text-red-500">logout</span>
                                <span className="text-sm font-medium text-red-500">Keluar</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
