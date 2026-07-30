import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useUiMode } from '@/Components/UiModeContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Users,
    Crown,
    ShieldCheck,
    Code2,
    Terminal,
    Feather,
    Search,
    Filter,
    Calendar,
    Sparkles,
    Zap,
    ExternalLink,
    Building2,
    UserCheck
} from 'lucide-react';

const STATUS_CONFIG = {
    working: { label: 'Working', emoji: '💼', ring: 'ring-emerald-500 bg-emerald-500' },
    free: { label: 'Available', emoji: '☕', ring: 'ring-blue-500 bg-blue-500' },
    on_vacation: { label: 'On Vacation', emoji: '🌴', ring: 'ring-amber-500 bg-amber-500' },
    sick: { label: 'Sick Leave', emoji: '🤒', ring: 'ring-rose-500 bg-rose-500' },
    away: { label: 'Away', emoji: '🏃', ring: 'ring-orange-500 bg-orange-500' },
    do_not_disturb: { label: 'Do Not Disturb', emoji: '⛔', ring: 'ring-purple-500 bg-purple-500' },
};

export default function Team() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { t, isCorporate } = useUiMode();

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await axios.get('/api/users');
            setTeamMembers(res.data);
        } catch (err) {
            console.error('Failed to fetch team roster:', err);
        }
    };

    const filteredMembers = teamMembers.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.role_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout>
            <Head title={isCorporate ? "Employee Directory - Workplace" : "Party Members - GuildHall"} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className={`border-2 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCorporate
                        ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-indigo-500/30'
                        : 'bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/30'
                }`}>
                    <div className="space-y-1">
                        <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${
                            isCorporate ? 'text-indigo-400' : 'text-amber-400'
                        }`}>
                            {isCorporate ? <UserCheck className="w-4 h-4 text-indigo-400" /> : <Users className="w-4 h-4 text-amber-400" />}
                            {t('teamTitle')}
                        </span>
                        <h2 className="text-2xl font-black text-white">
                            {t('teamTitle')}
                        </h2>
                        <p className="text-xs text-slate-300">
                            {t('teamDesc')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search employees..."
                                className="pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none w-48 sm:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Team Roster Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredMembers.map((m) => {
                        const statusObj = STATUS_CONFIG[m.status] || STATUS_CONFIG.working;
                        return (
                            <Link
                                key={m.id}
                                href={route('profile.show', m.id)}
                                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group space-y-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={m.avatar}
                                            alt={m.name}
                                            className={`w-14 h-14 rounded-2xl object-cover border-2 bg-slate-800 shadow-md ${
                                                isCorporate ? 'border-indigo-500/40' : 'border-amber-500/40'
                                            }`}
                                        />
                                        <span
                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${statusObj.ring}`}
                                            title={statusObj.label}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-amber-400 transition-colors">
                                            {m.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span
                                                className="px-2 py-0.5 text-[10px] font-black rounded-full text-white shadow-sm"
                                                style={{ backgroundColor: m.role_color }}
                                            >
                                                {m.role_name}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">
                                                Lvl {m.level}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
                                    <div className="flex items-center justify-between">
                                        <span>Status</span>
                                        <span className="font-extrabold text-gray-800 dark:text-slate-200">
                                            {statusObj.emoji} {statusObj.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>{isCorporate ? 'KPI Score' : 'XP Points'}</span>
                                        <span className="font-extrabold text-amber-400">
                                            {m.xp} {isCorporate ? 'Pts' : 'XP'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
