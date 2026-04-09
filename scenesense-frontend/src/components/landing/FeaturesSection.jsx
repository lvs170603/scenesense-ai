import React from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiCpu, FiGlobe, FiVolume2, FiLock, FiClock } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const features = [
    {
        icon: FiUploadCloud,
        title: 'Image Upload',
        description: 'Instantly upload your photos via drag-and-drop. High-res preview ensures you always caption the right image.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20'
    },
    {
        icon: FiCpu,
        title: 'AI Caption Generation',
        description: 'Powered by Salesforce BLIP, get accurate, contextual descriptions of any complex scene in seconds.',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20'
    },
    {
        icon: FiGlobe,
        title: 'Multilingual Translation',
        description: 'Break language barriers. Instantly translate your English captions into native-sounding Hindi and Telugu.',
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-500/10',
        border: 'border-fuchsia-500/20'
    },
    {
        icon: FiVolume2,
        title: 'Voice Output',
        description: 'Listen to the generated captions. We synthesize high-quality audio in the native accent matching the translation.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
    },
    {
        icon: FiLock,
        title: 'Secure Authentication',
        description: 'Enterprise-grade security using BCrypt passwords and stateless JWTs. Complete with Brevo SMTP email verification.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    },
    {
        icon: FiClock,
        title: 'Caption History',
        description: 'Never lose a great caption. We automatically save your uploads, translations, and audio files to your personal dashboard.',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesSection = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section id="features" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-label"
                    >
                        Capabilities
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold font-poppins mb-6 transition-colors duration-300"
                        style={{ color: isLight ? '#0F172A' : '#ffffff' }}
                    >
                        Everything you need, built-in
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg transition-colors duration-300"
                        style={{ color: isLight ? '#475569' : '#94A3B8' }}
                    >
                        SceneSense is engineered as a complete pipeline, bringing computer vision and natural language processing into one seamless interface.
                    </motion.p>
                </div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={itemVariants} 
                            className="p-8 relative flex flex-col items-start group overflow-hidden rounded-2xl transition-all duration-300 glass-card-hover"
                            style={{
                                background: isLight ? 'rgba(255,255,255,0.72)' : 'rgba(30, 41, 59, 0.4)',
                                border: `1px solid ${isLight ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.05)'}`,
                                backdropFilter: 'blur(24px)',
                            }}>
                            {/* Subtle background glow circle */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${feature.bg} blur-3xl group-hover:blur-2xl transition-all duration-500`} />

                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.border} ${feature.color} relative z-10 transition-transform group-hover:scale-110 duration-300`}>
                                <feature.icon size={28} />
                            </div>

                            <h3 className="text-xl font-semibold mb-3 relative z-10 transition-colors duration-300" style={{ color: isLight ? '#0F172A' : '#ffffff' }}>{feature.title}</h3>
                            <p className="text-sm leading-relaxed relative z-10 transition-colors duration-300" style={{ color: isLight ? '#475569' : '#94A3B8' }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default FeaturesSection;
