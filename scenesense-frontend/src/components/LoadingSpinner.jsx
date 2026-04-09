/**
 * components/LoadingSpinner.jsx
 * Full-screen or inline animated spinner overlay.
 */
import React from 'react'

export default function LoadingSpinner({ message = 'Processing…', fullScreen = true }) {
    const inner = (
        <div className="flex flex-col items-center gap-4">
            {/* Spinning ring */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                </div>
            </div>
            <p className="text-white/70 text-sm font-medium tracking-wide animate-pulse">{message}</p>
        </div>
    )

    if (!fullScreen) return <div className="flex justify-center py-8">{inner}</div>

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {inner}
        </div>
    )
}
