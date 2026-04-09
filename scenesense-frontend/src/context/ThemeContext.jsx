/**
 * context/ThemeContext.jsx
 * Global dark/light theme context with localStorage persistence.
 * Usage: wrap app in <ThemeProvider>, then call useTheme() anywhere.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Read saved preference; default to dark
        return localStorage.getItem('theme') || 'dark';
    });

    // Apply/remove 'light' class on <html> whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light');
        } else {
            root.classList.remove('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
