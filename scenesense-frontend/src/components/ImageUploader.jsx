/**
 * components/ImageUploader.jsx
 * Drag-and-drop + click-to-browse image uploader with theme awareness.
 */
import React, { useCallback, useRef, useState } from 'react'
import { FiUploadCloud, FiImage, FiX } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function ImageUploader({ onFileSelected, previewUrl, disabled }) {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const { theme } = useTheme()
    const isLight = theme === 'light'

    const handleFile = useCallback(
        (file) => {
            if (!file) return
            const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
            if (!allowed.includes(file.type)) {
                alert('Please upload a PNG, JPG, WEBP, or GIF image.')
                return
            }
            if (file.size > 16 * 1024 * 1024) {
                alert('File too large. Maximum size is 16 MB.')
                return
            }
            onFileSelected(file)
        },
        [onFileSelected]
    )

    const onDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        if (disabled) return
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    const onInputChange = (e) => handleFile(e.target.files[0])

    const clear = (e) => {
        e.stopPropagation()
        onFileSelected(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    const idleBg = isLight
        ? (dragging ? 'rgba(6,182,212,0.06)' : 'rgba(255,255,255,0.7)')
        : (dragging ? 'rgba(6,182,212,0.10)' : 'rgba(255,255,255,0.05)')

    const idleBorder = dragging
        ? '#06B6D4'
        : isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)'

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Upload image"
            onClick={() => !disabled && inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
                minHeight: '260px',
                background: idleBg,
                borderColor: idleBorder,
                transform: dragging ? 'scale(1.01)' : 'scale(1)',
                transition: 'background 0.3s, border-color 0.3s, transform 0.2s',
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={onInputChange}
                disabled={disabled}
                id="image-input"
            />

            {previewUrl ? (
                <>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-2xl"
                        style={{ maxHeight: '360px' }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <span className="text-white font-semibold flex items-center gap-2">
                            <FiImage /> Change Image
                        </span>
                    </div>
                    {/* Clear button */}
                    {!disabled && (
                        <button
                            onClick={clear}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors z-10"
                            title="Remove image"
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-10 h-full min-h-[260px]">
                    <div className="p-5 rounded-full border group-hover:scale-110 transition-transform duration-300"
                        style={{
                            background: isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.10)',
                            borderColor: 'rgba(6,182,212,0.30)',
                        }}>
                        <FiUploadCloud size={40} style={{ color: '#06B6D4' }} />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-lg" style={{ color: isLight ? '#0F172A' : '#F1F5F9' }}>
                            Drop an image here
                        </p>
                        <p className="text-sm mt-1" style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                            or click to browse
                        </p>
                        <p className="text-xs mt-2 uppercase tracking-wide" style={{ color: isLight ? '#64748B' : '#475569' }}>
                            PNG · JPG · WEBP · GIF · up to 16 MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
