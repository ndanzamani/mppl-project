import React from 'react';
import { Sparkles, Shield, Trophy } from 'lucide-react';

export default function Guild3DCanvas() {
    return (
        <div className="w-full h-56 relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 shadow-xl flex items-center justify-center p-6 group">
            {/* Animated Background Particles / Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700" />

            {/* 3D Animated RPG Crystal Object */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative">
                    {/* Glowing Aura Ring */}
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-lg animate-pulse" />
                    
                    {/* 3D Octahedron Crystal SVG */}
                    <svg
                        className="w-24 h-24 text-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-[bounce_4s_easeInOut_infinite]"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Top Facets */}
                        <polygon points="50,5 85,40 50,55" fill="url(#crystalTopRight)" opacity="0.9" />
                        <polygon points="50,5 15,40 50,55" fill="url(#crystalTopLeft)" opacity="0.8" />
                        
                        {/* Bottom Facets */}
                        <polygon points="50,55 85,40 50,95" fill="url(#crystalBottomRight)" opacity="0.95" />
                        <polygon points="50,55 15,40 50,95" fill="url(#crystalBottomLeft)" opacity="0.85" />
                        
                        {/* Inner Highlight Lines */}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                        <line x1="15" y1="40" x2="85" y2="40" stroke="#818cf8" strokeWidth="1" opacity="0.7" />

                        <defs>
                            <linearGradient id="crystalTopRight" x1="50" y1="5" x2="85" y2="55" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#818CF8" />
                                <stop offset="1" stopColor="#4F46E5" />
                            </linearGradient>
                            <linearGradient id="crystalTopLeft" x1="50" y1="5" x2="15" y2="55" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#C084FC" />
                                <stop offset="1" stopColor="#7C3AED" />
                            </linearGradient>
                            <linearGradient id="crystalBottomRight" x1="50" y1="55" x2="85" y2="95" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4F46E5" />
                                <stop offset="1" stopColor="#312E81" />
                            </linearGradient>
                            <linearGradient id="crystalBottomLeft" x1="50" y1="55" x2="15" y2="95" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#7C3AED" />
                                <stop offset="1" stopColor="#4C1D95" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div>
                    <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Crystal of Destiny
                    </h3>
                    <p className="text-xs text-indigo-200/80">3D Guild Sanctum Artifact • Level 5 Realm</p>
                </div>
            </div>

            {/* Bottom Overlay Badges */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center pointer-events-none z-20">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Guild Core Active</span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-full backdrop-blur-md">
                    Level 5 Core
                </span>
            </div>
        </div>
    );
}
