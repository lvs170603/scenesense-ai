/**
 * components/CaptionDisplay.jsx
 * Displays the final generated text natively in the target language.
 * Greatly optimized for a seamless 1-step pipeline experience.
 */
import React, { useState } from 'react'
import { FiCopy, FiCheck, FiMessageSquare } from 'react-icons/fi'
import LoadingSpinner from './LoadingSpinner.jsx'
import { useTheme } from '../context/ThemeContext'

const SUPPORTED_LANGS = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'zh', label: '🇨🇳 Chinese' },
    { code: 'hi', label: '🇮🇳 Hindi' },
    { code: 'es', label: '🇪🇸 Spanish' },
    { code: 'fr', label: '🇫🇷 French' },
    { code: 'ar', label: '🇸🇦 Arabic' },
    { code: 'bn', label: '🇧🇩 Bengali' },
    { code: 'pt', label: '🇵🇹 Portuguese' },
    { code: 'ru', label: '🇷🇺 Russian' },
    { code: 'ur', label: '🇵🇰 Urdu' },
    { code: 'id', label: '🇮🇩 Indonesian' },
    { code: 'de', label: '🇩🇪 German' },
    { code: 'ja', label: '🇯🇵 Japanese' },
    { code: 'sw', label: '🇰🇪 Swahili' },
    { code: 'mr', label: '🇮🇳 Marathi' },
    { code: 'te', label: '🇮🇳 Telugu' },
    { code: 'tr', label: '🇹🇷 Turkish' },
    { code: 'ta', label: '🇮🇳 Tamil' },
    { code: 'ko', label: '🇰🇷 Korean' },
    { code: 'vi', label: '🇻🇳 Vietnamese' },
]

export default function CaptionDisplay({ caption, translatedCaption, language, isLoading, loadingMessage }) {
    const [copied, setCopied] = useState(false)
    const { theme } = useTheme()
    const isLight = theme === 'light'

    if (!caption && !isLoading) return null

    // By default, assume english. If translation exists and target is not en, show translation.
    const displayText = (language !== 'en' && translatedCaption) ? translatedCaption : caption

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* ignore */
        }
    }

    const getLangLabel = (code) => {
        const found = SUPPORTED_LANGS.find(l => l.code === code)
        return found ? found.label : code
    }

    const currentLangLabel = getLangLabel(language || 'en')

    const headerTextColors = isLight ? 'text-slate-600' : 'text-white/70'
    const btnClass = isLight 
        ? 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200'
        : 'p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200'
    
    // Style the primary output text loudly
    const capTextClass = isLight 
        ? 'text-lg md:text-xl font-medium leading-relaxed text-slate-800' 
        : 'text-lg md:text-xl font-medium leading-relaxed text-white'

    return (
        <div className={`glass-card p-5 animate-fade-in flex flex-col gap-4 ${isLight ? 'shadow-sm border border-slate-200' : ''}`}>

            {/* --- Header --- */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                <div className={`flex items-center gap-2 text-sm font-semibold ${headerTextColors}`}>
                    <FiMessageSquare size={16} className="text-cyan-500" />
                    <span>Inference Result</span>
                    <span className={`badge ml-2 ${isLight ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'}`}>
                        {currentLangLabel.split(' ')[1] || currentLangLabel}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className={btnClass}
                    disabled={isLoading}
                >
                    {copied ? <FiCheck size={16} className="text-green-500" /> : <FiCopy size={16} />}
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 opacity-80 min-h-[100px]">
                    <LoadingSpinner message={loadingMessage || "Processing..."} fullScreen={false} />
                </div>
            ) : (
                <div className="py-4 flex items-start min-h-[100px]">
                    <p className={capTextClass}>
                        {displayText}
                    </p>
                </div>
            )}
        </div>
    )
}
