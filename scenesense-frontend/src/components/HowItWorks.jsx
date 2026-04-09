import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        num: '01',
        title: 'Upload Image',
        desc: 'Drag & drop or click to select any JPG, PNG, or WEBP. Processed fully in memory — no data stored without consent.',
        color: '#00d4ff',
    },
    {
        num: '02',
        title: 'AI Generates Caption',
        desc: 'Salesforce BLIP analyzes pixels with a transformer vision model to produce an accurate, context-aware English description.',
        color: '#a855f7',
    },
    {
        num: '03',
        title: 'Translate & Listen',
        desc: 'MarianMT translates the result to Hindi or Telugu while gTTS synthesizes natural voice audio, downloadable instantly.',
        color: '#e879f9',
    },
];

const HowItWorks = () => (
    <section id="how-it-works" className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <span className="section-label mx-auto w-fit">Simple 3-Step Flow</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    From Pixel to<br />
                    <span className="gradient-text">Multilingual Audio</span>
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* connector */}
                <div className="hidden md:block absolute top-14 left-[15%] w-[70%] h-px"
                    style={{ background: 'linear-gradient(90deg, #00d4ff40, #a855f740, #e879f940)' }} />

                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="relative text-center group"
                    >
                        {/* Number circle */}
                        <div
                            className="w-28 h-28 mx-auto rounded-3xl flex items-center justify-center mb-8 relative"
                            style={{
                                background: `${step.color}0d`,
                                border: `1px solid ${step.color}40`,
                                boxShadow: `0 0 40px ${step.color}20`,
                            }}
                        >
                            <span
                                className="text-4xl font-black"
                                style={{ filter: 'drop-shadow(0 0 12px currentColor)', color: step.color }}
                            >
                                {step.num}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 px-2 leading-relaxed">{step.desc}</p>

                        {/* Bottom accent line */}
                        <div
                            className="h-1 rounded-full mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
                            style={{ width: '40%', background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
