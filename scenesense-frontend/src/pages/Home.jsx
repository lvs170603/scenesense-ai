/**
 * pages/Home.jsx
 * Main page – orchestrates the full upload → caption → translate → voice pipeline.
 * Redesigned for a premium AI tool aesthetic.
 */
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCpu, FiSend, FiGlobe, FiMic, FiClock, FiImage, FiSettings, FiActivity, FiLayers, FiTrash2 } from 'react-icons/fi'

import ImageUploader from '../components/ImageUploader.jsx'
import StyleModeSelector from '../components/StyleModeSelector.jsx'
import LanguageSelector from '../components/LanguageSelector.jsx'
import CaptionDisplay from '../components/CaptionDisplay.jsx'
import AudioPlayer from '../components/AudioPlayer.jsx'

import {
    uploadImage,
    generateCaption,
    translateCaption,
    generateVoice,
} from '../services/api.js'

import Navbar from '../components/Navbar.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const STEP = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    CAPTIONING: 'captioning',
    TRANSLATING: 'translating',
    VOICING: 'voicing',
}

const STEP_MSG = {
    [STEP.UPLOADING]: 'Uploading media securely…',
    [STEP.CAPTIONING]: 'Running Vision-Language Model…',
    [STEP.TRANSLATING]: 'Applying NLLB-200 translation…',
    [STEP.VOICING]: 'Synthesizing neural voice…',
}

