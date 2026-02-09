import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTransactions } from '@/hooks/useTransactions'

const ExpenseChart = () => {
    const { data: transactionsData, isLoading } = useTransactions({ limit: 500 })
    // API returns array directly
    const transactions = Array.isArray(transactionsData) ? transactionsData : []

    // Process transactions into monthly data
    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentYear = new Date().getFullYear()

        // Initialize data structure
        const chartData = months.map(m => ({ name: m, expense: 0 }))

        transactions.forEach(t => {
            // Use camelCase: transactionDate, totalPrice from API
            const date = new Date(t.transactionDate)
            if (date.getFullYear() === currentYear) {
                const monthIndex = date.getMonth()
                chartData[monthIndex].expense += (t.totalPrice || 0)
            }
        })

        return chartData
    }

    const data = getMonthlyData()

    if (isLoading) {
        return (
            <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Annual Expense Trend</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly spending in Rupiah</p>
                </div>
                <select className="bg-slate-100 dark:bg-background-dark border-none rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 focus:ring-primary/50 outline-none cursor-pointer text-slate-700 dark:text-slate-300">
                    <option>This Year</option>
                </select>
            </div>
            <div className="h-64 w-full" style={{ minHeight: '256px' }}>
                <ResponsiveContainer width="100%" height={256}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `Rp ${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Expense']}
                        />

                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#5048e5"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#5048e5', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ExpenseChart
