import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to where they came from or default to admin if admin, else home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Determine redirect based on role if no specific 'from' location
      if (email.includes('admin') && from === '/') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@resumatch.ai');
      setPassword('admin');
    } else {
      setEmail('user@resumatch.ai');
      setPassword('user');
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
              Welcome back
            </h1>
            <p className="text-gray-400 text-base">
              Enter your details to access your career dashboard.
            </p>
          </div>

          {/* Social Login Buttons (Visual Only) */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors bg-gray-800/50">
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="text-sm font-semibold">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors bg-gray-800/50">
               <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
               </svg>
               <span className="text-sm font-semibold">LinkedIn</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-error-900/10 border border-error-900/20 text-error-400 text-sm rounded-xl flex items-center animate-in fade-in slide-in-from-top-1">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-semibold text-brand-400 hover:text-brand-300">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                   Signing In...
                 </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Helpers */}
          <div className="p-5 bg-gray-800/40 rounded-2xl border border-gray-800">
             <p className="text-xs text-center text-gray-500 mb-3 uppercase tracking-widest font-bold">Quick Demo Access</p>
             <div className="flex gap-3">
               <button 
                 onClick={() => fillDemo('user')}
                 className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors hover:border-brand-500/30"
               >
                 👤 Candidate
               </button>
               <button 
                 onClick={() => fillDemo('admin')}
                 className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors hover:border-brand-500/30"
               >
                 🛡️ Admin
               </button>
             </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Don't have an account? <span className="text-brand-400 font-semibold hover:underline cursor-pointer">Start for free</span>
          </div>
        </div>
      </div>

      {/* Right Side: Visual/Marketing (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-gray-800 relative overflow-hidden items-center justify-center">
         {/* Abstract Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900/40"></div>
         
         {/* Animated Blob */}
         <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"></div>
         
         {/* Glassmorphic Cards Illustration */}
         <div className="relative z-10 p-12 max-w-lg">
            <div className="relative">
               {/* Back Card */}
               <div className="absolute top-8 -right-8 w-64 h-32 bg-gray-700/30 backdrop-blur-md rounded-2xl border border-white/5 transform rotate-6 animate-[bounce_5s_infinite]"></div>
               
               {/* Main Card */}
               <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-3xl shadow-2xl relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <div className="h-2.5 w-32 bg-gray-600 rounded-full mb-2"></div>
                      <div className="h-2 w-20 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-gray-700/50 rounded-full">
                      <div className="h-full w-3/4 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                      <span>ATS Compatibility</span>
                      <span className="text-brand-400 font-bold">85%</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                     <div className="h-8 w-24 bg-gray-700/50 rounded-lg"></div>
                     <div className="h-8 w-24 bg-gray-700/50 rounded-lg"></div>
                  </div>
               </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Analyze. Improve. Succeed.</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Join thousands of professionals using AI to optimize their resumes and land their dream jobs faster.
              </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;