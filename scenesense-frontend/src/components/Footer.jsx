import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiCamera } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const footerBg = isLight ? 'rgba(228, 234, 246, 0.85)' : 'rgba(0,0,0,0.4)';
    const borderColor = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
    const textColor = isLight ? '#64748B' : '#64748B';
    const headingColor = isLight ? '#0F172A' : '#F1F5F9';

    return (
        <footer className="relative z-10 border-t pt-20 pb-10"
            style={{ borderColor, background: footerBg, transition: 'background 0.3s' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                <FiCamera className="text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">SceneSense AI</span>
                        </Link>
                        <p className="max-w-xs leading-relaxed text-sm" style={{ color: textColor }}>
                            Multimodal AI platform for image understanding, multilingual translation,
                            and accessible voice synthesis — powered by BLIP, NLLB-200, and gTTS.
                        </p>
                        {/* Palette preview strip */}
                        <div className="flex gap-2 mt-6">
                            {['#00d4ff', '#7c3aed', '#e879f9', '#f43f5e'].map(c => (
                                <div key={c} className="w-6 h-6 rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}80` }} />
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest"
                            style={{ color: '#00d4ff' }}>Product</h4>
                        <ul className="space-y-3 text-sm" style={{ color: textColor }}>
                            {['Features', 'How it Works', 'Pricing', 'API Access'].map(l => (
                                <li key={l}><a href="#" className="hover:text-violet-500 transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest"
                            style={{ color: '#a855f7' }}>Connect</h4>
                        <div className="flex gap-3">
                            {[
                                { Icon: FiGithub, label: 'GitHub', color: '#00d4ff' },
                                { Icon: FiTwitter, label: 'Twitter', color: '#a855f7' },
                                { Icon: FiLinkedin, label: 'LinkedIn', color: '#e879f9' },
                            ].map(({ Icon, label, color }) => (
                                <a key={label} href="#" aria-label={label}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 16px ${color}40`}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm"
                    style={{ borderColor, color: textColor }}>
                    <p>© {new Date().getFullYear()} SceneSense AI · Built with ❤️ & AI</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-violet-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-violet-500 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
