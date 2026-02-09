import React from 'react'


const SuccessModal = ({ isOpen, onClose, title = "Success!", message, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[4px] animate-in fade-in duration-200">
            <div className="w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                <div className="mb-6 flex items-center justify-center size-20 rounded-full bg-green-50 dark:bg-green-500/10">
                    <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
                </div>

                <h3 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight text-center pb-3">
                    {title}
                </h3>

                <div className="text-slate-500 dark:text-slate-400 text-[16px] font-medium leading-relaxed pb-8 px-6 text-center">
                    {message || children}
                </div>

                <div className="flex w-full justify-center">
                    <button
                        onClick={onClose}
                        className="w-full max-w-[200px] flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-indigo-600 text-white text-base font-bold leading-normal tracking-wide hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                    >
                        <span className="truncate">OK</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessModal
