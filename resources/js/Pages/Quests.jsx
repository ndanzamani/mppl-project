import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useUiMode } from '@/Components/UiModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import {
    Swords,
    Plus,
    Search,
    Filter,
    Zap,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    X,
    Sparkles,
    Shield,
    Trash2,
    Calendar,
    FileText,
    CheckSquare
} from 'lucide-react';

export default function Quests() {
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};
    const { t, isCorporate } = useUiMode();

    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('open');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [postForm, setPostForm] = useState({
        title: '',
        description: '',
        expires_in_days: 7,
        estimated_duration: '1-2 hours',
    });

    useEffect(() => {
        fetchQuests();
    }, []);

    const fetchQuests = async () => {
        try {
            const res = await axios.get('/api/quests');
            setQuests(res.data);
        } catch (err) {
            console.error('Failed to fetch quests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimQuest = async (questId) => {
        setActionLoading(true);
        try {
            const res = await axios.post(`/api/quests/${questId}/claim`);
            setQuests(quests.map(q => q.id === questId ? res.data.quest : q));
            if (selectedQuest?.id === questId) setSelectedQuest(res.data.quest);
        } catch (err) {
            alert(err.response?.data?.message || 'Error claiming task');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteQuest = async (questId) => {
        setActionLoading(true);
        try {
            const res = await axios.post(`/api/quests/${questId}/complete`);
            setQuests(quests.map(q => q.id === questId ? res.data.quest : q));
            if (selectedQuest?.id === questId) setSelectedQuest(res.data.quest);

            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Error completing task');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateQuest = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await axios.post('/api/quests', postForm);
            setQuests([res.data.quest, ...quests]);
            setShowPostModal(false);
            setPostForm({ title: '', description: '', expires_in_days: 7, estimated_duration: '1-2 hours' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating task');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteQuest = async (questId) => {
        if (!confirm('Are you sure you want to cancel this item?')) return;
        try {
            await axios.delete(`/api/quests/${questId}`);
            setQuests(quests.filter(q => q.id !== questId));
            if (selectedQuest?.id === questId) setSelectedQuest(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting item');
        }
    };

    // Filter & Sort
    const filteredQuests = quests
        .filter(q => {
            if (statusFilter === 'mine') return q.posted_by === currentUser.id || q.accepted_by === currentUser.id;
            if (statusFilter === 'all') return true;
            return q.status === statusFilter;
        })
        .filter(q =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <AuthenticatedLayout>
            <Head title={isCorporate ? "Task & Help Desk - Workplace" : "Quest Log - GuildHall"} />

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
                            {isCorporate ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Swords className="w-4 h-4 text-amber-400" />}
                            {t('questsTitle')}
                        </span>
                        <h2 className="text-2xl font-black text-white">
                            {t('questsTitle')}
                        </h2>
                        <p className="text-xs text-slate-300">
                            {t('questsDesc')}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowPostModal(true)}
                        className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl transition-all hover:scale-105 shrink-0 ${
                            isCorporate
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/30'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isCorporate ? 'Create Task Ticket' : 'Post New Quest (+20 XP)'}</span>
                    </button>
                </div>

                {/* Filter Controls Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        {['open', 'claimed', 'completed', 'mine', 'all'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                                    statusFilter === st
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Task Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredQuests.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full border ${
                                        q.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                        q.status === 'claimed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                        'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                    }`}>
                                        {q.status}
                                    </span>

                                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                                        +{q.reward_xp} {isCorporate ? 'KPI Points' : 'XP'}
                                    </span>
                                </div>

                                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug">
                                    {q.title}
                                </h3>

                                <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                    {q.description}
                                </p>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                                <div className="flex items-center justify-between text-[11px] text-gray-400">
                                    <span className="flex items-center gap-1 font-bold">
                                        <User className="w-3.5 h-3.5 text-amber-500" />
                                        {q.poster_name || 'Guild Member'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {q.estimated_duration}
                                    </span>
                                </div>

                                {/* Actions */}
                                {q.status === 'open' && (
                                    <button
                                        onClick={() => handleClaimQuest(q.id)}
                                        disabled={actionLoading}
                                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                                    >
                                        {isCorporate ? 'Accept Task Ticket' : 'Claim Quest'}
                                    </button>
                                )}

                                {q.status === 'claimed' && q.accepted_by === currentUser.id && (
                                    <button
                                        onClick={() => handleCompleteQuest(q.id)}
                                        disabled={actionLoading}
                                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Mark Completed</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Task Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-base font-black text-white flex items-center gap-2">
                                    <Swords className="w-5 h-5 text-amber-400" />
                                    {isCorporate ? 'Create Task Ticket' : 'Post New Quest'}
                                </h3>
                                <button onClick={() => setShowPostModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateQuest} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={postForm.title}
                                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                        placeholder="e.g. Audit Database Performance Indexes"
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Description & Requirements</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={postForm.description}
                                        onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                                        placeholder="Describe deliverable expectations..."
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowPostModal(false)}
                                        className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="px-5 py-2 text-xs font-black rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                                    >
                                        Create Item
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
