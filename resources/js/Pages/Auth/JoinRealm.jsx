import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FloatingBackground3D from '@/Components/3D/FloatingBackground3D';
import { Key, Plus, Shield, Sparkles, Building, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JoinRealm() {
    const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'

    // Form states
    const [inviteCode, setInviteCode] = useState('');
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleJoinServer = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/api/servers/join', { invite_code: inviteCode });
            setSuccessMsg(res.data.message);
            setTimeout(() => {
                router.visit('/dashboard');
            }, 1000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to join company server. Please check the invitation code.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateServer = async (e) => {
        e.preventDefault();
        if (!createForm.name.trim()) return;

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/api/servers', createForm);
            setSuccessMsg(res.data.message);
            setTimeout(() => {
                router.visit('/dashboard');
            }, 1000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to create company server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
            {/* Background 3D Floating Shapes */}
            <FloatingBackground3D />

            <Head title="Choose Your Company Realm - GuildHall" />

            <div className="max-w-xl w-full relative z-10 space-y-6">
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 shadow-2xl shadow-amber-500/40 border-2 border-amber-300">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-amber-400 tracking-wider">
                        GUILDHALL WORKSPACE SANCTUM
                    </h1>
                    <p className="text-xs text-amber-200/70 font-semibold max-w-md mx-auto">
                        Every worker account belongs to 1 company server. Enter an HR invitation code to join a company, or found a new company server as CEO.
                    </p>
                </div>

                {/* Status Messages */}
                {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Tab Switcher Buttons */}
                <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <button
                        onClick={() => { setActiveTab('join'); setErrorMsg(''); }}
                        className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'join'
                                ? 'bg-amber-500 text-slate-950 shadow-lg'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Key className="w-4 h-4" />
                        <span>Join via HR Code</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('create'); setErrorMsg(''); }}
                        className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'create'
                                ? 'bg-amber-500 text-slate-950 shadow-lg'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Found New Company</span>
                    </button>
                </div>

                {/* Active Tab Card */}
                <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    {activeTab === 'join' ? (
                        <form onSubmit={handleJoinServer} className="space-y-5">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                                    Option A: HR Invitation Code
                                </span>
                                <h2 className="text-xl font-black text-white">
                                    Join an Existing Company Server
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Enter the 8-character invitation code provided by your HR or Guild Master.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                                    HR Invitation Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. REALM-MAIN01"
                                    className="w-full px-4 py-3 text-sm font-mono font-bold tracking-widest uppercase rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Key className="w-4 h-4" />
                                <span>{loading ? 'Joining Company...' : 'Join Company Server'}</span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateServer} className="space-y-5">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                                    Option B: Become CEO / Guild Master
                                </span>
                                <h2 className="text-xl font-black text-white">
                                    Found a New Company Server
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Create a private workspace server and receive a unique HR invitation code to invite your team.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                                    Company / Server Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    placeholder="e.g. Valhalla Engineering Realm"
                                    className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-950 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                                    Company Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    placeholder="Describe your company mission and workspace goals..."
                                    className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-950 border border-amber-500/30 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Sparkles className="w-4 h-4 text-slate-950" />
                                <span>{loading ? 'Founding Company...' : 'Found New Company Server'}</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
