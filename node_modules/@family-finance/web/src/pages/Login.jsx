import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

export default function Login() {
    const navigate = useNavigate()
    const { login, error, clearError } = useAuthStore()

    const [email, setEmail] = useState('demo@familyfinance.com')
    const [password, setPassword] = useState('password123')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        clearError()

        // Simulate async login
        setTimeout(() => {
            const result = login(email, password)
            setIsLoading(false)

            if (result.success) {
                navigate('/')
            }
        }, 500)
    }

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden font-display p-4 sm:p-6 lg:p-8">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg p-8 relative z-10 animate-fade-in">
                <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-3xl text-white">account_balance_wallet</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to manage your family finance</p>
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

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-600 bg-transparent text-primary focus:ring-primary/50" />
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-primary hover:text-primary-100 transition-colors font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-xs text-slate-500">Or continue with</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-background-dark/50 border border-border-dark text-white hover:bg-white/10 transition-all cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-sm">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-background-dark/50 border border-border-dark text-white hover:bg-white/10 transition-all cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            <span className="font-medium text-sm">Apple</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:text-primary-100 font-bold transition-colors">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
