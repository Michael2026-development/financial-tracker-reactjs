import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount, locale = 'id-ID', currency = 'IDR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(date, locale = 'id-ID') {
    return new Date(date).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function generateSessionId() {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `STR-${dateStr}${random}`
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export function getBudgetStatus(spent, budget) {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return { status: 'DANGER', color: 'var(--color-accent-danger)', label: 'Overbudget!' }
    if (percentage > 80) return { status: 'WARNING', color: 'var(--color-accent-warning)', label: 'Hampir Habis' }
    return { status: 'SAFE', color: 'var(--color-accent-success)', label: 'Aman' }
}
