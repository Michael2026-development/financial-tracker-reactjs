export default function HistoryFilters({ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, dateFilter, setDateFilter, onExportCSV, categories }) {
    return (
        <section className="px-4 lg:px-8 py-2 flex flex-col gap-6 shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-card-dark p-2 lg:p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3 lg:gap-2">
                    {/* Search Input */}
                    <div className="relative flex-1 group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl transition-colors group-focus-within:text-primary">search</span>
                        <input
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-transparent rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-background-dark outline-none transition-all text-sm"
                            placeholder="Search by description..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="h-4 w-px bg-slate-200 dark:bg-white/5 hidden sm:block mx-1"></div>

                    {/* Category Select */}
                    <div className="relative min-w-[140px] group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-primary">category</span>
                        <select
                            className="w-full pl-12 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border-transparent rounded-xl text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-background-dark outline-none appearance-none cursor-pointer transition-all"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option>All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
                    </div>

                    <div className="h-4 w-px bg-slate-200 dark:bg-white/5 hidden sm:block mx-1"></div>

                    {/* Period Select */}
                    <div className="relative min-w-[140px] group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-primary">calendar_month</span>
                        <select
                            className="w-full pl-12 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border-transparent rounded-xl text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-background-dark outline-none appearance-none cursor-pointer transition-all"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>Last 3 Months</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-200 dark:bg-white/5 lg:hidden px-2"></div>

                <button
                    onClick={onExportCSV}
                    className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                    <span className="material-symbols-outlined text-xl">download</span>
                    <span>Export CSV</span>
                </button>
            </div>
        </section>
    )
}
