import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlayCircle, FiZap } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section className="relative pt-36 pb-28 lg:pt-56 lg:pb-44 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                {/* Live badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="section-label mx-auto w-fit"
                >
                    <FiZap size={12} />
                    BLIP · NLLB-200 · gTTS — Pipeline Live
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.06] mb-7"
                    style={{
                        color: isLight ? '#0F172A' : '#F1F5F9',
                        transition: 'color 0.3s',
                    }}
                >
                    Understand Images<br />
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 55%, #e879f9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        with State-of-the-Art AI
                    </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-12"
                    style={{ color: isLight ? '#475569' : '#94A3B8', transition: 'color 0.3s' }}
                >
                    Upload an image and let our multimodal AI generate context-aware captions,
                    translate them into 20+ languages, and synthesize natural voice output — in seconds.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/app" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-9 text-base">
                        <span className="flex items-center gap-2">Try It Now <FiArrowRight /></span>
                    </Link>
                    <a href="#how-it-works"
                        className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-9 text-base">
                        <FiPlayCircle style={{ color: '#06B6D4' }} />
                        <span>See How it Works</span>
                    </a>
                </motion.div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="mt-24 flex flex-wrap justify-center gap-x-20 gap-y-8"
                >
                    {[
                        { v: '20+ Languages', l: 'NLLB-200 Model' },
                        { v: 'BLIP', l: 'Salesforce Model' },
                        { v: 'NLLB-200', l: 'Meta AI Translation' },
                        { v: 'gTTS', l: 'Voice Synthesis' },
                    ].map(({ v, l }) => (
                        <div key={v} className="text-center px-4 border-l first:border-none"
                            style={{ borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}>
                            <div className="text-xl font-bold mb-1"
                                style={{
                                    background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>{v}</div>
                            <div className="text-xs uppercase tracking-widest"
                                style={{ color: isLight ? '#64748B' : '#475569' }}>{l}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
