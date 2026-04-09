import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const FeatureCard = ({ icon: Icon, title, description, delay = 0, accentColor = '#7C3AED' }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl p-8 overflow-hidden group cursor-default transition-all duration-300"
            style={{
                background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30, 41, 59, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${accentColor}50`;
                e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,${isLight ? '0.12' : '0.4'}), 0 0 30px ${accentColor}20`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = isLight ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
            }}
        >
            {/* Gradient background glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${accentColor}0f 0%, transparent 55%)` }} />

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                style={{
                    background: `${accentColor}18`,
                    border: `1px solid ${accentColor}40`,
                    boxShadow: `0 0 20px ${accentColor}15`,
                }}>
                <Icon size={22} style={{ color: accentColor }} />
            </div>

            <h3 className="text-lg font-bold mb-3 relative z-10"
                style={{ color: isLight ? '#0F172A' : '#F1F5F9' }}>
                {title}
            </h3>
            <p className="leading-relaxed relative z-10 text-sm"
                style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                {description}
            </p>

            {/* Bottom sweep */}
            <div className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
        </motion.div>
    );
};

export default FeatureCard;
