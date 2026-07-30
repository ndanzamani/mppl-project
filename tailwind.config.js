import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                guild: {
                    dark: '#0B0F19',
                    surface: '#111827',
                    card: '#1F2937',
                    border: '#374151',
                    accent: '#6366F1',
                    gold: '#F59E0B',
                    xp: '#10B981',
                }
            }
        },
    },

    plugins: [forms],
};
