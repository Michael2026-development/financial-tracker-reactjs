import { useTransactionStore } from '@/stores/useTransactionStore'
import { formatCurrency, getBudgetStatus } from '@/lib/utils'
import ProgressBar from '@/components/ui/ProgressBar'

export default function BudgetProgress() {
    const { categories, getCategorySpent } = useTransactionStore()

    return (
        <div className="space-y-4">
            {categories.map((category) => {
                const spent = getCategorySpent(category.id)
                const { status } = getBudgetStatus(spent, category.monthly_budget)
                const progressStatus = status === 'DANGER' ? 'danger' : status === 'WARNING' ? 'warning' : 'safe'

                return (
                    <div key={category.id} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{category.icon}</span>
                                <span className="text-sm font-medium text-text-primary">{category.name}</span>
                            </div>
                            <div className="text-sm text-text-secondary">
                                <span className="text-text-primary font-medium">{formatCurrency(spent)}</span>
                                <span className="mx-1">/</span>
                                <span>{formatCurrency(category.monthly_budget)}</span>
                            </div>
                        </div>
                        <ProgressBar
                            value={spent}
                            max={category.monthly_budget}
                            status={progressStatus}
                            showLabel={false}
                        />
                    </div>
                )
            })}
        </div>
    )
}
