import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTheme } from '@/Components/ThemeProvider';
import { useUiMode } from '@/Components/UiModeContext';
import {
    Settings as SettingsIcon,
    Palette,
    Briefcase,
    Swords,
    Sparkles,
    Sun,
    Moon,
    Flame,
    TreePine,
    Sunset
} from 'lucide-react';

const THEMES = [
    { id: 'light', name: 'Parchment Light', icon: Sun, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'dark', name: 'Dark Realm', icon: Moon, color: 'bg-slate-900 text-amber-400 border-amber-500/40' },
    { id: 'midnight', name: 'Midnight Arcane', icon: Flame, color: 'bg-indigo-950 text-indigo-300 border-indigo-500/40' },
    { id: 'forest', name: 'Forest RPG', icon: TreePine, color: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
    { id: 'sunset', name: 'Sunset Haven', icon: Sunset, color: 'bg-rose-950 text-rose-300 border-rose-500/40' },
];

export default function Settings() {
    const { theme, setTheme, changeTheme } = useTheme();
    const { uiMode, setUiMode, changeUiMode, isCorporate } = useUiMode();

    const handleThemeChange = (targetTheme) => {
        if (setTheme) setTheme(targetTheme);
        else if (changeTheme) changeTheme(targetTheme);
    };

    const handleUiModeChange = (targetMode) => {
        if (setUiMode) setUiMode(targetMode);
        else if (changeUiMode) changeUiMode(targetMode);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings & Appearance - Workspace" />

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Header Banner */}
                <div className={`border-2 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex items-center justify-between gap-4 ${
                    isCorporate
                        ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-indigo-500/30'
                        : 'bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/30'
                }`}>
                    <div className="space-y-1">
                        <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${
                            isCorporate ? 'text-indigo-400' : 'text-amber-400'
                        }`}>
                            <SettingsIcon className="w-4 h-4" />
                            System Preferences
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">
                            Settings & Visual Appearance
                        </h1>
                        <p className="text-xs text-slate-300">
                            Customize your user interface mode, color themes, and workspace preferences.
                        </p>
                    </div>
                </div>

                {/* Section 1: UI Experience Mode (RPG vs Corporate) */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            {isCorporate ? <Briefcase className="w-6 h-6" /> : <Swords className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="font-extrabold text-base text-gray-900 dark:text-white">
                                UI Experience Mode
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Choose between Medieval Gamified RPG mode and Sleek Enterprise Corporate mode.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Option 1: RPG Mode */}
                        <button
                            type="button"
                            onClick={() => handleUiModeChange('rpg')}
                            className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                                uiMode === 'rpg'
                                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                                    : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-400 hover:border-amber-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                                    <Swords className="w-5 h-5" />
                                </span>
                                {uiMode === 'rpg' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                                        Active
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                                    🎮 RPG Gamified Mode
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Medieval parchment styling, Experience Orbs, Guild Hall, Missions Board, Quest Log, and Status Auras.
                                </p>
                            </div>
                        </button>

                        {/* Option 2: Corporate Mode */}
                        <button
                            type="button"
                            onClick={() => handleUiModeChange('corporate')}
                            className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                                uiMode === 'corporate'
                                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                    : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-400 hover:border-indigo-500/40'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <Briefcase className="w-5 h-5" />
                                </span>
                                {uiMode === 'corporate' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase">
                                        Active
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                                    💼 Sleek Corporate Mode
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Minimalist enterprise SaaS layout, Slate/Indigo palette, Executive Dashboard, Project Roadmap, and Employee Directory.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Section 2: Color Theme Palette */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-base text-gray-900 dark:text-white">
                                Color Palette & Theme
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Select your favorite visual color scheme across the application.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {THEMES.map((tItem) => {
                            const IconComp = tItem.icon;
                            const isSelected = theme === tItem.id;
                            return (
                                <button
                                    key={tItem.id}
                                    type="button"
                                    onClick={() => handleThemeChange(tItem.id)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${tItem.color} ${
                                        isSelected ? 'ring-2 ring-amber-500 scale-105 shadow-md' : 'opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    <IconComp className="w-5 h-5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-extrabold text-xs truncate">{tItem.name}</div>
                                        <div className="text-[10px] opacity-75 capitalize">{tItem.id} theme</div>
                                    </div>
                                    {isSelected && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
