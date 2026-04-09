/**
 * components/CaptionDisplay.jsx
 * Shows the generated (and optionally translated) caption text
 * with an interactive multilingual translation selector.
 * Now theme-aware.
 */
import React, { useState, useEffect } from 'react'
import { FiCopy, FiCheck, FiMessageSquare, FiGlobe } from 'react-icons/fi'
import { translateCaption } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner.jsx'
import { useTheme } from '../context/ThemeContext'


const SUPPORTED_LANGS = [
    { code: 'zh', label: '🇨🇳 Chinese (Mandarin)' },
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
    const [targetLang, setTargetLang] = useState('hi')
    const [activeTranslation, setActiveTranslation] = useState({
        text: translatedCaption || '',
        lang: language !== 'en' ? language : ''
    })
    const [isTranslating, setIsTranslating] = useState(false)
    const { theme } = useTheme()
    const isLight = theme === 'light'

    // Sync with upstream parent pipeline if it generates a fresh caption
    useEffect(() => {
        if (translatedCaption && language && language !== 'en') {
            setActiveTranslation({ text: translatedCaption, lang: language })
        } else {
            setActiveTranslation({ text: '', lang: '' })
        }
    }, [translatedCaption, language, caption])

    if (!caption && !isLoading) return null

    const displayText = activeTranslation.text || caption

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* ignore */
        }
    }

    const handleTranslate = async (langCode) => {
        const codeToUse = langCode || targetLang;
        if (!caption || !codeToUse) return;

        setIsTranslating(true);
        setTargetLang(codeToUse);
        try {
            const res = await translateCaption({
                text: caption,
                language: codeToUse
            });
            setActiveTranslation({ text: res.translated_text, lang: codeToUse });
        } catch (err) {
            console.error("Translation failed:", err);
        } finally {
            setIsTranslating(false);
        }
    }

    const getLangLabel = (code) => {
        if (code === 'en') return '🇬🇧 English'
        const found = SUPPORTED_LANGS.find(l => l.code === code)
        return found ? found.label : code
    }

    const currentLangLabel = activeTranslation.lang ? getLangLabel(activeTranslation.lang) : '🇬🇧 English'

    const headerTextColors = isLight ? 'text-slate-600' : 'text-white/70'
    const btnClass = isLight 
        ? 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all duration-200'
        : 'p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200'
    
    const oriLabelClass = isLight ? 'text-slate-500 text-xs uppercase tracking-wide mb-1' : 'text-white/40 text-xs uppercase tracking-wide mb-1'
    const capTextClass = activeTranslation.text 
        ? (isLight ? 'text-sm leading-relaxed text-slate-600' : 'text-sm leading-relaxed text-white/60')
        : (isLight ? 'text-sm leading-relaxed text-slate-900' : 'text-sm leading-relaxed text-white/90')

    const transLabelClass = isLight ? 'text-slate-500 text-xs uppercase tracking-wide mb-1' : 'text-white/40 text-xs uppercase tracking-wide mb-1'
    const transTextClass = isLight ? 'text-slate-900 text-base leading-relaxed font-medium' : 'text-white text-base leading-relaxed font-medium'
    const borderClass = isLight ? 'border-slate-200' : 'border-white/10'

    const toolbarBg = isLight ? 'bg-slate-100/60 p-3 rounded-xl' : 'bg-slate-900/40 p-3 rounded-xl'
    const toolbarBorder = isLight ? 'border-t border-slate-200' : 'border-t border-white/5'
    const translateToClass = isLight ? 'flex items-center gap-2 w-full sm:w-auto text-sm text-slate-600 whitespace-nowrap' : 'flex items-center gap-2 w-full sm:w-auto text-sm text-slate-300 whitespace-nowrap'
    
    const selectClass = isLight 
        ? 'w-full sm:w-auto flex-1 bg-white border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 block p-2 outline-none appearance-none cursor-pointer border'
        : 'w-full sm:w-auto flex-1 bg-slate-800 border-slate-700 text-white text-sm rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 block p-2 outline-none appearance-none cursor-pointer border'

    return (
        <div className={`glass-card p-5 animate-fade-in flex flex-col gap-4 min-h-[240px] ${isLight ? 'shadow-sm border border-slate-200' : ''}`}>

            {/* --- Header --- */}
            <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm font-semibold ${headerTextColors}`}>
                    <FiMessageSquare size={14} className="text-cyan-500" />
                    <span>Caption</span>
                    <span className={`badge ${isLight ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'}`}>
                        {currentLangLabel.split(' ')[1] || currentLangLabel}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className={btnClass}
                >
                    {copied ? <FiCheck size={16} className="text-green-500" /> : <FiCopy size={16} />}
                </button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                    <LoadingSpinner message={loadingMessage || "Processing..."} fullScreen={false} />
                </div>
            ) : (
                <>
                {/* --- Original English Caption --- */}
                <div>
                {activeTranslation.text && (
                    <p className={oriLabelClass}>
                        Original (English)
                    </p>
                )}
                <p className={capTextClass}>
                    {caption}
                </p>
            </div>

            {/* --- Translated Caption Result --- */}
            <AnimatePresence mode="wait">
                {activeTranslation.text && (
                    <motion.div
                        key={activeTranslation.text}
                        initial={{ opacity: 0, scale: 0.98, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`pt-3 border-t ${borderClass}`}
                    >
                        <p className={transLabelClass}>
                            Translated ({getLangLabel(activeTranslation.lang)})
                        </p>
                        <p className={transTextClass}>
                            {activeTranslation.text}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Interactive Translate Toolbar --- */}
            <div className={`mt-2 ${toolbarBorder} flex flex-col sm:flex-row items-center gap-3 ${toolbarBg}`}>
                <div className={translateToClass}>
                    <FiGlobe className="text-fuchsia-500" />
                    Translate to:
                </div>

                <select
                    className={selectClass}
                    value={targetLang}
                    onChange={(e) => handleTranslate(e.target.value)}
                    disabled={isTranslating}
                >
                    {SUPPORTED_LANGS.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.label}
                        </option>
                    ))}
                </select>

                {isTranslating && (
                    <div className="flex items-center gap-2 text-xs text-fuchsia-500 animate-pulse ml-2 pr-2">
                        <span className="w-4 h-4 rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-500 animate-spin"></span>
                        Translating...
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    )
}
