import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUploadCloud, FiCpu, FiMessageSquare, FiVolume2 } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const steps = [
    {
        icon: FiUploadCloud,
        title: 'Upload Image',
        description: 'Drop any photo into the interface.',
        color: 'text-cyan-500',
        darkColor: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        shadowColor: 'rgba(6,182,212,0.18)',
    },
    {
        icon: FiCpu,
        title: 'AI Analysis',
        description: 'BLIP analyzes the scene context.',
        color: 'text-violet-600',
        darkColor: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/30',
        shadowColor: 'rgba(124,58,237,0.18)',
    },
    {
        icon: FiMessageSquare,
        title: 'Caption & Translate',
        description: 'Generates text in EN, HI, or TE.',
        color: 'text-fuchsia-600',
        darkColor: 'text-fuchsia-400',
        bg: 'bg-fuchsia-500/10',
        border: 'border-fuchsia-500/30',
        shadowColor: 'rgba(232,121,249,0.18)',
    },
    {
        icon: FiVolume2,
        title: 'Listen',
        description: 'Synthesizes native voice audio.',
        color: 'text-blue-600',
        darkColor: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        shadowColor: 'rgba(59,130,246,0.18)',
    }
];

const HowItWorks = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section id="how-it-works" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-label"
                    >
                        User Flow
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold font-poppins mb-6 transition-colors duration-300"
                        style={{ color: isLight ? '#0F172A' : '#ffffff' }}
                    >
                        Four steps to magic
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className={`hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r z-0 ${
                        isLight
                            ? 'from-slate-200 via-violet-300 to-slate-200'
                            : 'from-slate-800 via-violet-500/50 to-slate-800'
                    }`} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative flex flex-col items-center text-center z-10 group"
                            >
                                {/* Number Circle */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-6 transition-colors ${
                                    isLight
                                        ? 'bg-white border-2 border-slate-200 text-slate-500 group-hover:border-violet-400 group-hover:text-violet-600'
                                        : 'bg-slate-800 border-2 border-slate-700 text-slate-400 group-hover:border-violet-400 group-hover:text-violet-400'
                                }`}>
                                    {index + 1}
                                </div>

                                {/* Icon Container */}
                                <div
                                    className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${step.bg}`}
                                    style={{
                                        border: isLight
                                            ? `1px solid ${step.shadowColor.replace('0.18', '0.25')}`
                                            : '1px solid rgba(100,100,100,0.2)',
                                        boxShadow: isLight
                                            ? `0 8px 24px ${step.shadowColor}, 0 2px 8px rgba(0,0,0,0.06)`
                                            : 'none',
                                        background: isLight ? 'rgba(255,255,255,0.80)' : undefined,
                                    }}
                                >
                                    {/* Animated shimmer */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />
                                    <step.icon size={40} className={isLight ? step.color : step.darkColor} />
                                </div>

                                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isLight ? 'text-slate-800' : 'text-white'}`}>{step.title}</h3>
                                <p className={`text-sm transition-colors duration-300 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{step.description}</p>

                                {/* Mobile Arrows in between */}
                                {index < steps.length - 1 && (
                                    <div className={`md:hidden mt-8 animate-bounce ${isLight ? 'text-violet-300' : 'text-slate-600'}`}>
                                        <FiArrowRight size={24} className="rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
