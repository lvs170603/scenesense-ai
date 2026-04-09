import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGift, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const TrialSection = () => {
    const [count, setCount] = useState(0);
    const controls = useAnimation();
    const { theme } = useTheme();
    const isLight = theme === 'light';

    useEffect(() => {
        const sequence = async () => {
            await controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
        };
    }, [controls]);

    return (
        <section className="py-20 relative z-10 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    onViewportEnter={() => {
                        setCount(0);
                        let current = 0;
                        const timer = setInterval(() => {
                            if (current < 2) {
                                current++;
                                setCount(current);
                            } else clearInterval(timer);
                        }, 600);
                    }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-[2rem] p-[1px] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.5))' }}
                >
                    {/* Inner Card */}
                    <div
                        className="rounded-[calc(2rem-1px)] p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl transition-colors duration-300"
                        style={{
                            background: isLight
                                ? 'rgba(255,255,255,0.82)'
                                : '#0F172A',
                        }}
                    >

                        {/* Background effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">

                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium text-sm mb-6 border border-emerald-500/20">
                                    <FiGift /> No Credit Card Required
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 tracking-tight transition-colors duration-300"
                                    style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                                    Try SceneSense AI for <span className="text-cyan-500">free!</span>
                                </h2>
                                <p className="text-lg mb-0 max-w-lg transition-colors duration-300"
                                    style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                                    Curious about the quality? You can generate captions for your first images entirely free. After that, create a secure account to save your history forever.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                {/* Counter visual */}
                                <div
                                    className="w-32 h-32 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative transition-colors duration-300"
                                    style={{
                                        background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.5)',
                                        border: isLight ? '1px solid rgba(124,58,237,0.20)' : '1px solid rgba(100,116,139,0.4)',
                                        boxShadow: isLight ? '0 8px 32px rgba(124,58,237,0.15)' : undefined,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl pointer-events-none" />
                                    <span className="text-5xl font-extrabold bg-clip-text text-transparent"
                                        style={{ backgroundImage: isLight ? 'linear-gradient(to bottom, #7C3AED, #06B6D4)' : 'linear-gradient(to bottom, #fff, #94A3B8)' }}>
                                        {count}
                                    </span>
                                    <span className={`text-xs uppercase tracking-widest font-semibold mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Free Uses</span>
                                </div>

                                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="btn-primary flex items-center gap-2 whitespace-nowrap px-8 py-3">
                                    Start Free Trial <FiArrowRight />
                                </Link>
                            </div>

                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default TrialSection;
