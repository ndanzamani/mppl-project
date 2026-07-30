import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Swords } from 'lucide-react';

export default function EmptyState3D({ title = "No Items Found", message = "Be the first adventurer to contribute to the realm!" }) {
    return (
        <div className="p-10 text-center bg-white/40 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center space-y-4 shadow-xl">
            {/* Animated 3D CSS Gem Artifact */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                    animate={{
                        rotateY: [0, 180, 360],
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/40 border border-yellow-200/50 flex items-center justify-center transform rotate-45"
                >
                    <div className="w-full h-full bg-slate-950/80 rounded-xl flex items-center justify-center">
                        <Swords className="w-8 h-8 text-amber-400 -rotate-45" />
                    </div>
                </motion.div>

                {/* Floating particle sparkles */}
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-2 -right-2"
                >
                    <Sparkles className="w-5 h-5 text-amber-300" />
                </motion.div>
            </div>

            <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white mt-1">
                    {title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mt-0.5">
                    {message}
                </p>
            </div>
        </div>
    );
}
