import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import { signup } from '../services/authApi';

// ── Field must live OUTSIDE Signup so React keeps the same component
//    reference between renders (otherwise inputs remount on every keystroke)
const Field = ({ id, label, icon: Icon, type = 'text', placeholder, value, onChange, error, isPassword, showPassword, onTogglePassword }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            {label}
        </label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: error ? '#f43f5e' : '#475569' }} size={15} />
            <input
                id={id}
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-base pl-11 pr-11"
                style={{ borderColor: error ? 'rgba(244,63,94,0.5)' : undefined }}
                autoComplete={isPassword ? 'new-password' : 'off'}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#475569' }}
                    tabIndex={-1}
                >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
            )}
        </div>
        {error && <p className="text-xs mt-1" style={{ color: '#f43f5e' }}>{error}</p>}
    </div>
);

const benefits = [
    'Generate multilingual captions instantly',
    'Build accessible voice outputs',
    'Save & review your caption history',
];

const Signup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    // Use functional update to avoid stale closure
    const handleChange = (key) => (e) => {
        const value = e.target.value;
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
        if (apiError) setApiError('');
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
        if (form.password.length < 6) e.password = 'Minimum 6 characters';
        if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setApiError('');
        setLoading(true);
        try {
            await signup({
                full_name: form.name,
                email: form.email,
                password: form.password,
                confirm_password: form.confirm,
            });
            navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        } catch (err) {
            setApiError(err.message);
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

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-center">

                {/* ── Left: Benefits panel */}
                <motion.div
                    initial={{ opacity: 0, x: -28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden md:flex flex-col justify-center p-10 rounded-2xl relative overflow-hidden"
                    style={{
                        background: 'rgba(30, 41, 59, 0.45)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(124,58,237,0.2)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                    }}
                >
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                    <h2 className="text-3xl font-bold mb-3 leading-tight relative z-10"
                        style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
                        Start Your<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>AI Journey Free</span>
                    </h2>

                    <p className="text-sm mb-10 relative z-10 leading-relaxed" style={{ color: '#94A3B8' }}>
                        Join thousands of developers and researchers using SceneSense AI
                        to power accessible, multilingual experiences.
                    </p>

                    <ul className="space-y-4 relative z-10">
                        {benefits.map((b) => (
                            <li key={b} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)' }}>
                                    <FiCheck size={12} style={{ color: '#06B6D4' }} />
                                </div>
                                <span className="text-sm" style={{ color: '#CBD5E1' }}>{b}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, #7C3AED60, #06B6D460, transparent)' }} />
                </motion.div>

                {/* ── Right: Signup form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-full relative rounded-2xl p-10"
                    style={{
                        background: 'rgba(30, 41, 59, 0.70)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.10)',
                    }}
                >
                    <div className="absolute top-0 left-12 right-12 h-px rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, #06B6D4, transparent)' }} />

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold mb-1.5"
                            style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
                            Create Account
                        </h1>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>
                            Already have one?{' '}
                            <Link to="/login" className="font-medium transition-colors hover:text-white" style={{ color: '#06B6D4' }}>
                                Log in
                            </Link>
                        </p>
                    </div>

                    {/* API error banner */}
                    {apiError && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl px-4 py-3 mb-5 text-sm"
                            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.35)', color: '#f43f5e' }}
                        >
                            {apiError}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <Field
                            id="name" label="Full Name" icon={FiUser}
                            placeholder="Alex Johnson"
                            value={form.name} onChange={handleChange('name')} error={errors.name}
                        />
                        <Field
                            id="email" label="Email" icon={FiMail} type="email"
                            placeholder="you@company.com"
                            value={form.email} onChange={handleChange('email')} error={errors.email}
                        />
                        <Field
                            id="password" label="Password" icon={FiLock}
                            placeholder="Min. 6 characters"
                            value={form.password} onChange={handleChange('password')} error={errors.password}
                            isPassword showPassword={showPass} onTogglePassword={() => setShowPass(p => !p)}
                        />
                        <Field
                            id="confirm" label="Confirm Password" icon={FiLock}
                            placeholder="Repeat password"
                            value={form.confirm} onChange={handleChange('confirm')} error={errors.confirm}
                            isPassword showPassword={showConfirm} onTogglePassword={() => setShowConfirm(p => !p)}
                        />

                        <div className="pt-2">
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">Create Account <FiArrowRight /></span>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: '#475569' }}>
                        By signing up you agree to our{' '}
                        <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
