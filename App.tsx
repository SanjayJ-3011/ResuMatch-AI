import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { JobService } from './services/jobService';
import { GeminiService } from './services/geminiService';
import { AnalysisService } from './services/analysisService';
import { Job, CompleteAnalysis } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Define the props interface explicitly for better Type inference
interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs on mount
  const loadJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const fetchedJobs = await JobService.getAllJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleJobsUpdate = () => {
    // Reload jobs from Firestore
    loadJobs();
  };

  const handleFileUpload = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // 1. Analyze Resume
      const resumeResult = await GeminiService.analyzeResume(base64, mimeType);

      // 2. Match with current jobs
      const matches = await GeminiService.matchJobs(resumeResult, jobs);

      // 3. Save analysis to Firestore (if user is logged in)
      if (user?.id) {
        try {
          await AnalysisService.saveAnalysis(user.id, resumeResult, matches);
          console.log('Analysis saved to Firestore');
        } catch (saveError) {
          console.error('Error saving analysis (non-blocking):', saveError);
          // Don't block the user from seeing results
        }
      }

      setAnalysis({
        resume: resumeResult,
        matches: matches
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={
          <ProtectedRoute>
            {!analysis ? (
              <div className="relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-gray-900 via-gray-900 to-brand-900/20 -z-10"></div>
                <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-[100px] left-[-50px] w-72 h-72 bg-brand-900/20 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center animate-in fade-in duration-700">

                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 shadow-sm mb-8 transition-transform hover:scale-105 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-brand-400 mr-2 animate-pulse"></span>
                    <span className="text-xs font-semibold text-brand-200 uppercase tracking-wide">AI-Powered Career Intelligence</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                    Find the jobs <br />
                    <span className="text-gradient">you were meant for.</span>
                  </h1>

                  {/* Subhead */}
                  <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                    Stop applying blindly. Upload your resume to get instant ATS feedback, precision job matching, and a personalized skill improvement plan.
                  </p>

                  {/* Upload Section */}
                  <div className="w-full max-w-2xl">
                    <FileUpload onUpload={handleFileUpload} isLoading={isAnalyzing} />
                  </div>

                  {/* Loading State Overlay */}
                  {isAnalyzing && (
                    <div className="mt-8 flex flex-col items-center animate-pulse gap-3">
                      <div className="h-1 w-48 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div className="h-full bg-brand-500 animate-[width_1s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
                      </div>
                      <p className="text-gray-400 font-medium text-sm">Analyzing your profile & matching jobs...</p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-8 p-4 bg-error-900/20 text-error-300 rounded-xl border border-error-800 text-sm font-medium flex items-center shadow-sm max-w-md mx-auto">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {error}
                    </div>
                  )}

                  {/* Social Proof / Trust */}
                  <div className="mt-20 pt-10 border-t border-gray-800 w-full flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Trusted Technology</p>
                    <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                      <span className="text-xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-600 rounded-full"></div>Gemini 3.0</span>
                      <span className="text-xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-600 rounded-full"></div>Google Cloud</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Dashboard
                analysis={analysis}
                jobs={jobs}
                onReset={() => setAnalysis(null)}
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <div className="max-w-7xl mx-auto px-6 py-12">
              <AdminPanel jobs={jobs} onUpdate={handleJobsUpdate} />
            </div>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;