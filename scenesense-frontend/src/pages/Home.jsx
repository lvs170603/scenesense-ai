/**
 * pages/Home.jsx
 * Main page – orchestrates the full upload → caption → translate → voice pipeline.
 */
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiCpu, FiSend, FiGlobe, FiMic, FiClock } from 'react-icons/fi'

import ImageUploader from '../components/ImageUploader.jsx'
import StyleModeSelector from '../components/StyleModeSelector.jsx'
import LanguageSelector from '../components/LanguageSelector.jsx'
import CaptionDisplay from '../components/CaptionDisplay.jsx'
import AudioPlayer from '../components/AudioPlayer.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

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
    [STEP.UPLOADING]: 'Uploading image…',
    [STEP.CAPTIONING]: 'Generating caption (loading AI model on first run)…',
    [STEP.TRANSLATING]: 'Translating…',
    [STEP.VOICING]: 'Generating voice…',
}

export default function Home() {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [mode, setMode] = useState('simple')
    const [language, setLanguage] = useState('en')

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
            setFile(null)
            setPreviewUrl(null)
            setSavedFilename(null)
            setCaption('')
            setTranslatedCaption('')
            setAudioUrl(null)
            return
        }
        setFile(f)
        setPreviewUrl(URL.createObjectURL(f))
        setCaption('')
        setTranslatedCaption('')
        setAudioUrl(null)
        setError(null)
    }, [])

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

            // 3. Translate (possibly no-op for English)
            setStep(STEP.TRANSLATING)
            const translateData = await translateCaption({
                text: engCaption,
                language,
                image_name: filename,
                original_caption: engCaption,
                mode,
            })
            const finalText = translateData.translated_text || engCaption
            setTranslatedCaption(finalText)

            // 4. Voice
            setStep(STEP.VOICING)
            const voiceData = await generateVoice(finalText, language)
            setAudioUrl(voiceData.audio_url)
            setAudioFilename(voiceData.filename)

        } catch (err) {
            setError(err.message)
        } finally {
            setStep(STEP.IDLE)
        }
    }

    return (
        <div className="min-h-screen relative z-10 flex flex-col">
            <Navbar />

            <div className="px-4 py-10 max-w-6xl mx-auto w-full flex-1">
                {/* ── Dashboard Header ────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-fade-in">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 transition-colors duration-300"
                            style={{ color: isLight ? '#0F172A' : '#ffffff' }}>
                            AI Workspace
                        </h1>
                        <p className="transition-colors duration-300"
                           style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                            Upload imagery below to begin the multimodal generation pipeline.
                        </p>
                    </div>
                    <Link
                        to="/history"
                        className="btn-secondary inline-flex items-center gap-2 text-sm"
                    >
                        <FiClock size={16} /> View History
                    </Link>
                </div>

                {/* ── Main Grid ──────────────────────────────────────────── */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="flex flex-col gap-5">
                        {/* Image Uploader */}
                        <div className="glass-card p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5 transition-colors duration-300"
                               style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                                <FiCpu size={12} /> Upload Image
                            </p>
                            <ImageUploader
                                onFileSelected={handleFileSelected}
                                previewUrl={previewUrl}
                                disabled={busy}
                            />
                        </div>

                        {/* Mode selector */}
                        <div className="glass-card p-5">
                            <StyleModeSelector value={mode} onChange={setMode} disabled={busy} />
                        </div>

                        {/* Language selector */}
                        <div className="glass-card p-5">
                            <LanguageSelector value={language} onChange={setLanguage} disabled={busy} />
                        </div>

                        {/* Generate button */}
                        <button
                            id="generate-btn"
                            onClick={handleGenerate}
                            disabled={!file || busy}
                            className="btn-primary w-full text-base flex items-center justify-center gap-2"
                        >
                            {busy ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    {STEP_MSG[step] || 'Working…'}
                                </>
                            ) : (
                                <>
                                    <FiSend size={16} /> Generate Caption
                                </>
                            )}
                        </button>

                        {/* Upload progress */}
                        {step === STEP.UPLOADING && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="rounded-xl overflow-hidden h-1.5 bg-white/10">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="glass-card p-4 border-red-400/40 bg-red-500/10 text-red-300 text-sm animate-fade-in">
                                ⚠ {error}
                            </div>
                        )}
                    </div>

                    {/* Right Column – results */}
                    <div className="flex flex-col gap-5">
                        {/* Caption */}
                        {(caption || busy) && (
                            <CaptionDisplay
                                caption={caption}
                                translatedCaption={language !== 'en' ? translatedCaption : ''}
                                language={language}
                                isLoading={busy && [STEP.UPLOADING, STEP.CAPTIONING, STEP.TRANSLATING].includes(step)}
                                loadingMessage={STEP_MSG[step]}
                            />
                        )}

                        {/* Audio Player */}
                        {(audioUrl || (busy && step === STEP.VOICING)) && (
                            <AudioPlayer 
                                audioUrl={audioUrl} 
                                filename={audioFilename} 
                                isLoading={busy && step === STEP.VOICING} 
                            />
                        )}

                        {/* Placeholder when idle */}
                        {!caption && !busy && (
                            <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[260px]">
                                <div className="p-5 rounded-full border transition-colors duration-300"
                                     style={{ 
                                         background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                                         borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'
                                     }}>
                                    <FiMic size={36} style={{ color: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.2)' }} />
                                </div>
                                <p className="text-sm max-w-xs transition-colors duration-300"
                                   style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.3)' }}>
                                    Results will appear here after you upload an image and click <strong>Generate Caption</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