export default function Home() {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [mode, setMode] = useState('simple')
    const [language, setLanguage] = useState('en')
    const [autoAudio, setAutoAudio] = useState(true)

    const [step, setStep] = useState(STEP.IDLE)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState(null)

    const [savedFilename, setSavedFilename] = useState(null)
    const [caption, setCaption] = useState('')
    const [translatedCaption, setTranslatedCaption] = useState('')
    const [audioUrl, setAudioUrl] = useState(null)
    const [audioFilename, setAudioFilename] = useState(null)

    const { theme } = useTheme()
    const isLight = theme === 'light'

    const busy = step !== STEP.IDLE

        // ── File selected ───────────────────────────────────────────────
    const handleFileSelected = useCallback((f) => {
        if (!f) {
            handleClear()
            return
        }
        setFile(f)
        setPreviewUrl(URL.createObjectURL(f))
        setCaption('')
        setTranslatedCaption('')
        setAudioUrl(null)
        setError(null)
    }, [])

    const handleClear = () => {
        setFile(null)
        setPreviewUrl(null)
        setSavedFilename(null)
        setCaption('')
        setTranslatedCaption('')
        setAudioUrl(null)
        setError(null)
        setStep(STEP.IDLE)
        setUploadProgress(0)
    }

    // ── Main pipeline ────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (!file) return
        setError(null)
        setCaption('')
        setTranslatedCaption('')
        setAudioUrl(null)

        try {
            // 1. Upload
            setStep(STEP.UPLOADING)
            setUploadProgress(0)
            const uploadData = await uploadImage(file, setUploadProgress)
            const filename = uploadData.filename
            setSavedFilename(filename)

            // 2. Caption
            setStep(STEP.CAPTIONING)
            const captionData = await generateCaption(filename, mode)
            const engCaption = captionData.caption
            setCaption(engCaption)

            // 3. History Save & Translate
            setStep(STEP.TRANSLATING)
            const translateData = await translateCaption({
                text: engCaption,
                language: language,
                image_name: filename,
                original_caption: engCaption,
                mode,
            })
            const finalText = translateData.translated_text || engCaption
            setTranslatedCaption(finalText)

            // 4. Voice (Optional)
            if (autoAudio) {
                setStep(STEP.VOICING)
                const voiceData = await generateVoice(finalText, language)
                setAudioUrl(voiceData.audio_url)
                setAudioFilename(voiceData.filename)
            }

        } catch (err) {
            setError(err.message)
        } finally {
            setStep(STEP.IDLE)
        }
    }

    // ── UI Helpers ───────────────────────────────────────────────────
    const LabelBadge = ({ count, icon: Icon, title }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                {count}
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: isLight ? '#475569' : '#CBD5E1' }}>
                <Icon size={14} className={isLight ? "text-indigo-600" : "text-indigo-400"} />
                {title}
            </h3>
        </div>
    )

    return (
        <div className="min-h-screen relative z-10 flex flex-col">
            <Navbar />

            <div className="px-4 py-8 md:py-12 max-w-[1280px] mx-auto w-full flex-1">
                
                {/* ── Dashboard Header ────────────────────────────────────────── */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b"
                    style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-violet"
                             style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                            <FiLayers className="text-white text-xl" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="badge" style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7' }}>Workspace</span>
                                <span className="text-xs" style={{ color: isLight ? '#94A3B8' : '#64748B' }}>/ Analysis Studio</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight"
                                style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                                Scene Analysis & Generation
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClear}
                            disabled={!file && !caption}
                            className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2"
                        >
                            <FiTrash2 size={15} /> Clear Workspace
                        </button>
                        <Link
                            to="/history"
                            className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40"
                        >
                            <FiClock size={15} /> Recent Generations
                        </Link>
                    </div>
                </motion.div>

                {/* ── Main Layout ──────────────────────────────────────────── */}
                <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                    
                    {/* Left Column – Config & Inputs */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        
                        {/* 1. Upload */}
                        <div className={`glass-card p-6 ${file ? 'grad-border-card' : ''}`}>
                            <LabelBadge count="1" icon={FiImage} title="Input Media" />
                            <ImageUploader
                                onFileSelected={handleFileSelected}
                                previewUrl={previewUrl}
                                disabled={busy}
                            />
                        </div>

                        {/* 2. Configuration */}
                        <div className={`glass-card p-6 transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
                            <LabelBadge count="2" icon={FiSettings} title="Model Parameters" />
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-medium mb-3" style={{ color: isLight ? '#64748B' : '#94A3B8' }}>Inference Density (BLIP-Large + GPT-2)</p>
                                    <StyleModeSelector value={mode} onChange={setMode} disabled={busy} />
                                </div>
                                <div className="h-px w-full" style={{ background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }} />
                                
                                <div>
                                    <p className="text-xs font-medium mb-3" style={{ color: isLight ? '#64748B' : '#94A3B8' }}>Target Language (NLLB-200)</p>
                                    <LanguageSelector value={language} onChange={setLanguage} disabled={busy} />
                                </div>
                                <div className="h-px w-full" style={{ background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }} />
                                
                                <div className="space-y-3">
                                    <p className="text-xs font-medium mb-2" style={{ color: isLight ? '#64748B' : '#94A3B8' }}>Execution Options</p>
                                    
                                    <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                                           style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.04)' }}>
                                        <div className="flex items-center gap-3">
                                            <FiMic className={isLight ? "text-indigo-600" : "text-indigo-400"} />
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: isLight ? '#1E293B' : '#F1F5F9' }}>Synthesize Speech</p>
                                                <p className="text-[11px]" style={{ color: isLight ? '#64748B' : '#94A3B8' }}>Auto-generate neural audio</p>
                                            </div>
                                        </div>
                                        {/* Custom Toggle Switch */}
                                        <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${autoAudio ? 'bg-indigo-500' : (isLight ? 'bg-slate-300' : 'bg-slate-700')}`}>
                                            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 flex-shrink-0 ${autoAudio ? 'translate-x-4' : ''}`} />
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={autoAudio} 
                                                onChange={() => setAutoAudio(!autoAudio)} 
                                                disabled={busy}
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="sticky bottom-6 pt-2">
                            <button
                                id="generate-btn"
                                onClick={handleGenerate}
                                disabled={!file || busy}
                                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl text-white outline-none active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    file && !busy 
                                        ? 'bg-[linear-gradient(135deg,#7C3AED,#06B6D4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]' 
                                        : 'bg-indigo-600/50'
                                }`}
                            >
                                {busy ? (
                                    <>
                                        <FiActivity className="animate-spin text-white/80" size={18} />
                                        <span>{STEP_MSG[step] || 'Processing pipeline...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCpu size={18} />
                                        <span>Run Inference Pipeline</span>
                                    </>
                                )}
                            </button>

                            {/* Upload progress */}
                            <AnimatePresence>
                                {step === STEP.UPLOADING && uploadProgress > 0 && uploadProgress < 100 && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4"
                                    >
                                        <div className="flex justify-between text-xs mb-1 font-medium" style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                                            <span>Transferring payload...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full overflow-hidden"
                                             style={{ background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-4 rounded-xl text-sm font-medium border text-red-500 flex items-start gap-2"
                                        style={{ 
                                            background: isLight ? '#FEF2F2' : 'rgba(239, 68, 68, 0.1)', 
                                            borderColor: isLight ? '#FECACA' : 'rgba(239, 68, 68, 0.2)' 
                                        }}
                                    >
                                        <div className="mt-0.5 text-red-500 text-lg">⚠</div>
                                        <div>{error}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right Column – Pipeline Results */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-6"
                    >
                        
                        {(caption || busy) ? (
                            <div className="flex flex-col gap-6">
                                {/* Result Panel */}
                                <div className="glass-card flex flex-col overflow-hidden relative">
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 animate-pulse" />
                                    
                                    <div className="p-6 md:p-8">
                                        <LabelBadge count="3" icon={FiGlobe} title="Output Generation" />
                                        
                                        <CaptionDisplay
                                            caption={caption}
                                            translatedCaption={translatedCaption !== caption ? translatedCaption : ''}
                                            language={language}
                                            isLoading={busy && [STEP.UPLOADING, STEP.CAPTIONING, STEP.TRANSLATING].includes(step)}
                                            loadingMessage={STEP_MSG[step]}
                                        />
                                    </div>
                                </div>

                                {/* Audio Panel */}
                                {(audioUrl || (busy && step === STEP.VOICING)) && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card p-6 grad-border-card"
                                    >
                                        <LabelBadge count="4" icon={FiMic} title="Neural Speech Synthesis" />
                                        <AudioPlayer 
                                            audioUrl={audioUrl} 
                                            filename={audioFilename} 
                                            isLoading={busy && step === STEP.VOICING} 
                                        />
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="glass-card flex-1 p-8 flex flex-col items-center justify-center gap-5 text-center min-h-[500px]">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 rounded-full animate-pulse" />
                                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center relative z-10"
                                         style={{ 
                                             background: isLight ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' : 'linear-gradient(135deg, #1E293B, #0F172A)',
                                             border: isLight ? '1px solid #C7D2FE' : '1px solid #334155',
                                             boxShadow: isLight ? '0 10px 25px rgba(99,102,241,0.1)' : '0 10px 25px rgba(0,0,0,0.5)'
                                         }}>
                                        <FiCpu size={40} className="text-zinc-400 opacity-50" />
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold mb-2" style={{ color: isLight ? '#1E293B' : '#F8FAFC' }}>Awaiting Input</h3>
                                    <p className="text-sm max-w-sm mx-auto leading-relaxed"
                                       style={{ color: isLight ? '#64748B' : '#94A3B8' }}>
                                        Upload an image on the left and configure your parameters. The AI pipeline will extract visual semantics, apply multilingual translation, and synthesize speech in real-time.
                                    </p>
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)' }}>
                                        BLIP-Large
                                    </div>
                                    <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)' }}>
                                        NLLB-200
                                    </div>
                                    <div className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)' }}>
                                        gTTS
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
