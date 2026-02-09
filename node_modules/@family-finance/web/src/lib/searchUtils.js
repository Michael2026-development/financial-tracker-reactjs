/**
 * Filter transactions based on search query
 * Searches in: description, category name, store name, and item names
 */
export function filterTransactions(transactions, query, categories = []) {
    if (!query || query.trim() === '') return transactions

    const lowercaseQuery = query.toLowerCase().trim()

    return transactions.filter(transaction => {
        // Search in description
        if (transaction.description?.toLowerCase().includes(lowercaseQuery)) {
            return true
        }

        // Search in category name (look up category by categoryId)
        if (transaction.categoryId && categories.length > 0) {
            const category = categories.find(c => c.id === transaction.categoryId)
            if (category?.name?.toLowerCase().includes(lowercaseQuery)) {
                return true
            }
        }

        // Search in store name
        if (transaction.storeName?.toLowerCase().includes(lowercaseQuery)) {
            return true
        }

        // Search in items (if transaction has items)
        if (transaction.items && Array.isArray(transaction.items)) {
            const hasMatchingItem = transaction.items.some(item =>
                item.name?.toLowerCase().includes(lowercaseQuery)
            )
            if (hasMatchingItem) return true
        }

        return false
    })
}
