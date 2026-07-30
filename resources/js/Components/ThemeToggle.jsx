import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light mode"
        >
            {darkMode ? (
                <>
                    <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="text-xs font-semibold hidden md:inline">Light Realm</span>
                </>
            ) : (
                <>
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold hidden md:inline">Dark Realm</span>
                </>
            )}
        </button>
    );
}
