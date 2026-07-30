import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/Components/ThemeProvider';
import { UiModeProvider, useUiMode } from '@/Components/UiModeContext';
import XpOrb from '@/Components/XpOrb';
import PageTransition from '@/Components/PageTransition';
import CursorFollower from '@/Components/CursorFollower';
import InviteCodeModal from '@/Components/InviteCodeModal';
import { isMuted, toggleMute, playPageWhoosh } from '@/Utils/sound';
import axios from 'axios';
import {
    Shield,
    Hash,
    Volume2,
    Swords,
    Kanban,
    User,
    LogOut,
    ChevronDown,
    Menu,
    X,
    Sparkles,
    Circle,
    Bell,
    Crown,
    Users,
    VolumeX,
    ScrollText,
    BookOpen,
    Key,
    DoorOpen,
    AlertCircle,
    Building2,
    Briefcase,
    LayoutDashboard,
    GitBranch,
    FileSpreadsheet,
    UserCheck,
    Video,
    Settings
} from 'lucide-react';

function LayoutInner({ currentUser, children }) {
    const { uiMode, t, isCorporate } = useUiMode();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [userStatus, setUserStatus] = useState(currentUser.status || 'online');
    const [soundMuted, setSoundMuted] = useState(() => isMuted());

    // Server State
    const [currentServer, setCurrentServer] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showResignModal, setShowResignModal] = useState(false);
    const [resigning, setResigning] = useState(false);

    const statusColors = {
        online: 'bg-emerald-500',
        busy: 'bg-rose-500',
        dungeon: 'bg-purple-500',
        offline: 'bg-gray-400'
    };

    useEffect(() => {
        fetchCurrentServer();
    }, []);

    const fetchCurrentServer = async () => {
        try {
            const res = await axios.get('/api/servers/current');
            if (res.data.has_server) {
                setCurrentServer(res.data.server);
            } else if (route().current() !== 'servers.onboarding') {
                router.visit('/dashboard/join-realm');
            }
        } catch (err) {
            console.error('Failed to fetch active company server:', err);
        }
    };

    const handleResign = async () => {
        setResigning(true);
        try {
            await axios.post('/api/servers/resign');
            setShowResignModal(false);
            router.visit('/dashboard/join-realm');
        } catch (err) {
            console.error('Failed to resign from company:', err);
        } finally {
            setResigning(false);
        }
    };

    const handleSoundToggle = () => {
        const nextMuted = toggleMute();
        setSoundMuted(nextMuted);
    };

    const handleNavClick = () => {
        playPageWhoosh();
    };

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative font-sans">
            <CursorFollower />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-4 space-y-6">
                    {/* Company Logo & Header */}
                    <div className="flex items-center justify-between">
                        <Link href={route('dashboard')} onClick={handleNavClick} className="flex items-center gap-3 group">
                            <div className={`w-10 h-10 rounded-xl p-0.5 shadow-lg group-hover:scale-105 transition-transform border ${
                                isCorporate
                                    ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-400 border-indigo-300'
                                    : 'bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 border-amber-300'
                            }`}>
                                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                                    {currentServer?.icon ? (
                                        <img src={currentServer.icon} alt={currentServer.name} className="w-full h-full object-cover" />
                                    ) : isCorporate ? (
                                        <Building2 className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                        <Shield className="w-5 h-5 text-amber-400" />
                                    )}
                                </div>
                            </div>
                            <div className="max-w-[130px]">
                                <h1 className="font-black text-xs text-gray-900 dark:text-white leading-tight truncate">
                                    {currentServer?.name || t('appName')}
                                </h1>
                                <p className={`text-[10px] font-extrabold uppercase truncate ${
                                    isCorporate ? 'text-indigo-400' : 'text-amber-500'
                                }`}>
                                    {currentServer?.is_owner ? t('adminRole') : 'Company Member'}
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Company HR Invite Code Button */}
                    {currentServer && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all group ${
                                isCorporate
                                    ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>HR Invite Code</span>
                            </div>
                            <span className="font-mono text-[11px] font-black bg-slate-950 px-2 py-0.5 rounded border border-gray-800">
                                {currentServer.invite_code}
                            </span>
                        </button>
                    )}

                    {/* Navigation Links */}
                    <div className="space-y-5">
                        {/* Main Operations */}
                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                {isCorporate ? 'Main Operations' : 'Guild Center'}
                            </div>
                            <Link
                                href={route('dashboard')}
                                onClick={handleNavClick}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                    route().current('dashboard')
                                        ? isCorporate
                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                {isCorporate ? <LayoutDashboard className="w-4 h-4 text-indigo-500" /> : <Shield className="w-4 h-4 text-amber-500" />}
                                <span>{t('dashboardTitle')}</span>
                            </Link>
                        </div>

                        {/* Projects & Tasks */}
                        <div>
                            <div className="px-3 mb-1.5 flex items-center justify-between text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                <span>Workplace & Tasks</span>
                                <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.5 rounded font-extrabold">Work</span>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href={route('board')}
                                    onClick={handleNavClick}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                        route().current('board')
                                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50 shadow-sm'
                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Kanban className="w-4 h-4 text-purple-500" />
                                    <span>{t('projectsTitle')}</span>
                                </Link>
                                <Link
                                    href={route('quests')}
                                    onClick={handleNavClick}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                        route().current('quests')
                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 shadow-sm'
                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    {isCorporate ? <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> : <Swords className="w-4 h-4 text-amber-500" />}
                                    <span>{t('questsTitle')}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Communication */}
                        <div>
                            <div className="px-3 mb-1.5 flex items-center justify-between text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                <span>Communication</span>
                                <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded font-extrabold">Live</span>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href={route('channels')}
                                    onClick={handleNavClick}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-all"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Hash className="w-4 h-4 text-indigo-500" />
                                        <span>#general-hall</span>
                                    </div>
                                </Link>
                                <Link
                                    href={route('channels')}
                                    onClick={handleNavClick}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-all"
                                >
                                    <div className="flex items-center gap-2.5">
                                        {isCorporate ? <Video className="w-4 h-4 text-emerald-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
                                        <span>voice-tavern</span>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </Link>
                            </div>
                        </div>

                        {/* Staff & Organization */}
                        <div>
                            <div className="px-3 mb-1.5 flex items-center justify-between text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                <span>Staff & Org</span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-extrabold">Roster</span>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href={route('hierarchy')}
                                    onClick={handleNavClick}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                        route().current('hierarchy')
                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 shadow-sm'
                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    {isCorporate ? <GitBranch className="w-4 h-4 text-indigo-500" /> : <Crown className="w-4 h-4 text-amber-500" />}
                                    <span>{t('hierarchyTitle')}</span>
                                </Link>
                                <Link
                                    href={route('team')}
                                    onClick={handleNavClick}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                        route().current('team')
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm'
                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Users className="w-4 h-4 text-emerald-500" />
                                    <span>{t('teamTitle')}</span>
                                </Link>
                                <Link
                                    href={route('settings')}
                                    onClick={handleNavClick}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                        route().current('settings')
                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm'
                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Settings className="w-4 h-4 text-indigo-500" />
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Bottom - Resign Button */}
                {currentServer && (
                    <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 space-y-2">
                        <button
                            onClick={() => setShowResignModal(true)}
                            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
                        >
                            <DoorOpen className="w-4 h-4" />
                            <span>{t('resignBtn')}</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Layout Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TopBar Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Hash className="w-5 h-5 text-gray-400 dark:text-slate-500 hidden sm:inline" />
                            <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                                general-hall
                            </span>
                        </div>
                    </div>

                    {/* TopBar Actions: XP Orb + Mute Toggle + Profile */}
                    <div className="flex items-center gap-2.5">
                        <XpOrb user={currentUser} />

                        <button
                            onClick={handleSoundToggle}
                            className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Sound Effects"
                            title={soundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                        >
                            {soundMuted ? (
                                <VolumeX className="w-5 h-5 text-rose-400" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-emerald-400" />
                            )}
                        </button>

                        <Link
                            href={route('settings')}
                            className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            title="System & Theme Settings"
                        >
                            <Settings className="w-5 h-5 text-indigo-400" />
                        </Link>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="relative">
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 bg-slate-800 shadow-sm"
                                    />
                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${statusColors[userStatus]}`} />
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-xs font-bold leading-tight text-gray-800 dark:text-slate-200">
                                        {currentUser.name}
                                    </div>
                                    <div className="text-[10px] text-amber-400 font-extrabold capitalize">
                                        {userStatus} {isCorporate ? 'Status' : 'Aura'}
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                            </button>

                            <AnimatePresence>
                                {userDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 space-y-1"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                                            <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                {currentUser.name}
                                            </div>
                                            <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                                {currentUser.email}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-slate-800 pt-1">
                                            <Link
                                                href={route('profile.show')}
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-2"
                                            >
                                                <BookOpen className="w-4 h-4 text-amber-500" />
                                                {t('profileTitle')}
                                            </Link>
                                            <Link
                                                href={route('settings')}
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-2"
                                            >
                                                <Settings className="w-4 h-4 text-indigo-400" />
                                                Settings & Themes
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4 text-rose-500" />
                                                Sign Out
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Content Body */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    <PageTransition key={uiMode}>
                        {children}
                    </PageTransition>
                </main>
            </div>

            {/* HR Invite Code Modal */}
            <InviteCodeModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                server={currentServer}
                onCodeRegenerated={(newCode) => {
                    if (currentServer) setCurrentServer({ ...currentServer, invite_code: newCode });
                }}
            />

            {/* Resign Confirmation Modal */}
            <AnimatePresence>
                {showResignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center"
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                                <DoorOpen className="w-8 h-8 text-rose-400" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white">
                                    {isCorporate ? 'Leave Organization?' : `Resign from ${currentServer?.name || 'Company'}?`}
                                </h3>
                                <p className="text-xs text-rose-200/80">
                                    Are you sure you want to leave this organization? You will be placed into the free state where you can join another server via an HR invitation code or create a new company.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => setShowResignModal(false)}
                                    className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResign}
                                    disabled={resigning}
                                    className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30"
                                >
                                    {resigning ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    const { auth } = usePage().props;
    const currentUser = user || auth?.user || {
        id: 1,
        name: 'Guild Master User',
        email: 'admin@guildhall.io',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuildMaster',
        status: 'online',
        xp: 3500,
        level: 10,
        theme: 'dark',
        ui_mode: 'rpg',
        server_id: 1,
    };

    return (
        <UiModeProvider initialMode={currentUser.ui_mode || 'rpg'} userId={currentUser.id}>
            <ThemeProvider initialUserTheme={currentUser.theme} userId={currentUser.id}>
                <LayoutInner currentUser={currentUser} header={header}>
                    {children}
                </LayoutInner>
            </ThemeProvider>
        </UiModeProvider>
    );
}
