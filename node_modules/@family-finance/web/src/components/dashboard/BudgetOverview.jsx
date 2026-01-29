import { Link } from 'react-router-dom'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { formatCurrency } from '@/lib/utils'

const BudgetOverview = () => {
    const { categories, getCategorySpent } = useTransactionStore()
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
            <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Budget Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Spent vs allocation this month</p>
            <div className="space-y-5">
                {categories.slice(0, 3).map((category) => {
                    const spent = getCategorySpent(category.id);
                    const budget = category.monthly_budget;
                    const percentage = Math.min(Math.round((spent / budget) * 100), 100);
                    const isOverLimit = spent > budget;

                    let colorClass = "bg-primary";
                    if (isOverLimit) colorClass = "bg-rose-500";
                    else if (percentage > 80) colorClass = "bg-amber-500";

                    return (
                        <div key={category.id} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">{category.name}</span>
                                <span className={`${isOverLimit ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                                    {isOverLimit ? 'Over Limit' : `${percentage}%`}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-border-dark rounded-full overflow-hidden">
                                <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                            </div>
                            <p className="text-[11px] text-slate-500">{formatCurrency(spent)} of {formatCurrency(budget)}</p>
                        </div>
                    );
                })}
            </div>
            <Link to="/categories" className="w-full mt-6 py-2 border border-slate-200 dark:border-border-dark rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-background-dark transition-colors cursor-pointer flex items-center justify-center text-slate-900 dark:text-white">
                Edit Budgets
            </Link>
        </div>
    )
}

export default BudgetOverview
