import { cn } from '@/lib/utils'

export default function Card({ children, className, hover = true, ...props }) {
    return (
        <div
            className={cn(
                'bg-bg-card rounded-xl border border-border p-6',
                'transition-all duration-200',
                hover && 'hover:border-border-hover hover:shadow-hover',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export function CardHeader({ children, className }) {
    return (
        <div className={cn('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className }) {
    return (
        <h3 className={cn('text-lg font-semibold text-text-primary', className)}>
            {children}
        </h3>
    )
}

export function CardContent({ children, className }) {
    return (
        <div className={cn('', className)}>
            {children}
        </div>
    )
}
