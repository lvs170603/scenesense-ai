import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiImage, FiDatabase } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const screenshotDefs = [
    { icon: FiLayout, label: "Admin Dashboard", color: "cyan" },
    { icon: FiImage,   label: "Caption Generator", color: "violet" },
    { icon: FiDatabase, label: "History Panel", color: "pink" },
];

// Renders mockup content themed to light or dark
const MockupContent = ({ index, isLight }) => {
    // ── shared palette ────────────────────────────────────────────────
    const bg     = isLight ? 'rgba(255,255,255,0.95)' : 'rgb(2,6,23)';        // slate-950
    const card   = isLight ? 'rgba(241,245,249,0.95)' : 'rgb(15,23,42)';     // slate-900
    const block  = isLight ? '#E2E8F0'                : '#1E293B';            // slate-200 / slate-800
    const border = isLight ? 'rgba(124,58,237,0.12)'  : 'rgba(30,41,59,1)';  // light violet / slate-800

    if (index === 0) {
        return (
            <div className="flex flex-col gap-4 w-[400px] h-[250px] md:w-[600px] md:h-[350px] p-6 rounded-2xl border select-none transition-colors duration-300"
                style={{ background: bg, borderColor: border }}>
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-32 rounded-md" style={{ background: block }} />
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full" style={{ background: block }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: block }} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/4 h-24 rounded-xl" style={{
                        background: isLight ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.08)',
                        border: '1px solid rgba(6,182,212,0.25)'
                    }} />
                    <div className="w-1/4 h-24 rounded-xl" style={{
                        background: isLight ? 'rgba(124,58,237,0.10)' : 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.25)'
                    }} />
                    <div className="w-2/4 h-24 rounded-xl" style={{ background: block }} />
                </div>
                <div className="flex-1 rounded-xl border p-21" style={{ background: card, borderColor: border }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 rounded-md mb-2 w-full" style={{ background: block, opacity: 0.6 }} />
                    ))}
                </div>
            </div>
        );
    }

    if (index === 1) {
        return (
            <div className="flex flex-col md:flex-row gap-6 w-[400px] h-[250px] md:w-[600px] md:h-[350px] p-6 rounded-2xl border select-none transition-colors duration-300"
                style={{ background: bg, borderColor: border }}>
                <div className="flex-1 border-2 border-dashed rounded-xl flex items-center justify-center"
                    style={{
                        borderColor: isLight ? '#C7D2FE' : '#334155',
                        background: isLight ? 'rgba(238,242,255,0.6)' : 'rgb(15,23,42)',
                    }}>
                    <FiImage size={48} style={{ color: isLight ? '#A5B4FC' : '#475569' }} />
                </div>
                <div className="flex-[1.2] flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="h-8 w-1/3 rounded-md" style={{ background: block }} />
                        <div className="h-8 w-1/3 rounded-md" style={{ background: block }} />
                        <div className="h-8 w-1/3 rounded-md" style={{ background: block }} />
                    </div>
                    <div className="flex-1 rounded-xl border p-4" style={{ background: card, borderColor: border }}>
                        <div className="h-4 rounded-md w-3/4 mb-2" style={{ background: block }} />
                        <div className="h-4 rounded-md w-full mb-2" style={{ background: block }} />
                        <div className="h-4 rounded-md w-2/3" style={{ background: block }} />
                    </div>
                    <div className="h-12 bg-violet-600 rounded-xl w-full shadow-lg shadow-violet-500/30" />
                </div>
            </div>
        );
    }

    // index === 2: History Panel
    return (
        <div className="flex flex-col gap-4 w-[400px] h-[250px] md:w-[600px] md:h-[350px] p-6 rounded-2xl border select-none transition-colors duration-300"
            style={{ background: bg, borderColor: border }}>
            <div className="h-6 w-48 rounded-md mb-2" style={{ background: block }} />
            <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-xl flex gap-3 p-3 border"
                        style={{ background: card, borderColor: border }}>
                        <div className="w-20 h-full rounded-lg" style={{ background: block }} />
                        <div className="flex-1 flex flex-col gap-2 pt-1">
                            <div className="h-3 w-full rounded" style={{ background: block }} />
                            <div className="h-3 w-4/5 rounded" style={{ background: block }} />
                            <div className="mt-auto h-6 w-20 rounded-full" style={{
                                background: isLight ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.30)'
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScreenshotsSection = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section className="py-24 relative overflow-hidden transition-colors duration-300"
            style={{ background: isLight ? 'rgba(238, 242, 255, 0.6)' : '#0A0F1C' }}>

            <div className="text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-label"
                >
                    Interface
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold font-poppins transition-colors duration-300"
                    style={{ color: isLight ? '#0F172A' : '#ffffff' }}
                >
                    Clean, modern layouts
                </motion.h2>
            </div>

            {/* Infinite Scrolling Track */}
            <div className="w-full relative overflow-hidden flex pb-12 pt-4">

                {/* Fading Edges */}
                <div className="absolute top-0 bottom-0 left-0 w-32 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${isLight ? 'rgba(238,242,255,0.95)' : '#0A0F1C'}, transparent)` }} />
                <div className="absolute top-0 bottom-0 right-0 w-32 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to left, ${isLight ? 'rgba(238,242,255,0.95)' : '#0A0F1C'}, transparent)` }} />

                <motion.div
                    className="flex items-start gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {/* Render each screenshot twice for seamless loop */}
                    {[...screenshotDefs, ...screenshotDefs].map((shot, index) => (
                        <div key={index} className="flex flex-col shrink-0 group">
                            {/* Label */}
                            <div className="flex items-center gap-2 mb-4 ml-6 transition-transform group-hover:translate-x-2">
                                <shot.icon className={`text-${shot.color}-${isLight ? '500' : '400'}`} />
                                <span className={`font-medium text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{shot.label}</span>
                            </div>

                            {/* Mockup Card */}
                            <div className="relative rounded-2xl transition-transform duration-500 group-hover:-translate-y-2"
                                style={{
                                    boxShadow: isLight
                                        ? '0 8px 32px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)'
                                        : '0 0 0 0 transparent',
                                }}>
                                {/* Blur overlay on blur, lifted on hover */}
                                <div className="absolute inset-0 backdrop-blur-[2px] rounded-2xl transition-opacity duration-300 group-hover:opacity-0 z-20 pointer-events-none"
                                    style={{ background: isLight ? 'rgba(238,242,255,0.35)' : 'rgba(15,23,42,0.50)' }} />

                                <div className="absolute -inset-0.5 rounded-[18px] z-0 opacity-50 transition-opacity group-hover:opacity-100 blur-[2px] group-hover:bg-gradient-to-tr group-hover:from-violet-500/50 group-hover:to-cyan-500/50"
                                    style={{
                                        background: isLight
                                            ? 'linear-gradient(to tr, rgba(99,102,241,0.3), rgba(6,182,212,0.3))'
                                            : 'linear-gradient(to tr, #1e293b, #334155)',
                                    }}
                                />

                                <div className="relative z-10">
                                    <MockupContent index={index % screenshotDefs.length} isLight={isLight} />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ScreenshotsSection;
