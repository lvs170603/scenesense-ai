/**
 * components/StyleModeSelector.jsx
 * Toggle between Simple / Detailed / Story caption modes.
 */
import React from 'react'
import { FiZap, FiSearch, FiBookOpen } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const MODES = [
    { value: 'simple', label: 'Simple', icon: FiZap, desc: 'Short & concise' },
    { value: 'detailed', label: 'Detailed', icon: FiSearch, desc: 'Rich description' },
    { value: 'story', label: 'Story', icon: FiBookOpen, desc: 'Narrative style' },
]

export default function StyleModeSelector({ value, onChange, disabled }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 transition-colors duration-300"
                style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                Caption Style
            </p>
            <div className="grid grid-cols-3 gap-2">
                {MODES.map(({ value: v, label, icon: Icon, desc }) => {
                    const active = value === v
                    
                    // Dark mode dynamic classes are preserved, but for Light mode we can override with inline styles or specific classes
                    const lightActiveBg = 'rgba(6,182,212,0.1)'
                    const lightActiveBorder = '#06B6D4'
                    const lightActiveText = '#0F172A'
                    const lightIdleBg = 'rgba(255,255,255,0.6)'
                    const lightIdleBorder = 'rgba(0,0,0,0.08)'
                    const lightIdleText = '#475569'

                    return (
                        <button
                            key={v}
                            onClick={() => !disabled && onChange(v)}
                            disabled={disabled}
                            style={isLight ? {
                                background: active ? lightActiveBg : lightIdleBg,
                                borderColor: active ? lightActiveBorder : lightIdleBorder,
                                color: active ? lightActiveText : lightIdleText,
                                boxShadow: active ? '0 4px 12px rgba(6,182,212,0.15)' : 'none'
                            } : undefined}
                            className={`
                flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm
                transition-all duration-200 active:scale-95
                ${!isLight ? (active
                                        ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/20'
                                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white'
                                ) : 'hover:border-cyan-400 hover:bg-cyan-50' }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            <Icon size={18} className={active ? 'text-cyan-500' : ''} />
                            <span className="font-semibold">{label}</span>
                            <span className="text-xs opacity-60 leading-tight">{desc}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
