import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import clsx from 'clsx'

export default function Register() {
    const navigate = useNavigate()
    const { register, error, clearError, isLoading } = useAuthStore()

    const [formData, setFormData] = useState({
        fullName: '',
        role: 'Admin',
        phone: '',
        email: '',
        password: ''
    })
    const [passwordStrength, setPasswordStrength] = useState('weak')

    const calculateStrength = (password) => {
        if (!password) return 'none'
        if (password.length < 6) return 'weak'

        const hasSpecialOrNumber = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
        if (password.length >= 8 && hasSpecialOrNumber) return 'strong'

        return 'normal'
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'password') {
            setPasswordStrength(calculateStrength(value))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()

        const result = await register(formData.fullName, formData.email, formData.password)

        if (result.success) {
            // Redirect to login page with success message
            navigate('/login', {
                state: {
                    registrationSuccess: true,
                    email: formData.email
                }
            })
        }
    }

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return 'bg-red-500 text-red-500'
            case 'normal': return 'bg-amber-500 text-amber-500'
            case 'strong': return 'bg-emerald-500 text-emerald-500'
            default: return 'bg-slate-600 text-slate-500'
        }
    }

    const getStrengthLabel = () => {
        switch (passwordStrength) {
            case 'weak': return 'Weak'
            case 'normal': return 'Normal'
            case 'strong': return 'Strong'
            default: return ''
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden font-display p-4">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg p-0 relative z-10 animate-fade-in">
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-2xl text-white">person_add</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join Family Finance to manage your budget</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <div className="flex items-center gap-2 text-red-400">
                                <span className="material-symbols-outlined text-sm">error</span>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Role (Read-only) */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Role</label>
                            <div className="relative">
                                <input
                                    name="role"
                                    type="text"
                                    disabled
                                    value={formData.role}
                                    className="w-full bg-background-dark/30 border border-border-dark rounded-xl py-2.5 px-4 text-slate-400 select-none cursor-not-allowed text-sm"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded">DEFAULT</span>
                            </div>
                        </div>

                        {/* Telephone & Email Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Telephone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                    placeholder="+62..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password with Strength */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                    placeholder="Create a password (min 8 characters)"
                                />
                            </div>
                            {/* Strength Indicator */}
                            {formData.password && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full transition-all duration-300", getStrengthColor().split(' ')[0])}
                                            style={{
                                                width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'normal' ? '66%' : '100%'
                                            }}
                                        ></div>
                                    </div>
                                    <span className={clsx("text-xs font-bold uppercase", getStrengthColor().split(' ')[1])}>
                                        {getStrengthLabel()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || formData.password.length < 8}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-100 font-bold transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
