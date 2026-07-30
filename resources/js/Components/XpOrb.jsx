import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Award, X, Swords } from 'lucide-react';

export default function XpOrb({ user = {} }) {
    const [openModal, setOpenModal] = useState(false);

    const xp = user.xp || 1500;
    const level = user.level || Math.floor(Math.sqrt(xp / 100)) + 1;
    const nextLevel = level + 1;

    const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
    const nextLevelXp = Math.pow(level, 2) * 100;
    const levelXpNeeded = Math.max(1, nextLevelXp - currentLevelBaseXp);
    const userLevelProgressXp = Math.max(0, xp - currentLevelBaseXp);

    const percent = Math.min(100, Math.round((userLevelProgressXp / levelXpNeeded) * 100));

    return (
        <>
            {/* TopBar XP Orb Button */}
            <button
                onClick={() => setOpenModal(true)}
                className="group flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="View Experience Breakdown"
            >
                {/* Glowing Orb Sphere */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative overflow-hidden">
                        {/* Fluid fill level */}
                        <div
                            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-amber-500 to-yellow-300 opacity-80 transition-all duration-500"
                            style={{ height: `${percent}%` }}
                        />
                        <span className="text-[10px] font-black text-amber-300 relative z-10">
                            {level}
                        </span>
                    </div>
                </div>

                <div className="text-left hidden sm:block">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">
                        LEVEL {level}
                    </div>
                    <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                        {xp} XP
                    </div>
                </div>
            </button>

            {/* Experience Breakdown Modal */}
            <AnimatePresence>
                {openModal && (
                    <div
                        onClick={() => setOpenModal(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer"
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative cursor-default"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                        Experience & Rank Orb
                                    </h3>
                                </div>

                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Large Orb Center Display */}
                            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 text-center space-y-3">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-xl shadow-amber-500/30">
                                    <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                                        <span className="text-[10px] text-amber-400 font-extrabold uppercase">LVL</span>
                                        <span className="text-2xl font-black text-amber-300 leading-none">{level}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white">
                                        Level {level} Adventurer
                                    </h4>
                                    <p className="text-xs text-amber-400 font-extrabold">
                                        {xp} Total Experience Points
                                    </p>
                                </div>
                            </div>

                            {/* Progress to Next Level */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-extrabold">
                                    <span className="text-gray-600 dark:text-slate-300">Progress to Level {nextLevel}</span>
                                    <span className="text-amber-400">{percent}% ({userLevelProgressXp} / {levelXpNeeded} XP)</span>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-3 p-0.5 border border-gray-300 dark:border-slate-700 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full rounded-full shadow-md shadow-amber-500/50"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-slate-400 text-center font-semibold">
                                    Formula: <code className="text-amber-400">level = floor(sqrt(xp / 100)) + 1</code>
                                </p>
                            </div>

                            {/* Recommended XP Activities */}
                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block">
                                    Earn XP Activities
                                </span>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                                        <span className="font-bold text-gray-700 dark:text-slate-300">Complete Quests</span>
                                        <span className="font-extrabold text-amber-400">+Reward XP</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                                        <span className="font-bold text-gray-700 dark:text-slate-300">Help Coworkers</span>
                                        <span className="font-extrabold text-amber-400">Level Up</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
