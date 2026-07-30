import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playRaiseTankard } from '@/Utils/sound';
import { Volume2, Mic, MicOff, Sparkles, Flame, User, ScrollText, Award } from 'lucide-react';

export default function VoiceMeetingRoom3D({ participants = [], activeSpeakerId, presentationUrl }) {
    const [muted, setMuted] = useState(false);
    const [tankardRaised, setTankardRaised] = useState(false);

    const handleRaiseTankard = () => {
        const nextState = !tankardRaised;
        setTankardRaised(nextState);
        if (nextState) {
            playRaiseTankard();
        }
    };

    const seatedParticipants = (participants.length > 0 ? participants : [
        { id: 1, user: { name: 'Guild Master User', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' }, seat_number: 1 },
        { id: 2, user: { name: 'Arthur Vance', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2' }, seat_number: 2 },
        { id: 3, user: { name: 'Elena Rostova', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=3' }, seat_number: 3 },
        { id: 4, user: { name: 'Gareth Ironwood', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=4' }, seat_number: 4 },
    ]);

    return (
        <div className="relative w-full min-h-[520px] rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 p-6 shadow-2xl flex flex-col justify-between font-sans">
            {/* Ambient Animated Fireplace in Background */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg backdrop-blur-md">
                    <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                    <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                        TAVERN HEARTH & FIREPLACE
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
            </div>

            {/* Guild Notice Board (Presentation Board) */}
            <div className="mt-12 max-w-xl mx-auto w-full p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-2xl text-center space-y-2 relative z-10 backdrop-blur-md">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                    📜 GUILD NOTICE BOARD (PRESENTATION SCROLL)
                </span>
                <h4 className="text-xs font-bold text-white">
                    {presentationUrl ? 'Live Presentation Scroll Active' : 'No Presentation Scroll Pinned'}
                </h4>
                <p className="text-[10px] text-amber-200/70">
                    Broadcast quest notes and architecture diagrams to all party members in the Voice Tavern.
                </p>
            </div>

            {/* Round Wooden Carved Table & Seated Party Avatars */}
            <div className="relative my-8 py-8 flex flex-col items-center justify-center">
                {/* 3D Round Wooden Table Surface */}
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-950 via-amber-900 to-amber-950 border-4 border-amber-600/40 shadow-2xl shadow-amber-950/80 flex items-center justify-center relative overflow-hidden">
                    {/* Table Carvings & Food Props */}
                    <div className="w-36 h-36 rounded-full border border-amber-500/20 bg-amber-950/60 flex flex-col items-center justify-center text-center p-2">
                        <span className="text-2xl">🍺 🍞 🧀</span>
                        <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider mt-1">
                            TAVERN PROPS
                        </span>
                    </div>

                    {/* Raised Tankard Indicator Toast */}
                    <AnimatePresence>
                        {tankardRaised && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                className="absolute top-4 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-xl border border-yellow-200 flex items-center gap-1.5 animate-bounce z-20"
                            >
                                <span>🍺 Raised Tankard in Honor!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Seated Avatars around Table */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="grid grid-cols-2 gap-x-48 gap-y-36 sm:gap-x-64 sm:gap-y-48">
                        {seatedParticipants.map((p) => (
                            <div key={p.id} className="pointer-events-auto flex flex-col items-center">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-lg border border-amber-300">
                                        <img
                                            src={p.user?.avatar}
                                            alt={p.user?.name}
                                            className="w-full h-full rounded-full object-cover bg-slate-950"
                                        />
                                    </div>

                                    {tankardRaised && p.id === 1 && (
                                        <span className="absolute -top-3 -right-2 text-base">🍺</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold text-white bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full mt-1 shadow-md whitespace-nowrap">
                                    {p.user?.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Tavern Controls Bar */}
            <div className="relative z-20 max-w-md mx-auto w-full flex items-center justify-center gap-3 bg-slate-900/95 border border-amber-500/30 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl">
                <button
                    onClick={() => setMuted(!muted)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        muted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                >
                    {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{muted ? 'Muted' : 'Voice Live'}</span>
                </button>

                <button
                    onClick={handleRaiseTankard}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                        tankardRaised ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    }`}
                >
                    <span>🍺 Raise Tankard</span>
                </button>
            </div>
        </div>
    );
}
