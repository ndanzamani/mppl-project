import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Components/ThemeProvider';
import { Sun, Moon, Sparkles, Trees, Sunset, Palette, Check } from 'lucide-react';

const THEME_OPTIONS = [
    {
        id: 'light',
        name: 'Light Realm',
        icon: Sun,
        dots: ['#6366F1', '#F8FAFC', '#0F172A'],
        accentClass: 'text-indigo-500',
    },
    {
        id: 'dark',
        name: 'Dark Realm',
        icon: Moon,
        dots: ['#F59E0B', '#0F172A', '#1E293B'],
        accentClass: 'text-amber-400',
    },
    {
        id: 'midnight',
        name: 'Midnight Cyber',
        icon: Sparkles,
        dots: ['#A855F7', '#0B0719', '#160F30'],
        accentClass: 'text-purple-400',
    },
    {
        id: 'forest',
        name: 'Forest Tavern',
        icon: Trees,
        dots: ['#10B981', '#061A14', '#0B2920'],
        accentClass: 'text-emerald-400',
    },
    {
        id: 'sunset',
        name: 'Sunset Realm',
        icon: Sunset,
        dots: ['#F43F5E', '#1A0C16', '#2D1224'],
        accentClass: 'text-rose-400',
    },
];

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const currentOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[1];
    const IconComponent = currentOption.icon;

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 dark:bg-slate-800/80 border border-gray-200/20 dark:border-slate-700/60 text-xs font-extrabold hover:bg-white/20 dark:hover:bg-slate-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Switch Theme"
            >
                <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <IconComponent className={`w-4 h-4 ${currentOption.accentClass}`} />
                </motion.div>
                <span className="hidden sm:inline text-gray-900 dark:text-white">{currentOption.name}</span>
                <Palette className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-1"
                    >
                        <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                            Select Realm Theme
                        </div>

                        {THEME_OPTIONS.map((opt) => {
                            const OptIcon = opt.icon;
                            const isSelected = theme === opt.id;

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        setTheme(opt.id);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                                        isSelected
                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <OptIcon className={`w-4 h-4 ${opt.accentClass}`} />
                                        <span>{opt.name}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center -space-x-1">
                                            {opt.dots.map((dot, idx) => (
                                                <span
                                                    key={idx}
                                                    className="w-2.5 h-2.5 rounded-full border border-slate-900"
                                                    style={{ backgroundColor: dot }}
                                                />
                                            ))}
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
