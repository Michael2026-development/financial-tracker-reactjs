import { cn } from '@/lib/utils'

export default function ProgressBar({
    value = 0,
    max = 100,
    status = 'normal',
    showLabel = true,
    className
}) {
    const percentage = Math.min((value / max) * 100, 100)

    const statusColors = {
        normal: 'bg-accent-primary',
        safe: 'bg-accent-success',
        warning: 'bg-accent-warning',
        danger: 'bg-accent-danger',
    }

    return (
        <div className={cn('w-full', className)}>
            <div className="h-2.5 bg-bg-secondary rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        statusColors[status]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
        </div>
    )
}
