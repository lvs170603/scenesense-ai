import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import DemoPreview from '../components/landing/DemoPreview';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import TrialSection from '../components/landing/TrialSection';
import AIFeatures from '../components/landing/AIFeatures';
import ScreenshotsSection from '../components/landing/ScreenshotsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className={`min-h-screen overflow-x-hidden pt-4 transition-colors duration-300 ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0A0F1C] text-slate-200'}`}>
            <Navbar />
            <HeroSection />
            <DemoPreview />
            <FeaturesSection />
            <HowItWorks />
            <TrialSection />
            <AIFeatures />
            <ScreenshotsSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Landing;
