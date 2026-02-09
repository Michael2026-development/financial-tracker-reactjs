import React from 'react'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            {/* Modal Content Container */}
            <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                {/* Warning Icon */}
                <div className="mb-5 flex items-center justify-center size-14 rounded-full bg-red-50 dark:bg-red-950/30">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-3xl">warning</span>
                </div>

                {/* HeadlineText */}
                <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight text-center pb-2">
                    {title}
                </h3>

                {/* BodyText */}
                <div className="text-slate-600 dark:text-slate-300 text-[15px] font-normal leading-relaxed pb-6 px-4 text-center">
                    {message} <span className="font-bold text-slate-900 dark:text-white">{itemName}</span>? This action cannot be undone.
                </div>

                {/* ButtonGroup */}
                <div className="flex w-full gap-3 px-2">
                    <button
                        onClick={onClose}
                        className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <span className="truncate">Cancel</span>
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                    >
                        <span className="truncate">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
