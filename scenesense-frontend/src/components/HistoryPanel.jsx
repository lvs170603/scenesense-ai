/**
 * components/HistoryPanel.jsx
 * Card list of previous caption results fetched from /history.
 */
import React from 'react'
import { FiClock, FiImage, FiGlobe } from 'react-icons/fi'

const LANG_LABEL = { en: 'English', hi: 'Hindi', te: 'Telugu' }
const MODE_COLOR = {
    simple: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    detailed: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    story: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30',
}

function HistoryCard({ record }) {
    const date = new Date(record.timestamp)
    const formatted = date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })

    return (
        <div className="glass-card p-4 flex flex-col gap-3 animate-fade-in hover:bg-white/15 transition-colors duration-200">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-white/50 text-xs min-w-0">
                    <FiImage size={12} className="flex-shrink-0" />
                    <span className="truncate font-mono" title={record.image_name}>
                        {record.image_name}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`badge border ${MODE_COLOR[record.mode] || MODE_COLOR.simple}`}>
                        {record.mode}
                    </span>
                    <span className="badge bg-white/10 text-white/60 border border-white/20 flex items-center gap-1">
                        <FiGlobe size={10} />
                        {LANG_LABEL[record.language] || record.language}
                    </span>
                </div>
            </div>

            {/* Caption */}
            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{record.caption}</p>

            {/* Translated */}
            {record.translated_caption && record.language !== 'en' && (
                <p className="text-white text-sm leading-relaxed border-t border-white/10 pt-2">
                    {record.translated_caption}
                </p>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-1 text-white/30 text-xs">
                <FiClock size={10} />
                <span>{formatted}</span>
            </div>
        </div>
    )
}

export default function HistoryPanel({ records, loading, error }) {
    if (loading) {
        return (
            <div className="text-center py-10 text-white/40 text-sm animate-pulse">
                Loading history…
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-400 text-sm">
                {error}
            </div>
        )
    }

    if (!records || records.length === 0) {
        return (
            <div className="text-center py-10 text-white/30 text-sm">
                No history yet. Generate your first caption!
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {records.map((r) => (
                <HistoryCard key={r._id} record={r} />
            ))}
        </div>
    )
}
