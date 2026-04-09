import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const reviews = [
    {
        name: 'Sarah Jenkins',
        role: 'Accessibility Lead @ TechFlow',
        text: 'SceneSense AI transformed our content pipeline. Automatically generating multilingual alt-text with voice has saved hundreds of hours.',
        gradient: 'from-cyan-500/20 to-blue-600/10',
        border: 'rgba(0, 212, 255, 0.15)',
    },
    {
        name: 'Raj Patel',
        role: 'Founder @ Visionary',
        text: 'The accuracy of the Hindi translation is incredible. The visual recognition stitched with NLP in real-time is genuinely peak tech.',
        gradient: 'from-violet-500/20 to-purple-600/10',
        border: 'rgba(124, 58, 237, 0.2)',
    },
    {
        name: 'Emily Wang',
        role: 'EdTech Developer',
        text: 'We integrated this to help visually impaired students. The audio synthesis pipeline is flawless and the UI is genuinely a joy to use.',
        gradient: 'from-fuchsia-500/20 to-pink-600/10',
        border: 'rgba(232, 121, 249, 0.15)',
    },
];

const Testimonials = () => (
    <section className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="section-label mx-auto w-fit">Wall of Love</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Loved by <span className="gradient-text">Builders Worldwide</span>
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -4 }}
                        className="glass-card p-8 flex flex-col justify-between relative overflow-hidden"
                        style={{ borderColor: r.border }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-40 rounded-2xl`} />

                        <div className="relative z-10">
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, s) => (
                                    <FiStar key={s} className="text-amber-400 fill-amber-400" style={{ fill: '#fbbf24' }} />
                                ))}
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                "{r.text}"
                            </p>
                        </div>

                        <div className="relative z-10">
                            <h4 className="font-semibold text-white">{r.name}</h4>
                            <p className="text-sm text-slate-500 mt-0.5">{r.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
