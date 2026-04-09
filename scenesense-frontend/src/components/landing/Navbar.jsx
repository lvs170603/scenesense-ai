import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glass-card' : 'py-6 bg-transparent border-transparent'
                    } ${scrolled ? 'rounded-none border-t-0 border-x-0 border-b' : ''}`}
                style={{
                    background: scrolled
                        ? (isLight
                            ? 'rgba(238, 242, 255, 0.85)'
                            : 'rgba(15, 23, 42, 0.75)')
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    webkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                    boxShadow: scrolled
                        ? (isLight
                            ? '0 4px 24px rgba(99,102,241,0.10), 0 1px 0 rgba(255,255,255,0.8)'
                            : '0 4px 30px rgba(0, 0, 0, 0.5)')
                        : 'none',
                    borderColor: scrolled
                        ? (isLight ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.05)')
                        : 'transparent'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                                boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                            }}>
                            <FiCamera className="text-white text-lg" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight transition-colors ${
                            isLight
                                ? 'text-slate-900 group-hover:text-violet-600'
                                : 'text-white group-hover:text-cyan-400'
                        }`}>
                            SceneSense AI
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => scrollToSection('features')} className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>How It Works</button>
                        <button onClick={() => scrollToSection('ai-showcase')} className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>Capabilities</button>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}
                            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {isLight ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>

                        <div className={`h-5 w-px ${isLight ? 'bg-slate-300' : 'bg-white/10'}`} />

                        <Link to="/login" className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>
                            Log in
                        </Link>
                        <Link to="/signup" className="btn-primary py-2.5 px-6 text-sm">
                            Sign Up Free
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-1.5 rounded-full transition-colors ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                        >
                            {isLight ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>
                        <button className={`${isLight ? 'text-slate-600' : 'text-slate-300'}`} onClick={() => setMobileMenuOpen(true)}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] p-4 flex flex-col"
                        style={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                                    <FiCamera className="text-white text-lg" />
                                </div>
                                <span className="text-xl font-bold text-white">SceneSense AI</span>
                            </div>
                            <button className="text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                                <FiX size={28} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-lg font-medium">
                            <button className="text-left text-slate-300 hover:text-white" onClick={() => scrollToSection('features')}>Features</button>
                            <button className="text-left text-slate-300 hover:text-white" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
                            <button className="text-left text-slate-300 hover:text-white" onClick={() => scrollToSection('ai-showcase')}>Capabilities</button>
                        </div>

                        <div className="mt-auto space-y-4 pt-8 border-t border-white/10">
                            <Link to="/login" className="block w-full text-center py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors">
                                Log in
                            </Link>
                            <Link to="/signup" className="btn-primary block w-full text-center py-3">
                                Sign Up Free
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
