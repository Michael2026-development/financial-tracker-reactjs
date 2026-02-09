import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getSettings,
    updateSettings,
    getProfile,
    updateProfile,
} from "@/services/api/settings";

// Query keys
export const settingsKeys = {
    all: ["settings"],
    settings: () => [...settingsKeys.all, "preferences"],
    profile: () => [...settingsKeys.all, "profile"],
};

/**
 * Fetch user settings
 */
export function useSettings() {
    return useQuery({
        queryKey: settingsKeys.settings(),
        queryFn: getSettings,
    });
}

/**
 * Update user settings
 */
export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
        },
    });
}

/**
 * Fetch user profile
 */
export function useProfile() {
    return useQuery({
        queryKey: settingsKeys.profile(),
        queryFn: getProfile,
    });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
        },
    });
}
