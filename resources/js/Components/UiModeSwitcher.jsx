import React from 'react';
import { motion } from 'framer-motion';
import { useUiMode } from './UiModeContext';
import { Swords, Briefcase, Sparkles, Building2 } from 'lucide-react';

export default function UiModeSwitcher() {
    const { uiMode, toggleUiMode, isCorporate } = useUiMode();

    return (
        <button
            onClick={toggleUiMode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                isCorporate
                    ? 'bg-slate-900 border-indigo-500/40 text-indigo-300 hover:bg-slate-800 shadow-indigo-500/10'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-amber-500/10'
            }`}
            title={`Current UI Mode: ${isCorporate ? 'Corporate Enterprise' : 'RPG Gamified'}. Click to switch.`}
        >
            <motion.div
                key={uiMode}
                initial={{ rotate: -180, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {isCorporate ? (
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                ) : (
                    <Swords className="w-4 h-4 text-amber-400" />
                )}
            </motion.div>

            <span className="hidden sm:inline uppercase tracking-wider">
                {isCorporate ? '💼 Corporate' : '🎮 RPG Mode'}
            </span>
        </button>
    );
}
