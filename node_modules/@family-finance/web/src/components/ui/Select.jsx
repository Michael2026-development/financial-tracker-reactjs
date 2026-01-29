import { cn } from '@/lib/utils'

export default function Select({
    label,
    options = [],
    error,
    className,
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            <select
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg appearance-none cursor-pointer',
                    'bg-bg-secondary border border-border',
                    'text-text-primary',
                    'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
                    'transition-colors duration-200',
                    'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat',
                    error && 'border-accent-danger',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-accent-danger">{error}</p>
            )}
        </div>
    )
}
