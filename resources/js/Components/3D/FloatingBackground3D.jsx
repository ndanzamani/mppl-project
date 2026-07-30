import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingBackground3D() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            {/* Floating 3D Octahedron / Crystal 1 */}
            <motion.div
                animate={{
                    y: [0, -25, 0],
                    rotateX: [0, 180, 360],
                    rotateY: [0, 360, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/4 left-10 w-24 h-24 border-2 border-amber-400/50 bg-gradient-to-tr from-amber-500/20 to-yellow-300/10 rounded-2xl backdrop-blur-md shadow-2xl shadow-amber-500/20 transform rotate-45"
            />

            {/* Floating 3D Prism / Cube 2 */}
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    rotateX: [360, 180, 0],
                    rotateZ: [0, 180, 360],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute bottom-1/3 right-16 w-32 h-32 border-2 border-indigo-500/50 bg-gradient-to-tr from-indigo-600/20 to-purple-400/10 rounded-3xl backdrop-blur-md shadow-2xl shadow-indigo-500/20"
            />

            {/* Floating 3D Diamond 3 */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    x: [0, 15, 0],
                    rotate: [0, 90, 180],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-16 right-1/3 w-20 h-20 border-2 border-emerald-400/50 bg-gradient-to-tr from-emerald-500/20 to-teal-300/10 rounded-xl backdrop-blur-md shadow-2xl shadow-emerald-500/20 transform rotate-12"
            />

            {/* Glowing Orb 4 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute bottom-10 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-600/20 via-rose-500/10 to-transparent rounded-full blur-3xl"
            />
        </div>
    );
}
