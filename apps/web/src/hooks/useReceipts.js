import { useMutation } from "@tanstack/react-query";
import { scanReceipt } from "@/services/api/receipts";

/**
 * Scan a receipt image using AI
 */
export function useScanReceipt() {
    return useMutation({
        mutationFn: ({ image, mimeType }) => scanReceipt(image, mimeType),
    });
}
