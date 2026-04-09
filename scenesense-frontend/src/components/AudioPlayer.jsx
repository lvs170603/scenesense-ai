/**
 * components/AudioPlayer.jsx
 * Custom HTML5 audio player with a gradient waveform visual.
 */
import React, { useRef, useState, useEffect } from 'react'
import { FiPlay, FiPause, FiVolume2, FiDownload } from 'react-icons/fi'
import LoadingSpinner from './LoadingSpinner.jsx'
import { useTheme } from '../context/ThemeContext'

export default function AudioPlayer({ audioUrl, filename, isLoading }) {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    
    const { theme } = useTheme()
    const isLight = theme === 'light'

    // Reset state when a new audio URL is provided
    useEffect(() => {
        setPlaying(false)
        setProgress(0)
        setCurrentTime(0)
    }, [audioUrl])

    if (!audioUrl && !isLoading) return null

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing) {
            audio.pause()
        } else {
            audio.play()
        }
        setPlaying(!playing)
    }

    const handleTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return
        setCurrentTime(audio.currentTime)
        setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const handleLoaded = () => {
        setDuration(audioRef.current?.duration || 0)
    }

    const handleEnded = () => {
        setPlaying(false)
        setProgress(0)
        setCurrentTime(0)
    }

    const handleSeek = (e) => {
        const audio = audioRef.current
        if (!audio) return
        const rect = e.currentTarget.getBoundingClientRect()
        const pct = (e.clientX - rect.left) / rect.width
        audio.currentTime = pct * audio.duration
    }

    const fmt = (s) => {
        const m = Math.floor(s / 60)
        const sec = Math.floor(s % 60)
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    return (
        <div className={`glass-card p-5 animate-fade-in ${isLight ? 'border border-slate-200 shadow-sm' : ''}`}>
            <div className="flex items-center gap-2 text-sm font-semibold mb-4 transition-colors duration-300"
                 style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.7)' }}>
                <FiVolume2 size={14} className="text-violet-500" />
                <span>Voice Output</span>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-6">
                    <LoadingSpinner message="Generating voice playback..." fullScreen={false} />
                </div>
            ) : (
                <>
                <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoaded}
                onEnded={handleEnded}
                preload="metadata"
            />

            <div className="flex items-center gap-4">
                {/* Play / Pause */}
                <button
                    onClick={togglePlay}
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-violet-500 to-cyan-500
                     hover:from-violet-400 hover:to-cyan-400
                     active:scale-90 transition-all duration-200 shadow-lg shadow-violet-500/30"
                >
                    {playing
                        ? <FiPause size={20} className="text-white" />
                        : <FiPlay size={20} className="text-white ml-0.5" />
                    }
                </button>

                {/* Progress bar + times */}
                <div className="flex-1 flex flex-col gap-1.5">
                    <div
                        role="progressbar"
                        aria-valuenow={progress}
                        className={`relative w-full h-2 rounded-full cursor-pointer overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}
                        onClick={handleSeek}
                    >
                        <div
                            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs transition-colors duration-300"
                         style={{ color: isLight ? '#94A3B8' : 'rgba(255,255,255,0.4)' }}>
                        <span>{fmt(currentTime)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                {/* Download */}
                <a
                    href={audioUrl}
                    download={filename || 'audio.mp3'}
                    className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-200
                     ${isLight 
                        ? 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50' 
                        : 'border-white/15 bg-white/5 text-white/60 hover:text-white hover:bg-white/15'
                     }`}
                    title="Download MP3"
                >
                    <FiDownload size={16} />
                </a>
            </div>
            </>
            )}
        </div>
    )
}
