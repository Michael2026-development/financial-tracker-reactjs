import StatCard from '@/components/dashboard/StatCard'
import ExpenseChart from '@/components/dashboard/ExpenseChart'
import BudgetOverview from '@/components/dashboard/BudgetOverview'
import RecentTransactions from '@/components/dashboard/RecentTransactions'

export default function Dashboard() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <StatCard
                        title="Total Expenses"
                        value="Rp 8.240.000"
                        icon="trending_down"
                        trend={-4.2}
                        trendValue="from last month"
                        variant="expense"
                    />
                </div>
                <StatCard
                    title="Expenses (2025)"
                    value="Rp 98.500.000"
                    icon="history"
                    trend={12.4}
                    trendValue="vs 2024"
                    variant="primary"
                />
            </div>

            {/* Charts and Budget Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ExpenseChart />
                <BudgetOverview />
            </div>

            {/* Transactions Table */}
            <RecentTransactions />
        </div>
    )
}
