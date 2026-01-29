import { cn } from '@/lib/utils'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) {
    const variants = {
        primary: 'bg-accent-primary hover:bg-accent-secondary text-white',
        secondary: 'bg-bg-secondary hover:bg-bg-hover text-text-primary border border-border',
        success: 'bg-accent-success hover:opacity-90 text-white',
        danger: 'bg-accent-danger hover:opacity-90 text-white',
        ghost: 'hover:bg-bg-hover text-text-secondary hover:text-text-primary',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    }

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
