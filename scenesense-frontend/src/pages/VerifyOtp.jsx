import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiShield, FiRefreshCw, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { verifyOtp, resendOtp } from '../services/authApi';

const RESEND_COOLDOWN = 60; // seconds

const VerifyOtp = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cooldown, setCooldown] = useState(0);

    // Start cooldown timer
    const startCooldown = useCallback(() => {
        setCooldown(RESEND_COOLDOWN);
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown(c => (c <= 1 ? 0 : c - 1)), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            await verifyOtp({ email, otp });
            setSuccess('Email verified! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;
        setError('');
        setSuccess('');
        setResending(true);
        try {
            await resendOtp({ email });
            setSuccess('A new OTP has been sent to your email.');
            startCooldown();
        } catch (err) {
            setError(err.message);
        } finally {
            setResending(false);
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
                        <FiShield size={26} style={{ color: '#7C3AED' }} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
                        Verify Email
                    </h1>
                    <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                        We sent a 6-digit OTP to<br />
                        <span className="font-medium" style={{ color: '#06B6D4' }}>{email}</span>
                    </p>
                </div>

                {/* Success */}
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

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl px-4 py-3 mb-5 text-sm"
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.35)', color: '#f43f5e' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleVerify} className="space-y-5">
                    {/* OTP input */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setOtp(val);
                                if (error) setError('');
                            }}
                            placeholder="• • • • • •"
                            className="input-base text-center text-2xl tracking-[0.5em] font-bold"
                            style={{
                                letterSpacing: '0.5em',
                                borderColor: error ? 'rgba(244,63,94,0.5)' : undefined,
                            }}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">Verify OTP <FiArrowRight /></span>
                        )}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                    <p className="text-sm mb-3" style={{ color: '#475569' }}>Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || resending}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: cooldown > 0 ? '#475569' : '#7C3AED' }}
                    >
                        <FiRefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                        {cooldown > 0
                            ? `Resend OTP in ${cooldown}s`
                            : resending
                                ? 'Sending…'
                                : 'Resend OTP'}
                    </button>
                </div>

                <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
                    Wrong account?{' '}
                    <Link to="/signup" className="font-medium transition-colors hover:text-white" style={{ color: '#06B6D4' }}>
                        Sign up again
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
