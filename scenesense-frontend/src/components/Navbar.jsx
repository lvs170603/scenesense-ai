import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    const links = [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Login', to: '/login' },
    ];

    const navBg = isLight
        ? 'rgba(240, 244, 250, 0.85)'
        : 'rgba(15, 23, 42, 0.75)';
    const navBorder = isLight
        ? 'rgba(124, 58, 237, 0.12)'
        : 'rgba(124, 58, 237, 0.15)';
    const linkColor = isLight ? '#475569' : '#94A3B8';
    const mobileBg = isLight ? 'rgba(240,244,250,0.97)' : 'rgba(15,23,42,0.95)';

    return (
        <motion.nav
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full"
            style={{
                background: navBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${navBorder}`,
                boxShadow: isLight ? '0 1px 20px rgba(0,0,0,0.08)' : '0 1px 40px rgba(0,0,0,0.4)',
                transition: 'background 0.3s, box-shadow 0.3s',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                        }}>
                        <FiCamera className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                        SceneSense AI
                    </span>
                </Link>

                {/* Desktop Links + Toggle */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: linkColor }}>
                    {links.map(l =>
                        l.to ? (
                            <Link key={l.label} to={l.to}
                                className="hover:text-violet-500 transition-colors duration-200">
                                {l.label}
                            </Link>
                        ) : (
                            <a key={l.label} href={l.href}
                                className="hover:text-violet-500 transition-colors duration-200">
                                {l.label}
                            </a>
                        )
                    )}

                    {/* Theme toggle button */}
                    <button
                        id="theme-toggle"
                        onClick={toggleTheme}
                        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{
                            background: isLight ? 'rgba(124,58,237,0.10)' : 'rgba(255,255,255,0.07)',
                            border: `1px solid ${isLight ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.12)'}`,
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={theme}
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLight
                                    ? <FiMoon size={18} style={{ color: '#7C3AED' }} />
                                    : <FiSun size={18} style={{ color: '#fbbf24' }} />
                                }
                            </motion.span>
                        </AnimatePresence>
                    </button>

                    <Link to="/app" className="btn-primary py-2 px-5 text-sm">
                        <span>Get Started →</span>
                    </Link>
                </div>

                {/* Mobile: toggle + hamburger */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        id="theme-toggle-mobile"
                        onClick={toggleTheme}
                        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                            background: isLight ? 'rgba(124,58,237,0.10)' : 'rgba(255,255,255,0.07)',
                            border: `1px solid ${isLight ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.1)'}`,
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={theme}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isLight
                                    ? <FiMoon size={16} style={{ color: '#7C3AED' }} />
                                    : <FiSun size={16} style={{ color: '#fbbf24' }} />
                                }
                            </motion.span>
                        </AnimatePresence>
                    </button>
                    <button className="p-2 rounded-lg transition-colors"
                        style={{ color: linkColor }}
                        onClick={() => setOpen(!open)}>
                        {open ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-3 border-t"
                    style={{
                        background: mobileBg,
                        borderColor: navBorder,
                        transition: 'background 0.3s',
                    }}
                >
                    {links.map(l =>
                        l.to ? (
                            <Link key={l.label} to={l.to} onClick={() => setOpen(false)}
                                className="py-2 transition-colors font-medium hover:text-violet-500"
                                style={{ color: linkColor }}>
                                {l.label}
                            </Link>
                        ) : (
                            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                                className="py-2 transition-colors font-medium hover:text-violet-500"
                                style={{ color: linkColor }}>
                                {l.label}
                            </a>
                        )
                    )}
                    <Link to="/app" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">
                        <span>Get Started</span>
                    </Link>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
