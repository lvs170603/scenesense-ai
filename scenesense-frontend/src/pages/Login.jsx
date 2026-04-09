import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCamera, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { login, saveSession } from '../services/authApi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const data = await login({ email, password });

            if (data.verified === false) {
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
                return;
            }

            saveSession(data.token, data.user);
            navigate('/app');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">

            {/* Back to home */}
            <Link to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
                onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                        boxShadow: '0 0 16px rgba(124,58,237,0.4)',
                    }}>
                    <FiCamera className="text-white text-sm" />
                </div>
                SceneSense AI
            </Link>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-md relative rounded-2xl p-10"
                style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.12)',
                }}
            >
                {/* Top accent bar */}
                <div className="absolute top-0 left-12 right-12 h-px rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, #06B6D4, transparent)' }} />

                {/* Icon + heading */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
                            border: '1px solid rgba(124,58,237,0.3)',
                            boxShadow: '0 0 30px rgba(124,58,237,0.25)',
                        }}>
                        <FiCamera size={26} style={{ color: '#7C3AED' }} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2"
                        style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
                        Welcome Back
                    </h1>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>Log in to access your AI workspace.</p>
                </div>

                {/* Error banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.35)', color: '#f43f5e' }}
                    >
                        <FiAlertCircle size={15} className="flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider"
                            style={{ color: '#94A3B8' }}>Email</label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: '#475569' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="you@company.com"
                                className="input-base pl-11"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: '#94A3B8' }}>Password</label>
                            <a href="#" className="text-xs transition-colors hover:text-white"
                                style={{ color: '#7C3AED' }}>Forgot Password?</a>
                        </div>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: '#475569' }} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="input-base pl-11 pr-11"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: '#475569' }}
                                tabIndex={-1}
                            >
                                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2">
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">Login to Dashboard <FiArrowRight /></span>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-8" style={{ color: '#475569' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium transition-colors hover:text-white"
                        style={{ color: '#06B6D4' }}>
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
