/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#dde7ff',
                    200: '#bad0ff',
                    300: '#86aaff',
                    400: '#4c7bff',
                    500: '#2653ff',
                    600: '#0d35f5',
                    700: '#0a27d8',
                    800: '#0f23af',
                    900: '#122488',
                },
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%, 100%': { backgroundPosition: '-200% 0' },
                    '50%': { backgroundPosition: '200% 0' },
                },
                spin: {
                    to: { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.4s ease-out both',
                shimmer: 'shimmer 2s linear infinite',
                spin: 'spin 0.8s linear infinite',
            },
        },
    },
    plugins: [],
}
