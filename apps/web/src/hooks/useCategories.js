import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategorySpent,
} from "@/services/api/categories";

// Query keys
export const categoryKeys = {
    all: ["categories"],
    lists: () => [...categoryKeys.all, "list"],
    list: () => [...categoryKeys.lists()],
    details: () => [...categoryKeys.all, "detail"],
    detail: (id) => [...categoryKeys.details(), id],
    spent: (id) => [...categoryKeys.all, "spent", id],
};

/**
 * Fetch all categories
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.list(),
        queryFn: getCategories,
    });
}

/**
 * Fetch a single category by ID
 */
export function useCategory(id) {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => getCategory(id),
        enabled: !!id,
    });
}

/**
 * Fetch monthly spent amount for a category
 */
export function useCategorySpent(id) {
    return useQuery({
        queryKey: categoryKeys.spent(id),
        queryFn: () => getCategorySpent(id),
        enabled: !!id,
    });
}

/**
 * Create a new category
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}

/**
 * Update a category
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateCategory(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
}

/**
 * Delete a category
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
}
