import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans text-gray-100 selection:bg-brand-500/30 selection:text-brand-200">
      {!isAuthPage && (
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo Area */}
              <NavLink to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-glow border border-white/10 group-hover:scale-105 transition-transform">
                  R
                </div>
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-gray-100 transition-colors">
                  ResuMatch <span className="text-brand-400">AI</span>
                </span>
              </NavLink>

              {/* Navigation Links & Auth */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-800/50 p-1 rounded-full border border-gray-700">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => `px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-gray-700 text-white shadow-sm ring-1 ring-white/5' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    Match
                  </NavLink>
                  
                  {/* Show Vacancy management for all logged in users */}
                  {isAuthenticated && (
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => `px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-gray-700 text-white shadow-sm ring-1 ring-white/5' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      Vacancies
                    </NavLink>
                  )}
                </div>

                {/* Auth Buttons */}
                {isAuthenticated && user && (
                  <div className="relative ml-2">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-3 focus:outline-none"
                    >
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white leading-none">{user.name}</div>
                        <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{user.role}</div>
                      </div>
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-full border border-gray-600 shadow-sm hover:border-brand-400 transition-colors"
                      />
                    </button>

                    {/* Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-xl py-1 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-gray-700 sm:hidden">
                          <div className="text-sm font-bold text-white">{user.name}</div>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                    
                    {/* Backdrop to close dropdown */}
                    {isProfileOpen && (
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="flex-1 w-full mx-auto">
        {children}
      </main>

      {!isAuthPage && (
        <footer className="border-t border-gray-800 bg-gray-900/50 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} ResuMatch AI. Powered by Gemini.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
               <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;