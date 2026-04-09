import React from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiCpu, FiGlobe, FiVolume2, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const DemoPreview = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    return (
        <section id="demo-preview" className="relative py-20 px-6 z-10">
            <div className="max-w-6xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="section-label">Pipeline Demonstration</div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-poppins transition-colors duration-300"
                        style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                        From Pixels to Voices
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg transition-colors duration-300"
                        style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                        Watch how our multi-model AI pipeline processes an image and turns it into localized, audible content in seconds.
                    </p>
                </motion.div>

                {/* Demo Container */}
                <div className="grad-border-card p-6 md:p-10 relative overflow-hidden">
                    {/* Subtle grid background inside the card */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />

                    <div className="grid md:grid-cols-12 gap-6 relative z-10">

                        {/* Step 1: Upload */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-5 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-300"
                            style={{
                                background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.60)',
                                border: isLight ? '1px solid rgba(6,182,212,0.18)' : '1px solid rgba(100,116,139,0.3)',
                            }}
                        >
                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20 glow-cyan">
                                <FiImage className={isLight ? 'text-cyan-600 text-2xl' : 'text-cyan-400 text-2xl'} />
                            </div>
                            <h3 className="font-semibold mb-2 transition-colors duration-300" style={{ color: isLight ? '#0F172A' : '#fff' }}>1. Image Upload</h3>
                            <p className="text-sm text-center transition-colors duration-300" style={{ color: isLight ? '#64748B' : '#94A3B8' }}>Drag and drop any image. The UI immediately displays a high-res preview.</p>

                            <div className="mt-6 w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300"
                                style={{ borderColor: isLight ? 'rgba(6,182,212,0.30)' : 'rgba(100,116,139,0.4)', background: isLight ? 'rgba(6,182,212,0.04)' : 'rgba(30,41,59,0.30)' }}>
                                <div className="w-10 h-10 rounded bg-slate-700/50 mb-2 animate-pulse" />
                                <div className="h-2 w-20 bg-slate-700/50 rounded animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Pipeline Steps */}
                        <div className="md:col-span-7 flex flex-col gap-4 justify-center">

                            {/* Step 2: BLIP Captioning */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="rounded-xl p-5 flex items-start gap-4 relative overflow-hidden transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.60)',
                                    border: isLight ? '1px solid rgba(124,58,237,0.22)' : '1px solid rgba(124,58,237,0.30)',
                                }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
                                    <FiCpu className="text-violet-400 text-xl" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-sm transition-colors duration-300" style={{ color: isLight ? '#0F172A' : '#fff' }}>2. BLIP Generation</h3>
                                        <span className="badge bg-violet-500/20 text-violet-300">~1.2s</span>
                                    </div>
                                    <div className="bg-slate-950/50 rounded p-3 mt-2 border border-slate-800 text-sm font-mono text-slate-300">
                                        <span className="text-violet-400">"</span>
                                        <span className="typing-effect inline-block overflow-hidden whitespace-nowrap align-bottom" style={{ maxWidth: '100%', animation: 'typing 3s steps(30, end) infinite' }}>
                                            A beautiful golden retriever puppy playing in the sunny park.
                                        </span>
                                        <span className="text-violet-400 animate-cursor inline-block w-2 bg-violet-400 h-4 ml-1"></span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 3: Translation */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="rounded-xl p-5 flex items-start gap-4 relative overflow-hidden transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.60)',
                                    border: isLight ? '1px solid rgba(232,121,249,0.22)' : '1px solid rgba(232,121,249,0.30)',
                                }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500" />
                                <div className="w-12 h-12 rounded-lg bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0 border border-fuchsia-500/20">
                                    <FiGlobe className="text-fuchsia-400 text-xl" />
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-sm transition-colors duration-300" style={{ color: isLight ? '#0F172A' : '#fff' }}>3. MarianMT Translation</h3>
                                        <span className="badge bg-fuchsia-500/20 text-fuchsia-300">~0.8s</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="flex-1 bg-slate-950/50 rounded px-3 py-2 border border-slate-800 text-sm text-slate-400 font-hindi">
                                            धूप वाले पार्क में खेलता हुआ एक सुंदर...
                                        </div>
                                        <div className="flex-1 bg-slate-950/50 rounded px-3 py-2 border border-slate-800 text-sm text-slate-400 font-telugu">
                                            ఎండగా ఉన్న పార్కులో ఆడుకుంటున్న...
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 4: Voice */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="rounded-xl p-5 flex items-center justify-between relative overflow-hidden transition-colors duration-300"
                                style={{
                                    background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.60)',
                                    border: isLight ? '1px solid rgba(6,182,212,0.22)' : '1px solid rgba(6,182,212,0.30)',
                                }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                                        <FiVolume2 className="text-cyan-400 text-xl" />
                                    </div>
                                    <div>
                                    <h3 className="font-semibold text-sm mb-1 transition-colors duration-300" style={{ color: isLight ? '#0F172A' : '#fff' }}>4. gTTS Voice Output</h3>
                                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Audio synthesized and ready for playback.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pr-2">
                                    {/* Fake Audio Waveform */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 bg-cyan-400 rounded-full"
                                            animate={{ height: ['8px', '24px', '8px'] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Added simple typing keyframe via style block for local usage */}
            <style>{`
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
`}</style>
        </section>
    );
};

export default DemoPreview;
