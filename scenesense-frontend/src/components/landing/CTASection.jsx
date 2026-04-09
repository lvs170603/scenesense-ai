import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const CTASection = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section className="py-24 relative overflow-hidden z-20">

            {/* Animated background blobs */}
            <div className="absolute inset-0 z-0" style={{ opacity: isLight ? 0.2 : 0.40 }}>
                <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500 rounded-full blur-[120px] animate-blob ${isLight ? '' : 'mix-blend-screen'}`} />
                <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[120px] animate-blob delay-4 ${isLight ? '' : 'mix-blend-screen'}`} />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden"
                    style={{
                        border: isLight
                            ? '1px solid rgba(255,255,255,0.60)'
                            : '1px solid rgba(255,255,255,0.10)',
                        boxShadow: isLight
                            ? '0 20px 80px rgba(124,58,237,0.18), 0 8px 32px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.95)'
                            : '0 0 80px rgba(124,58,237,0.2)',
                    }}
                >
                    {/* Subtle noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

                    <h2 className="text-4xl md:text-6xl font-black font-poppins mb-6 tracking-tight drop-shadow-lg transition-colors duration-300"
                        style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                        Start Generating <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">
                            AI Captions Today
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors duration-300"
                        style={{ color: isLight ? '#475569' : '#CBD5E1' }}>
                        Join thousands of developers, researchers, and creators using SceneSense AI to power accessible, multilingual experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" onClick={() => window.scrollTo(0, 0)}
                            className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-10 w-full sm:w-auto shadow-xl">
                            Create Free Account <FiArrowRight />
                        </Link>
                        <Link to="/login" onClick={() => window.scrollTo(0, 0)}
                            className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-10 w-full sm:w-auto transition-all">
                            Log in to Dashboard
                        </Link>
                    </div>

                    <p className="mt-8 text-sm transition-colors duration-300"
                        style={{ color: isLight ? '#94A3B8' : '#64748B' }}>
                        No credit card required. Includes a free trial of our generation pipeline.
                    </p>

                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
