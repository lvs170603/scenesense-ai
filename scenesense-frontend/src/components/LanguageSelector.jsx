/**
 * components/LanguageSelector.jsx
 * Dropdown to choose the caption output language.
 */
import React from 'react'
import { FiGlobe } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const SUPPORTED_LANGS = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'zh', label: '🇨🇳 Chinese' },
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

export default function LanguageSelector({ value, onChange, disabled }) {
    const { theme } = useTheme()
    const isLight = theme === 'light'
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef(null)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedLabel = SUPPORTED_LANGS.find(l => l.code === value)?.label || 'Select Language'

    const containerClass = isLight 
        ? 'w-full bg-white border-slate-300 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center p-3 cursor-pointer border shadow-sm transition-colors'
        : 'w-full bg-[rgba(15,23,42,0.8)] border-[rgba(255,255,255,0.08)] text-slate-200 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center p-3 cursor-pointer border shadow-sm transition-colors object-cover'

    const dropdownMenuClass = isLight
        ? 'absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1'
        : 'absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto py-1'

    const optionClass = isLight
        ? 'px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between'
        : 'px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-700/50 transition-colors flex items-center justify-between'

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                type="button"
                className={`${containerClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <div className="flex items-center gap-3">
                    <FiGlobe size={16} className="text-indigo-500" />
                    <span className="font-medium">{selectedLabel}</span>
                </div>
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>

            {isOpen && (
                <ul className={dropdownMenuClass}>
                    {SUPPORTED_LANGS.map(lang => (
                        <li 
                            key={lang.code}
                            className={`${optionClass} ${value === lang.code ? (isLight ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'bg-indigo-500/20 text-indigo-300 font-semibold') : (isLight ? 'text-slate-700' : 'text-slate-300')}`}
                            onClick={() => {
                                onChange(lang.code)
                                setIsOpen(false)
                            }}
                        >
                            {lang.label}
                            {value === lang.code && (
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
