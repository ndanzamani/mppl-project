import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useUiMode } from '@/Components/UiModeContext';
import {
    Shield,
    Swords,
    Crown,
    Kanban,
    Users,
    Sparkles,
    Scroll,
    Volume2,
    Building2,
    LayoutDashboard,
    TrendingUp,
    CheckCircle2,
    Clock,
    Award,
    Database,
    Download
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const { t, isCorporate } = useUiMode();

    return (
        <AuthenticatedLayout>
            <Head title={isCorporate ? "Executive Dashboard - Workplace" : "Guild Hall - Realm Center"} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Hero Banner (RPG vs Corporate) */}
                <div className={`border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all ${
                    isCorporate
                        ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-indigo-500/30'
                        : 'bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-amber-500/30'
                }`}>
                    <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
                        isCorporate ? 'bg-indigo-500/10' : 'bg-amber-500/10'
                    }`} />

                    <div className="space-y-3 relative z-10">
                        <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${
                            isCorporate ? 'text-indigo-400' : 'text-amber-400'
                        }`}>
                            {isCorporate ? <Building2 className="w-4 h-4 text-indigo-400" /> : <Shield className="w-4 h-4 text-amber-400" />}
                            {t('dashboardDesc')}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">
                            Welcome, {user.name}!
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                            {isCorporate
                                ? 'Track company project milestones, review deliverable task backlogs, manage organizational structure, and view employee performance analytics.'
                                : 'Coordinate with party members, claim help request quests, review mission proposals, and level up your RPG adventurer rank.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href={route('board')}
                                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
                                    isCorporate
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30'
                                }`}
                            >
                                <Kanban className="w-4 h-4" />
                                <span>{t('projectsTitle')}</span>
                            </Link>

                            <Link
                                href={route('quests')}
                                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
                            >
                                {isCorporate ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Swords className="w-4 h-4 text-amber-400" />}
                                <span>{t('questsTitle')}</span>
                            </Link>

                            <a
                                href="/api/database/export"
                                download
                                className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
                            >
                                <Download className="w-4 h-4 text-emerald-400" />
                                <span>Export Database (.sql)</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { title: t('projectsTitle'), desc: isCorporate ? 'Review project proposals & roadmap' : 'Review council proposals', link: route('board'), icon: Kanban, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                        { title: t('questsTitle'), desc: isCorporate ? 'Manage internal task tickets & deliverables' : 'Post and claim help bounties', link: route('quests'), icon: isCorporate ? CheckCircle2 : Swords, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                        { title: t('voiceTaverns'), desc: isCorporate ? 'Live virtual conference space' : 'Live 3D wooden table chat', link: route('channels'), icon: Volume2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                        { title: t('profileTitle'), desc: isCorporate ? 'View performance KPIs and badges' : 'View RPG stats and badges', link: route('profile.show'), icon: isCorporate ? Award : Crown, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                    ].map((item, idx) => {
                        const IconComp = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.link}
                                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-4"
                            >
                                <div className={`p-3 rounded-2xl border w-fit ${item.color}`}>
                                    <IconComp className="w-6 h-6" />
                                </div>

                                <div>
                                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
