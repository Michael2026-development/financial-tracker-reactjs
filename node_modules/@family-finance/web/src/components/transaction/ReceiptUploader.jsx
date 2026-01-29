import { useState, useRef } from 'react'
import { analyzeReceipt, getImagePreview } from '@/services/receiptScanner'
import clsx from 'clsx'

const ReceiptUploader = ({ onScanComplete, isScanning, setIsScanning }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            await processFile(file)
        }
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (file) {
            await processFile(file)
        }
        // Reset input for repeat uploads
        e.target.value = ''
    }

    const processFile = async (file) => {
        setError(null)
        setIsScanning(true)

        try {
            const imagePreview = getImagePreview(file)
            const result = await analyzeReceipt(file)

            if (result.success) {
                onScanComplete({
                    ...result.data,
                    imagePreview
                })
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('Failed to process receipt. Please try again.')
            console.error('Receipt scan error:', err)
        } finally {
            setIsScanning(false)
        }
    }

    const triggerFileInput = () => {
        if (!isScanning) {
            fileInputRef.current?.click()
        }
    }

    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 shrink-0">
                <span className="material-symbols-outlined text-primary">document_scanner</span>
                Scan Receipt with AI
            </h3>

            <div
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex-1 flex flex-col justify-center",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 dark:border-border-dark hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5",
                    isScanning && "pointer-events-none opacity-60"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                />

                {isScanning ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-3xl text-primary animate-spin">sync</span>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-slate-900 dark:text-white">Analyzing Receipt with OCR...</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tesseract OCR is extracting text from your receipt</p>
                        </div>
                        <div className="flex gap-1">
                            <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-primary">photo_camera</span>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-slate-900 dark:text-white">Upload or Capture Receipt</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Drag & drop an image, or tap to use camera
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">JPG</span>
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">PNG</span>
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">WebP</span>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined text-lg">error</span>
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </section>
    )
}

export default ReceiptUploader
