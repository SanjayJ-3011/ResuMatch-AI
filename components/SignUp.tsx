import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setIsSubmitting(true);
        try {
            await signup(email, password, name);
            navigate('/');
        } catch (err: any) {
            console.error('Signup error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">

            {/* Left Side: Authentication Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 relative z-10 bg-gray-900">

                {/* Brand Logo */}
                <div className="absolute top-8 left-8 sm:left-12 lg:left-20 xl:left-24">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-glow border border-white/10 group-hover:scale-105 transition-transform">
                            R
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-gray-100 transition-colors">
                            ResuMatch <span className="text-brand-400">AI</span>
                        </span>
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto space-y-8 mt-12 lg:mt-0">

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Create Account
                        </h1>
                        <p className="text-gray-400 text-base">
                            Start your journey to your dream career today.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-error-900/10 border border-error-900/20 text-error-400 text-sm rounded-xl flex items-center animate-in fade-in slide-in-from-top-1">
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-gray-600"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-gray-600"
                                placeholder="name@work-email.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Sign Up'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-brand-400 font-semibold hover:underline cursor-pointer">Log In</Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual/Marketing */}
            <div className="hidden lg:flex w-1/2 bg-gray-800 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900/40"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"></div>

                <div className="relative z-10 p-12 max-w-lg text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Join the Future of Job Search</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Create an account to get unlimited resume scans, personalized job matches, and detailed skill gap analysis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
