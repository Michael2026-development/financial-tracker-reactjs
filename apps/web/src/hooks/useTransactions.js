import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getTransactions,
    getTransaction,
    getRecentTransactions,
    searchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactionItem,
} from "@/services/api/transactions";

// Query keys
export const transactionKeys = {
    all: ["transactions"],
    lists: () => [...transactionKeys.all, "list"],
    list: (filters) => [...transactionKeys.lists(), filters],
    details: () => [...transactionKeys.all, "detail"],
    detail: (id) => [...transactionKeys.details(), id],
    recent: (limit) => [...transactionKeys.all, "recent", limit],
    search: (query) => [...transactionKeys.all, "search", query],
};

/**
 * Fetch transactions with optional filters
 */
export function useTransactions(filters = {}) {
    return useQuery({
        queryKey: transactionKeys.list(filters),
        queryFn: () => getTransactions(filters),
    });
}

/**
 * Fetch a single transaction by ID
 */
export function useTransaction(id) {
    return useQuery({
        queryKey: transactionKeys.detail(id),
        queryFn: () => getTransaction(id),
        enabled: !!id,
    });
}

/**
 * Fetch recent transactions
 */
export function useRecentTransactions(limit = 5) {
    return useQuery({
        queryKey: transactionKeys.recent(limit),
        queryFn: () => getRecentTransactions(limit),
    });
}

/**
 * Search transactions
 */
export function useSearchTransactions(query) {
    return useQuery({
        queryKey: transactionKeys.search(query),
        queryFn: () => searchTransactions(query),
        enabled: !!query && query.length > 0,
    });
}

/**
 * Create a new transaction
 */
export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            // Invalidate all transaction queries to refetch
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },
    });
}

/**
 * Update a transaction
 */
export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateTransaction(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
        },
    });
}

/**
 * Delete a transaction
 */
export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        },
    });
}

/**
 * Delete a transaction item
 */
export function useDeleteTransactionItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ transactionId, itemId }) =>
            deleteTransactionItem(transactionId, itemId),
        onSuccess: (_, { transactionId }) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({
                queryKey: transactionKeys.detail(transactionId),
            });
        },
    });
}
