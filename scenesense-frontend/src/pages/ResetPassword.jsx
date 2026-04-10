import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCamera, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { resetPassword } from '../services/authApi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const initialEmail = searchParams.get('email') || '';
    
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !otp || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const data = await resetPassword({ 
                email, 
                otp, 
                new_password: newPassword, 
                confirm_password: confirmPassword 
            });
            
            setSuccess(data.message || 'Password successfully reset. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
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

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2"
                        style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
                        Set New Password
                    </h1>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>
                        Enter the OTP sent to your email and choose a new password.
                    </p>
                </div>

                {/* Success banner */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.35)', color: '#06B6D4' }}
                    >
                        <FiCheckCircle size={16} className="flex-shrink-0" />
                        {success}
                    </motion.div>
                )}

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

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                                placeholder="you@company.com"
                                className="input-base pl-11"
                                readOnly={!!initialEmail}
                                style={{ opacity: initialEmail ? 0.7 : 1, cursor: initialEmail ? 'not-allowed' : 'text' }}
                            />
                        </div>
                    </div>

                    {/* OTP */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider"
                            style={{ color: '#94A3B8' }}>6-Digit OTP</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setOtp(val);
                                if(error) setError('');
                            }}
                            placeholder="• • • • • •"
                            className="input-base text-center tracking-[0.5em] font-bold"
                            style={{ letterSpacing: '0.5em' }}
                        />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider"
                            style={{ color: '#94A3B8' }}>New Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: '#475569' }} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); if(error) setError(''); }}
                                placeholder="••••••••"
                                className="input-base pl-11 pr-11"
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

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider"
                            style={{ color: '#94A3B8' }}>Confirm Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: '#475569' }} />
                            <input
                                type={showConfirmPass ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); if(error) setError(''); }}
                                placeholder="••••••••"
                                className="input-base pl-11 pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: '#475569' }}
                                tabIndex={-1}
                            >
                                {showConfirmPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-4">
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">Reset Password <FiArrowRight /></span>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
