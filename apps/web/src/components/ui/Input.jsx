import { cn } from '@/lib/utils'

export default function Input({
    label,
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
            <input
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg',
                    'bg-bg-secondary border border-border',
                    'text-text-primary placeholder:text-text-muted',
                    'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50',
                    'transition-colors duration-200',
                    error && 'border-accent-danger focus:border-accent-danger focus:ring-accent-danger/50',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm text-accent-danger">{error}</p>
            )}
        </div>
    )
}
