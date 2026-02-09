import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ItemsTable from '@/components/transaction/ItemsTable'
import AddItemForm from '@/components/transaction/AddItemForm'
import SummaryFooter from '@/components/transaction/SummaryFooter'
import ReviewModal from '@/components/transaction/ReviewModal'
import ReceiptUploader from '@/components/transaction/ReceiptUploader'
import ScanConfirmModal from '@/components/transaction/ScanConfirmModal'
import SuccessModal from '@/components/common/SuccessModal'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { useCategories } from '@/hooks/useCategories'
import { useCreateTransaction } from '@/hooks/useTransactions'

export default function AddTransaction() {
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [items, setItems] = useState([])
    const navigate = useNavigate()

    // Use API hooks
    const { data: categories } = useCategories()
    const createTransaction = useCreateTransaction()
    const categoryList = categories || []

    // Receipt scanner state
    const [isScanning, setIsScanning] = useState(false)
    const [isScanConfirmOpen, setIsScanConfirmOpen] = useState(false)
    const [scanData, setScanData] = useState(null)

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [savedTransactionsCount, setSavedTransactionsCount] = useState(0)
    const [successSummary, setSuccessSummary] = useState([])

    // Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const handleAddItem = (item) => {
        setItems([...items, item])
    }

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleEditItem = (editedItem) => {
        setItems(items.map(item => item.id === editedItem.id ? editedItem : item))
    }

    // Helper function to group items by date
    const groupItemsByDate = (items) => {
        const grouped = {}

        items.forEach(item => {
            const date = item.date || new Date().toISOString().split('T')[0]
            if (!grouped[date]) {
                grouped[date] = []
            }
            grouped[date].push(item)
        })

        return Object.entries(grouped).map(([date, items]) => ({
            date,
            items
        }))
    }

    const handleSave = async () => {
        if (items.length === 0) {
            alert('Please add at least one item before saving')
            return
        }

        // Group items by date
        const dateGroups = groupItemsByDate(items)

        console.log(`Creating ${dateGroups.length} transaction(s) from ${items.length} item(s)`)

        try {
            // Create a transaction for each date group via API
            for (let groupIndex = 0; groupIndex < dateGroups.length; groupIndex++) {
                const group = dateGroups[groupIndex]
                const groupItems = group.items
                const transactionDate = group.date

                // Get the most common category from this group's items
                let categoryId = groupItems[0]?.category
                if (!categoryId && categoryList.length > 0) {
                    categoryId = categoryList[0].id
                }

                // Calculate total for this date group
                const groupTotal = groupItems.reduce((sum, item) => sum + item.total, 0)

                // Create transaction via API (use camelCase to match API schema)
                const transactionData = {
                    categoryId: categoryId, // UUID string
                    description: groupItems.length > 1
                        ? `Multiple items (${groupItems.length})`
                        : groupItems[0].name,
                    totalPrice: groupTotal,
                    transactionDate: transactionDate,
                    items: groupItems.map((item, index) => ({
                        productNumber: index + 1,
                        name: item.name,
                        description: item.description || item.name,
                        location: item.location || undefined,
                        date: item.date || undefined,
                        quantity: item.quantity,
                        unitPrice: item.price,
                        totalPrice: item.total,
                    }))
                }

                await createTransaction.mutateAsync(transactionData)

                console.log(`Transaction ${groupIndex + 1}/${dateGroups.length} saved:`, {
                    date: transactionDate,
                    items: groupItems.length,
                    total: groupTotal
                })
            }

            // Show success message
            const summary = dateGroups.map(g => ({
                count: g.items.length,
                date: new Date(g.date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            }))

            setSavedTransactionsCount(dateGroups.length)
            setSuccessSummary(summary)
            setIsReviewOpen(false)
            setShowSuccessModal(true)
        } catch (error) {
            console.error('Failed to save transaction:', error)
            alert('Failed to save transaction. Please try again.')
        }
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        setItems([])
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

    const handleCancelTransaction = () => {
        if (items.length > 0) {
            setIsDeleteModalOpen(true)
        }
    }

    const handleConfirmCancel = () => {
        setItems([])
        setIsDeleteModalOpen(false)
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
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-dark text-slate-500 dark:text-slate-400 text-xs font-mono">Session: #STR-{new Date().toISOString().split('T')[0].replace(/-/g, '')}</span>
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
            <SummaryFooter
                totalAmount={totalAmount}
                onReview={() => setIsReviewOpen(true)}
                onCancel={handleCancelTransaction}
            />

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

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                message={
                    <>
                        Successfully saved {savedTransactionsCount} transaction(s): <br />
                        {successSummary.map((s, i) => (
                            <div key={i} className="text-slate-900 dark:text-white font-semibold mt-1">
                                {s.count} item(s) on {s.date}
                            </div>
                        ))}
                    </>
                }
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Transaction?"
                message="Are you sure you want to cancel this transaction and clear"
                itemName="all items"
            />

            {/* Decoration / Metadata */}
            <div className="mt-8 flex justify-center text-slate-400 dark:text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">history</span>
                        <span>Auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
