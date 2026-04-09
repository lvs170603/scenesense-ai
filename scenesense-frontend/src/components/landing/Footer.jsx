import React from 'react';
import { FiCamera, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <footer className="border-t pt-20 pb-10 relative z-10 transition-colors duration-300"
            style={{ 
                background: isLight ? 'rgba(255,255,255,0.7)' : '#0A0F1C',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)'
            }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Col */}
                    <div className="md:col-span-2">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 group mb-6 inline-flex">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                                }}>
                                <FiCamera className="text-white text-lg" />
                            </div>
                            <span className={`text-xl font-bold tracking-tight transition-colors ${isLight ? 'text-slate-800 group-hover:text-cyan-500' : 'text-white group-hover:text-cyan-400'}`}>
                                SceneSense AI
                            </span>
                        </Link>
                        <p className={`text-sm max-w-sm leading-relaxed mb-8 transition-colors duration-300 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            The production-ready AI platform that analyzes your images and generates beautiful, contextual descriptions in English, Hindi, and Telugu with native voice synthesis.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com" target="_blank" rel="noreferrer"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isLight
                                        ? 'bg-white border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:shadow-md hover:shadow-violet-100'
                                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-violet-500 hover:bg-violet-500/10'
                                }`}>
                                <FiGithub size={18} />
                            </a>
                            <a href="#"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isLight
                                        ? 'bg-white border border-slate-200 text-slate-500 hover:text-cyan-600 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-100'
                                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-500/10'
                                }`}>
                                <FiTwitter size={18} />
                            </a>
                            <a href="mailto:hello@scenesense.ai"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isLight
                                        ? 'bg-white border border-slate-200 text-slate-500 hover:text-fuchsia-600 hover:border-fuchsia-400 hover:shadow-md hover:shadow-fuchsia-100'
                                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-fuchsia-500 hover:bg-fuchsia-500/10'
                                }`}>
                                <FiMail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Product Col */}
                    <div>
                        <h4 className={`font-semibold mb-6 transition-colors duration-300 ${isLight ? 'text-slate-800' : 'text-white'}`}>Product</h4>
                        <ul className={`space-y-4 text-sm transition-colors duration-300 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className={`transition-colors ${isLight ? 'hover:text-cyan-600' : 'hover:text-cyan-400'}`}>Features</button></li>
                            <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className={`transition-colors ${isLight ? 'hover:text-violet-600' : 'hover:text-violet-400'}`}>How it Works</button></li>
                            <li><button onClick={() => document.getElementById('ai-showcase')?.scrollIntoView({ behavior: 'smooth' })} className={`transition-colors ${isLight ? 'hover:text-fuchsia-600' : 'hover:text-fuchsia-400'}`}>AI Capabilities</button></li>
                            <li><Link to="/login" onClick={() => window.scrollTo(0, 0)} className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Sign In</Link></li>
                        </ul>
                    </div>

                    {/* Legal Col */}
                    <div>
                        <h4 className={`font-semibold mb-6 transition-colors duration-300 ${isLight ? 'text-slate-800' : 'text-white'}`}>Legal</h4>
                        <ul className={`space-y-4 text-sm transition-colors duration-300 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Privacy Policy</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Terms of Service</a></li>
                            <li><a href="#" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Cookie Policy</a></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)' }}>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} SceneSense AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        Designed for the future of accessible AI.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
