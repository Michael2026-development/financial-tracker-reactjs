import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ItemsTable from '@/components/transaction/ItemsTable'
import AddItemForm from '@/components/transaction/AddItemForm'
import SummaryFooter from '@/components/transaction/SummaryFooter'
import ReviewModal from '@/components/transaction/ReviewModal'
import ReceiptUploader from '@/components/transaction/ReceiptUploader'
import ScanConfirmModal from '@/components/transaction/ScanConfirmModal'
import { useTransactionStore } from '@/stores/useTransactionStore'

export default function AddTransaction() {
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    const addTransaction = useTransactionStore((state) => state.addTransaction)

    // Receipt scanner state
    const [isScanning, setIsScanning] = useState(false)
    const [isScanConfirmOpen, setIsScanConfirmOpen] = useState(false)
    const [scanData, setScanData] = useState(null)

    const handleAddItem = (item) => {
        setItems([...items, item])
    }

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleEditItem = (editedItem) => {
        setItems(items.map(item => item.id === editedItem.id ? editedItem : item))
    }

    const handleSave = () => {
        if (items.length === 0) {
            alert('Please add at least one item before saving')
            return
        }

        // Create transaction object
        const transaction = {
            id: `TRX-${Date.now()}`,
            date: new Date().toISOString(),
            description: items.length > 1 ? `Multiple items (${items.length})` : items[0].name,
            category: items[0]?.category || 'groceries',
            storeName: items[0]?.location || 'Store',
            amount: totalAmount,
            type: 'expense',
            items: items,
            status: 'completed'
        }

        // Save to store
        addTransaction(transaction)

        console.log("Transaction Saved", transaction)
        setIsReviewOpen(false)

        // Clear items
        setItems([])

        // Redirect to history page
        navigate('/history')
    }

    // Handle scanned receipt data
    const handleScanComplete = (data) => {
        setScanData(data)
        setIsScanConfirmOpen(true)
    }

    // Add confirmed scanned items to the list
    const handleConfirmScannedItems = (scannedItems) => {
        setItems([...items, ...scannedItems])
        setScanData(null)
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

    return (
        <div className="p-4 lg:p-8 animate-fade-in">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                <Link to="/" className="hover:text-primary transition-colors">Transactions</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 dark:text-slate-100">Add New Transaction</span>
            </nav>

            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Add New Transaction</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-xs font-mono">Session: #STR-2026012401</span>
                        <span className="size-1.5 rounded-full bg-green-500"></span>
                        <span className="text-xs text-slate-400">Active Session</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left 2 columns */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Table */}
                    <ItemsTable items={items} onDelete={handleDeleteItem} onEdit={handleEditItem} />

                    {/* Add Item Form */}
                    <AddItemForm onAddItem={handleAddItem} />
                </div>

                {/* Sidebar - Right column */}
                <div className="space-y-6 h-full">
                    {/* Receipt Scanner */}
                    <ReceiptUploader
                        onScanComplete={handleScanComplete}
                        isScanning={isScanning}
                        setIsScanning={setIsScanning}
                    />
                </div>
            </div>

            {/* Sticky Summary Footer */}
            <SummaryFooter totalAmount={totalAmount} onReview={() => setIsReviewOpen(true)} />

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onSave={handleSave}
                items={items}
                totalAmount={totalAmount}
            />

            {/* Scan Confirm Modal */}
            <ScanConfirmModal
                isOpen={isScanConfirmOpen}
                onClose={() => {
                    setIsScanConfirmOpen(false)
                    setScanData(null)
                }}
                scanData={scanData}
                onConfirm={handleConfirmScannedItems}
            />

            {/* Decoration / Metadata */}
            <div className="mt-8 flex justify-center text-slate-400 dark:text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">history</span>
                        <span>Auto-saved at 14:32</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        <span>Secure Connection</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

