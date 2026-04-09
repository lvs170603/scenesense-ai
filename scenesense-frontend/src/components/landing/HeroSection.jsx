import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiImage,
    FiType,
    FiGlobe,
    FiHeadphones,
    FiStar,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const floatingIcons = [
    { Icon: FiImage, color: "#06B6D4", left: "8%", top: "35%", delay: 0 },
    { Icon: FiType, color: "#7C3AED", left: "85%", top: "28%", delay: 1 },
    { Icon: FiGlobe, color: "#e879f9", left: "12%", top: "75%", delay: 2 },
    { Icon: FiHeadphones, color: "#3b82f6", left: "88%", top: "70%", delay: 1.5 },
];

const HeroSection = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">

            {/* Background radial glow */}
            <div
                className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-[100%] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 60%)",
                    filter: "blur(80px)",
                }}
            />

            {/* Floating Icons Layer */}
            <div className="absolute inset-0 pointer-events-none">

                {floatingIcons.map((item, i) => (
                    <motion.div
                        key={i}
                        className="absolute hidden md:flex items-center justify-center w-14 h-14 rounded-2xl backdrop-blur-md transition-colors duration-300"
                        style={{
                            left: item.left,
                            top: item.top,
                            background: isLight ? "rgba(255,255,255,0.85)" : "rgba(30,41,59,0.35)",
                            border: `1px solid ${isLight ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.08)"}`,
                            boxShadow: isLight
                                ? `0 8px 32px ${item.color}30, 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)`
                                : `0 0 20px ${item.color}40`,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0.7,
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -12, 0],
                            rotate: [0, 2, -2, 0],
                        }}

                        transition={{
                            opacity: { duration: 1, delay: item.delay },
                            scale: { duration: 1, delay: item.delay },

                            y: {
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },

                            rotate: {
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        <item.Icon size={24} style={{ color: item.color }} />
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                    style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.3)",
                    }}
                >
                    <FiStar className="text-white" />
                    <span className="text-sm font-medium text-white/90 tracking-wide">
                        SceneSense AI version 2.0 is live
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] transition-colors duration-300"
                    style={{ fontFamily: "Poppins, sans-serif", color: isLight ? '#0F172A' : '#ffffff' }}
                >
                    Turn Images into <br className="hidden md:block" />
                    <span className="gradient-text">Smart Captions</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300"
                    style={{ color: isLight ? '#475569' : '#94A3B8' }}
                >
                    The production-ready AI platform that analyzes your images and
                    generates beautiful, contextual descriptions in English, Hindi, and
                    Telugu.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <Link
                        to="/signup"
                        className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center text-lg py-4 px-8"
                    >
                        <span>Create Free Account</span> <FiArrowRight />
                    </Link>

                    <button
                        onClick={() =>
                            document
                                .getElementById("demo-preview")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center text-lg py-4 px-8"
                    >
                        <span>See How It Works</span>
                    </button>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium"
                >
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        Powered by BLIP-Large
                    </span>

                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                        MarianMT Translation
                    </span>

                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                        Secure JWT Authentication
                    </span>
                </motion.div>

            </div>
        </section>
    );
};

export default HeroSection;
