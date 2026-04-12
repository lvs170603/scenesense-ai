import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiRefreshCw, FiPlay, FiImage, FiCpu, FiClock, FiTrash2 } from 'react-icons/fi'
import { fetchHistory, deleteHistory } from '../services/api'
import { useTheme } from '../context/ThemeContext'
import LoadingSpinner from './LoadingSpinner'

export default function HistorySidebar({ isOpen, onClose, onLoadHistory }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [playingAudio, setPlayingAudio] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    useEffect(() => {
        if (isOpen) {
            loadHistory()
        } else {
            // Stop audio if closed
            if (playingAudio) {
                playingAudio.pause()
                setPlayingAudio(null)
            }
        }
    }, [isOpen])

    const loadHistory = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchHistory({ limit: 20 })
            setHistory(data.history || [])
        } catch (err) {
            setError(err.message || 'Failed to load history')
        } finally {
            setLoading(false)
        }
    }

    const handlePlayAudio = (url) => {
        if (!url) return
        if (playingAudio) {
            playingAudio.pause()
        }
        const audio = new Audio(url)
        audio.play()
        setPlayingAudio(audio)
        audio.onended = () => {
            if (playingAudio === audio) setPlayingAudio(null)
        }
    }

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return
        try {
            await deleteHistory(confirmDeleteId)
            setHistory(prev => prev.filter(item => item._id !== confirmDeleteId))
            setConfirmDeleteId(null)
        } catch (err) {
            alert(err.message || 'Failed to delete record.')
            setConfirmDeleteId(null)
        }
    }

    const formatDate = (isoStr) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(new Date(isoStr))
    }

    const SidebarVariants = {
        closed: { x: '100%', opacity: 0 },
        open: { x: 0, opacity: 1 }
    }

    const overlayClass = isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-sm'
    const sidebarClass = isLight 
        ? 'bg-white/95 border-l border-slate-200 text-slate-800' 
        : 'bg-slate-900/95 border-l border-slate-700 text-slate-100'

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-40 ${overlayClass}`}
                        onClick={onClose}
                    />

                    {/* Sidebar Panel */}
                    <motion.div 
                        variants={SidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] shadow-2xl flex flex-col ${sidebarClass}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-violet"
                                     style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                                    <FiClock className="text-white text-xl" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">Recent Generations</h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Confirmation Popup Modal Overlay */}
                        <AnimatePresence>
                            {confirmDeleteId && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                        className="w-full p-6 rounded-2xl shadow-2xl border"
                                        style={{ 
                                            background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(30,41,59,0.98)',
                                            borderColor: isLight ? '#E2E8F0' : '#475569'
                                        }}
                                    >
                                        <h3 className="text-lg font-bold mb-2">Delete Generation</h3>
                                        <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                            Are you sure you want to permanently remove this record? This action cannot be undone.
                                        </p>
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => setConfirmDeleteId(null)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium ${isLight ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800 hover:bg-slate-700'}`}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleConfirmDelete}
                                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <LoadingSpinner message="Fetching history..." fullScreen={false} />
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-400 mt-10">
                                    <p>⚠ {error}</p>
                                    <button onClick={loadHistory} className="mt-4 text-sm underline text-indigo-400">Retry</button>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center opacity-60 mt-20 flex flex-col items-center">
                                    <FiCpu size={40} className="mb-4" />
                                    <p>No successful generations found.</p>
                                    <p className="text-sm mt-2">Generate some content to see it here!</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {history.map((item, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={item._id} 
                                            className={`rounded-xl p-4 border transition-all ${
                                                isLight ? 'bg-slate-50 border-slate-200 hover:shadow-md' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Thumbnail preview */}
                                                <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                    {item.image_name ? (
                                                        <img src={`/static/uploads/${item.image_name}`} alt="preview" className="w-full h-full object-cover" />
                                                    ) : <FiImage size={24} className="opacity-50" />}
                                                </div>
                                                
                                                {/* Text Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                                            {item.language} | {item.mode}
                                                        </span>
                                                        <span className="text-[11px] opacity-60">{formatDate(item.timestamp)}</span>
                                                    </div>
                                                    
                                                    <p className={`text-sm truncate font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                                                        {item.caption}
                                                    </p>
                                                    <p className={`text-xs truncate italic mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {item.translated_caption}
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <button 
                                                            onClick={() => {
                                                                onLoadHistory(item)
                                                                onClose()
                                                            }}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                                                                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-700 hover:bg-slate-600 text-white'
                                                            }`}
                                                        >
                                                            <FiRefreshCw size={12} /> Reload to Workspace
                                                        </button>
                                                        
                                                        {item.audio_url && (
                                                            <button 
                                                                onClick={() => handlePlayAudio(item.audio_url)}
                                                                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                                                                    isLight ? 'bg-teal-100 hover:bg-teal-200 text-teal-800' : 'bg-teal-500/20 hover:bg-teal-500/40 text-teal-300'
                                                                }`}
                                                            >
                                                                <FiPlay size={12} /> Play
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => setConfirmDeleteId(item._id)}
                                                            className="flex items-center justify-center p-1.5 rounded-lg text-xs font-semibold transition-colors text-red-500/80 hover:bg-red-500/10 hover:text-red-500"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
