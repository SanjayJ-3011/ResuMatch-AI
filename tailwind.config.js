/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    400: '#818cf8',
                    500: '#6366f1', // Indigo
                    600: '#4f46e5',
                    700: '#4338ca',
                    900: '#312e81',
                },
                success: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669', // Emerald
                    700: '#047857',
                    900: '#064e3b',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706', // Amber
                    700: '#b45309',
                    900: '#78350f',
                },
                error: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48', // Rose
                    700: '#be123c',
                    900: '#881337',
                },
                // Switch standard gray to Slate for a premium dark mode feel
                gray: {
                    25: '#f8fafc',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Slate 900
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
                'card': '0 0 0 1px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.2)',
                'card-hover': '0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.4)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
