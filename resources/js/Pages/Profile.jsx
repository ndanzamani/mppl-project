import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { playLevelUp, playQuestComplete } from '@/Utils/sound';
import {
    Shield,
    Sparkles,
    Swords,
    Award,
    Calendar,
    Zap,
    Crown,
    BookOpen,
    CheckCircle2,
    Lock,
    ChevronDown,
    Flame,
    Feather,
    UserCheck,
    Scroll
} from 'lucide-react';

export default function Profile() {
    const { auth } = usePage().props;
    const initialUser = auth?.user || {};

    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [awardedXp, setAwardedXp] = useState(0);

    const statusAuras = [
        { id: 'working', label: 'Working Aura', emoji: '💼', ring: 'ring-emerald-500 text-emerald-400 bg-emerald-500/10' },
        { id: 'free', label: 'Free Aura', emoji: '☕', ring: 'ring-blue-500 text-blue-400 bg-blue-500/10' },
        { id: 'on_vacation', label: 'Vacation Aura', emoji: '🌴', ring: 'ring-amber-500 text-amber-400 bg-amber-500/10' },
        { id: 'sick', label: 'Sick Aura', emoji: '🤒', ring: 'ring-rose-500 text-rose-400 bg-rose-500/10' },
        { id: 'away', label: 'Away Aura', emoji: '🏃', ring: 'ring-orange-500 text-orange-400 bg-orange-500/10' },
        { id: 'do_not_disturb', label: 'DND Aura', emoji: '⛔', ring: 'ring-purple-500 text-purple-400 bg-purple-500/10' },
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/users/1');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch character sheet:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            const res = await axios.patch(`/api/users/${user.id}/status`, { status: newStatus });
            setUser({ ...user, status: res.data.status });
            setStatusDropdownOpen(false);
        } catch (err) {
            console.error('Failed to update status aura:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAwardXpDemo = async () => {
        try {
            const res = await axios.post(`/api/users/${user.id}/award-xp`, { xp_amount: 500 });
            setUser({
                ...user,
                xp: res.data.xp,
                level: res.data.level,
            });

            if (res.data.leveled_up) {
                setAwardedXp(500);
                setShowLevelUpModal(true);
                playLevelUp();
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            } else {
                playQuestComplete();
            }
        } catch (err) {
            console.error('Failed to award demo XP:', err);
        }
    };

    const currentAura = statusAuras.find((s) => s.id === user.status) || statusAuras[0];
    const roleName = user.role_name || 'Guild Master';

    // Calculate Class Title
    const classTitles = {
        'Guild Master': 'Guild Arch-Paladin',
        'Project Manager': 'Grand Quest Giver',
        'Senior Developer': 'Senior Code Sorcerer',
        'Developer': 'Fullstack Adventurer',
        'Intern': 'Apprentice Scribe',
    };
    const classTitle = classTitles[roleName] || 'Fullstack Adventurer';

    const currentLevelBaseXp = Math.pow((user.level || 1) - 1, 2) * 100;
    const nextLevelXp = Math.pow(user.level || 1, 2) * 100;
    const levelXpNeeded = Math.max(1, nextLevelXp - currentLevelBaseXp);
    const userLevelProgressXp = Math.max(0, (user.xp || 0) - currentLevelBaseXp);

    const xpPercent = Math.min(100, Math.round((userLevelProgressXp / levelXpNeeded) * 100));

    return (
        <AuthenticatedLayout user={user}>
            <Head title={`${user.name}'s Character Sheet - GuildHall`} />

            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Character Sheet Top Header */}
                <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        {/* Ornate Character Portrait Frame */}
                        <div className="relative shrink-0">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-2xl shadow-amber-500/40 border-2 border-yellow-200">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                                    alt={user.name}
                                    className="w-full h-full rounded-[22px] object-cover bg-slate-950"
                                />
                            </div>

                            {/* Level Badge Ring */}
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 font-black text-xs shadow-lg flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                Lvl {user.level}
                            </span>
                        </div>

                        {/* Character Details & Status Aura */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div>
                                <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                                    <Crown className="w-4 h-4 text-amber-400" />
                                    {roleName} (Rank {user.hierarchy_level || 100})
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                                    {user.name}
                                </h1>
                                <p className="text-xs text-amber-200/80 font-bold mt-0.5">
                                    {classTitle} • Member since {user.joined_at ? new Date(user.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 2026'}
                                </p>
                            </div>

                            {/* Status Aura Dropdown Selector */}
                            <div className="relative inline-block">
                                <button
                                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                    className={`px-4 py-2 rounded-2xl border ${currentAura.ring} font-extrabold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md`}
                                >
                                    <span>{currentAura.emoji}</span>
                                    <span>{currentAura.label}</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                </button>

                                <AnimatePresence>
                                    {statusDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 space-y-1"
                                        >
                                            <div className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                                Select Status Aura
                                            </div>
                                            {statusAuras.map((st) => (
                                                <button
                                                    key={st.id}
                                                    onClick={() => handleStatusChange(st.id)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
                                                >
                                                    <span>{st.emoji}</span>
                                                    <span>{st.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Demo XP Button */}
                        <button
                            onClick={handleAwardXpDemo}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                        >
                            <Zap className="w-4 h-4 fill-slate-950" />
                            <span>Complete Quest (+500 XP)</span>
                        </button>
                    </div>
                </div>

                {/* RPG Stats Grid (Strength, Wisdom, Charisma, Endurance) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Strength ⚔️', sub: 'Votes & Proposals', value: `${user.stats?.votes_given || 12} Contributions`, color: 'from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-400' },
                        { label: 'Wisdom 📜', sub: 'Missions Approved', value: `${user.stats?.projects_approved || 5} Sealed`, color: 'from-indigo-500/10 to-blue-500/5 border-indigo-500/20 text-indigo-400' },
                        { label: 'Charisma ✨', sub: 'Quests Completed', value: `${user.stats?.quests_completed || 8} Helped`, color: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400' },
                        { label: 'Endurance 🛡️', sub: 'Days Employed', value: `${user.days_employed || 61} Days`, color: 'from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-400' },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className={`p-5 rounded-3xl bg-gradient-to-br ${stat.color} border shadow-sm space-y-1`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest block opacity-90">
                                {stat.label}
                            </span>
                            <div className="text-lg font-black text-gray-900 dark:text-white">
                                {stat.value}
                            </div>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold block">
                                {stat.sub}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Experience Bar & Rewards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* XP Progress */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Level {user.level} Experience Progress
                            </h3>
                            <span className="text-xs font-extrabold text-amber-400">
                                {user.xp} / {nextLevelXp} XP ({xpPercent}%)
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-4 p-0.5 border border-gray-300 dark:border-slate-700 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 h-full rounded-full shadow-md shadow-amber-500/50"
                            />
                        </div>

                        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                            Formula: <code className="text-amber-400 font-bold">level = floor(sqrt(xp / 100)) + 1</code>. Complete quests, submit missions, or vote proposals to earn XP!
                        </p>
                    </div>

                    {/* Equipment & Assigned Role */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-400" />
                            Equipped Role & Title
                        </h3>

                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest block text-amber-500">Current Title</span>
                            <span className="font-black text-sm block">{classTitle}</span>
                            <span className="text-xs text-slate-300 block">{roleName} • Hierarchy Level {user.hierarchy_level || 100}</span>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        Guild Badges & Achievements
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(user.achievements || [
                            { id: 1, title: 'First Quest Completed', unlocked: true, desc: 'Completed initial quest' },
                            { id: 2, title: 'Guild Team Player', unlocked: true, desc: 'Active party contributor' },
                            { id: 3, title: 'Level 5 Veteran', unlocked: user.level >= 5, desc: 'Reached Level 5 Rank' },
                            { id: 4, title: 'Level 10 Legend', unlocked: user.level >= 10, desc: 'Reached Level 10 Rank' },
                        ]).map((ach) => (
                            <div
                                key={ach.id}
                                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                                    ach.unlocked
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-500 opacity-60'
                                }`}
                            >
                                <div className={`p-2 rounded-xl ${ach.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {ach.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>

                                <div>
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white">
                                        {ach.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold mt-0.5">
                                        {ach.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Level Up Modal */}
            <AnimatePresence>
                {showLevelUpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl shadow-amber-500/50">
                                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-amber-400 animate-spin" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                                    TRIUMPHANT RANK UP!
                                </span>
                                <h3 className="text-2xl font-black text-white">
                                    Level Up to Level {user.level}!
                                </h3>
                                <p className="text-xs text-amber-200/80 font-bold">
                                    +{awardedXp} Experience Points Awarded!
                                </p>
                            </div>

                            <button
                                onClick={() => setShowLevelUpModal(false)}
                                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30"
                            >
                                Claim Rewards & Continue
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
