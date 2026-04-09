import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiPlayCircle, FiDownload, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const features = [
    {
        icon: FiSliders,
        title: 'Customizable Styles',
        description: 'Switch between Simple, Detailed, or Story modes. The AI adapts the caption length and tone to your exact needs.'
    },
    {
        icon: FiPlayCircle,
        title: 'Instant Native Playback',
        description: 'Hear exactly how the caption sounds in English, Hindi, or Telugu right inside your browser without external tools.'
    },
    {
        icon: FiCopy,
        title: 'Quick Actions',
        description: 'One-click copy to clipboard, rapid regeneration if you want a different take, and direct audio MP3 downloads.'
    }
];

const mockStyles = [
    { id: 'simple', label: 'Simple', text: '"A golden retriever puppy sitting."' },
    { id: 'detailed', label: 'Detailed', text: '"A cute golden retriever puppy sitting patiently in the middle of a sunlit park, looking directly at the camera."' },
    { id: 'story', label: 'Story', text: '"Once upon a time, a young golden retriever puppy found a perfect sunny spot in the park. He sat down patiently, waiting for his master to throw the yellow tennis ball..."' }
];

const AIFeatures = () => {
    const [activeStyle, setActiveStyle] = useState('detailed');
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section
            id="ai-showcase"
            className="py-24 relative z-10 overflow-hidden transition-colors duration-300"
            style={{
                background: isLight
                    ? 'linear-gradient(135deg, rgba(238,242,255,0.7) 0%, rgba(245,243,255,0.7) 100%)'
                    : 'rgba(15,23,42,0.40)',
            }}
        >
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="section-label">Advanced Tools</div>
                        <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6 leading-tight transition-colors duration-300"
                            style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                            Control the <span className={isLight ? 'text-violet-600' : 'text-violet-400'}>nuance</span> of your AI output.
                        </h2>
                        <p className="text-lg mb-12 transition-colors duration-300"
                            style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                            SceneSense is designed for creators and developers who need precision. Tweak the generation parameters to match your specific content requirements.
                        </p>

                        <div className="space-y-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                        style={{
                                            background: isLight
                                                ? 'rgba(6,182,212,0.08)'
                                                : 'rgba(30,41,59,1)',
                                            border: isLight
                                                ? '1px solid rgba(6,182,212,0.22)'
                                                : '1px solid rgba(100,116,139,0.4)',
                                            boxShadow: isLight
                                                ? '0 4px 12px rgba(6,182,212,0.12)'
                                                : 'none',
                                        }}
                                    >
                                        <feature.icon className={isLight ? 'text-cyan-600 text-xl' : 'text-cyan-400 text-xl'} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 transition-colors duration-300"
                                            style={{ color: isLight ? '#0F172A' : '#ffffff' }}>{feature.title}</h3>
                                        <p className="leading-relaxed text-sm md:text-base transition-colors duration-300"
                                            style={{ color: isLight ? '#475569' : '#94A3B8' }}>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Interactive Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full pointer-events-none"
                            style={{ background: isLight ? 'rgba(124,58,237,0.06)' : 'rgba(124,58,237,0.10)', filter: 'blur(100px)' }} />

                        <div className="glass-card p-6 md:p-8 relative z-10">
                            {/* Toolbar Mockup */}
                            <div className="flex gap-2 mb-6 p-1 rounded-lg w-max transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(238,242,255,0.8)' : 'rgba(15,23,42,0.80)',
                                    border: isLight ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(51,65,85,1)',
                                }}>
                                {mockStyles.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setActiveStyle(style.id)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeStyle === style.id
                                            ? 'bg-violet-600 text-white shadow-lg'
                                            : isLight
                                                ? 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        {style.label}
                                    </button>
                                ))}
                            </div>

                            {/* Text Output Box */}
                            <div className="rounded-xl p-5 mb-4 relative min-h-[160px] transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,1)',
                                    border: isLight ? '1px solid rgba(124,58,237,0.12)' : '1px solid rgba(51,65,85,1)',
                                }}>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className={`transition-colors ${isLight ? 'text-slate-400 hover:text-violet-600' : 'text-slate-500 hover:text-white'}`}><FiCopy size={16} /></button>
                                    <button className={`transition-colors ${isLight ? 'text-slate-400 hover:text-violet-600' : 'text-slate-500 hover:text-violet-400'}`}><FiRefreshCw size={16} /></button>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={activeStyle}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="pr-10 leading-relaxed font-medium transition-colors duration-300"
                                        style={{ color: isLight ? '#334155' : '#CBD5E1' }}
                                    >
                                        {mockStyles.find(m => m.id === activeStyle)?.text}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Audio Player Mockup */}
                            <div className="rounded-xl p-4 flex items-center gap-4 transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,1)',
                                    border: isLight ? '1px solid rgba(6,182,212,0.18)' : '1px solid rgba(51,65,85,1)',
                                }}>
                                <button className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white pl-1 shadow-lg shadow-cyan-500/30">
                                    <FiPlayCircle size={20} className="ml-[-1px]" />
                                </button>
                                <div className="flex-1 h-2 rounded-full overflow-hidden"
                                    style={{ background: isLight ? 'rgba(99,102,241,0.15)' : 'rgba(30,41,59,1)' }}>
                                    <div className="h-full bg-cyan-400 w-1/3 rounded-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                                <div className={`text-xs font-mono transition-colors duration-300 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>0:12 / 0:34</div>
                                <button className={`transition-colors ml-2 ${isLight ? 'text-slate-400 hover:text-cyan-600' : 'text-slate-500 hover:text-cyan-400'}`}><FiDownload size={18} /></button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AIFeatures;
