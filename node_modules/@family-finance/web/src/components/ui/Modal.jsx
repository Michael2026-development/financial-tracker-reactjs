import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = 'md'
}) {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    'relative w-full bg-bg-card rounded-2xl border border-border',
                    'shadow-2xl animate-fade-in',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
                        >
                            <X className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
