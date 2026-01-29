import clsx from 'clsx'

const StatCard = ({ title, value, icon, trend, trendValue, variant = 'default' }) => {
    const isPrimary = variant === 'primary'

    return (
        <div className={clsx(
            "p-6 rounded-xl border shadow-sm relative overflow-hidden",
            isPrimary
                ? "bg-primary border-primary shadow-lg shadow-primary/20 text-white"
                : "bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark"
        )}>
            <div className={clsx("relative z-10", isPrimary && "text-white")}>
                <div className="flex items-center justify-between mb-4">
                    <span className={clsx(
                        "text-sm font-medium",
                        isPrimary ? "text-primary-100 opacity-80" : "text-slate-500 dark:text-slate-400"
                    )}>
                        {title}
                    </span>
                    <div className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isPrimary
                            ? "bg-white/20 backdrop-blur-sm"
                            : variant === 'expense'
                                ? "bg-rose-500/10 text-rose-500"
                                : "bg-emerald-500/10 text-emerald-500"
                    )}>
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                </div>
                <p className="text-xl lg:text-2xl font-extrabold tracking-tight">{value}</p>
                <div className="mt-2 flex items-center gap-1">
                    <span className={clsx(
                        "text-sm font-bold leading-none",
                        isPrimary ? "text-white" : (trend > 0 ? "text-emerald-500" : "text-rose-500")
                    )}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className={clsx(
                        "text-xs",
                        isPrimary ? "text-primary-100/70" : "text-slate-400"
                    )}>
                        {trendValue}
                    </span>
                </div>
            </div>
            {isPrimary && (
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            )}
        </div>
    )
}

export default StatCard
