import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ParticleBackground from './components/ParticleBackground';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getToken } from './services/authApi';

const ProtectedRoute = ({ children }) => {
    const token = getToken();
    
    // If there is no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function AppShell() {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <BrowserRouter>

            {/* ── Fixed multi-layer background ─────────────────────── */}
            {/* Layer 1: gradient animated background */}
            <div className="gradient-bg" aria-hidden="true" />

            {/* Layer 2: large soft orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-[-15%] left-[-5%] w-[520px] h-[520px] rounded-full animate-blob"
                    style={{
                        background: isLight
                            ? 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    className="absolute top-[50%] right-[-10%] w-[480px] h-[480px] rounded-full animate-blob delay-4"
                    style={{
                        background: isLight
                            ? 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    className="absolute bottom-[-20%] left-[30%] w-[400px] h-[400px] rounded-full animate-blob delay-2"
                    style={{
                        background: isLight
                            ? 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(232,121,249,0.12) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>

            {/* Layer 3: particles */}
            <ParticleBackground />

            {/* ── App content ──────────────────────────────────────── */}
            <div className="relative z-10 min-h-screen flex flex-col">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/app" element={<Home />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppShell />
        </ThemeProvider>
    );
}

export default App;
