/**
 * components/LanguageSelector.jsx
 * Dropdown to choose the caption output language.
 */
import React from 'react'
import { FiGlobe } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const LANGUAGES = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'hi', label: '🇮🇳 Hindi' },
    { code: 'te', label: '🇮🇳 Telugu' },
]

export default function LanguageSelector({ value, onChange, disabled }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5 transition-colors duration-300"
               style={{ color: isLight ? '#64748B' : 'rgba(255,255,255,0.6)' }}>
                <FiGlobe size={12} /> Output Language
            </p>
            <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(({ code, label }) => {
                    const active = value === code
                    
                    const lightActiveBg = 'rgba(217,70,239,0.1)'
                    const lightActiveBorder = '#D946EF'
                    const lightActiveText = '#0F172A'
                    const lightIdleBg = 'rgba(255,255,255,0.6)'
                    const lightIdleBorder = 'rgba(0,0,0,0.08)'
                    const lightIdleText = '#475569'

                    return (
                        <button
                            key={code}
                            onClick={() => !disabled && onChange(code)}
                            disabled={disabled}
                            style={isLight ? {
                                background: active ? lightActiveBg : lightIdleBg,
                                borderColor: active ? lightActiveBorder : lightIdleBorder,
                                color: active ? lightActiveText : lightIdleText,
                                boxShadow: active ? '0 4px 12px rgba(217,70,239,0.15)' : 'none'
                            } : undefined}
                            className={`
                py-2.5 px-3 rounded-xl border text-sm font-medium
                transition-all duration-200 active:scale-95
                ${!isLight ? (active
                                        ? 'border-fuchsia-400 bg-fuchsia-500/15 text-white shadow-lg shadow-fuchsia-500/20'
                                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-fuchsia-400/40 hover:bg-white/10 hover:text-white'
                                ) : 'hover:border-fuchsia-400 hover:bg-fuchsia-50'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
