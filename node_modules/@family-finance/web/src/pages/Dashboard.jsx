import StatCard from '@/components/dashboard/StatCard'
import ExpenseChart from '@/components/dashboard/ExpenseChart'
import BudgetOverview from '@/components/dashboard/BudgetOverview'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import { useTransactions } from '@/hooks/useTransactions'
import { useMonthlyStats, useYearlyStats } from '@/hooks/useReports'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
    // Fetch transactions from API
    const { data: transactionsData, isLoading: txLoading } = useTransactions({ limit: 100 })
    // API returns array directly
    const transactions = Array.isArray(transactionsData) ? transactionsData : []

    // Fetch reports from API
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const { data: currentMonthReport } = useMonthlyStats(currentYear, currentMonth)
    const { data: lastMonthReport } = useMonthlyStats(lastMonthYear, lastMonth)
    const { data: currentYearReport } = useYearlyStats(currentYear)
    const { data: lastYearReport } = useYearlyStats(currentYear - 1)

    // Use totalExpense from API (not "total")
    const totalExpensesThisMonth = currentMonthReport?.totalExpense || 0
    const totalExpensesLastMonth = lastMonthReport?.totalExpense || 0
    const totalExpensesThisYear = currentYearReport?.totalExpense || 0
    const totalExpensesLastYear = lastYearReport?.totalExpense || 0

    // Calculate trend
    const trend = totalExpensesLastMonth > 0
        ? ((totalExpensesThisMonth - totalExpensesLastMonth) / totalExpensesLastMonth) * 100
        : 0

    // Year trend
    const yearTrend = totalExpensesLastYear > 0
        ? ((totalExpensesThisYear - totalExpensesLastYear) / totalExpensesLastYear) * 100
        : 0

    if (txLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-32 bg-surface-dark rounded-xl"></div>
                        <div className="h-32 bg-surface-dark rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <StatCard
                        title="Total Expenses"
                        value={formatCurrency(totalExpensesThisMonth)}
                        icon="trending_down"
                        trend={trend}
                        trendValue="from last month"
                        variant="expense"
                    />
                </div>
                <StatCard
                    title={`Expenses (${currentYear})`}
                    value={formatCurrency(totalExpensesThisYear)}
                    icon="history"
                    trend={yearTrend}
                    trendValue={`vs ${currentYear - 1}`}
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
