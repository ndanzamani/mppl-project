import React from 'react';

export default function SkeletonShimmer({ className = 'h-24 w-full' }) {
    return (
        <div className={`relative overflow-hidden bg-slate-800/50 rounded-2xl ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}
