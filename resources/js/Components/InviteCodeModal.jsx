import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Key, Copy, Check, RefreshCw, X, Shield, Users } from 'lucide-react';

export default function InviteCodeModal({ isOpen, onClose, server, onCodeRegenerated }) {
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [inviteCode, setInviteCode] = useState(server?.invite_code || 'REALM-MAIN01');

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = async () => {
        if (!server?.id) return;
        setRegenerating(true);
        try {
            const res = await axios.post(`/api/servers/${server.id}/invite-code/regenerate`);
            setInviteCode(res.data.invite_code);
            if (onCodeRegenerated) onCodeRegenerated(res.data.invite_code);
        } catch (err) {
            console.error('Failed to regenerate invitation code:', err);
        } finally {
            setRegenerating(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-amber-400" />
                            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                HR Invitation Code
                            </h3>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-amber-400" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white">
                            {server?.name || 'Company Server'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                            Share this private HR invitation code with workers to invite them to your company.
                        </p>
                    </div>

                    {/* Invite Code Box */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
                        <div>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">
                                HR INVITATION CODE
                            </span>
                            <span className="text-xl font-black text-amber-300 font-mono tracking-widest">
                                {inviteCode}
                            </span>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                    </div>

                    {/* CEO / Guild Master Regenerate Button */}
                    {server?.is_owner && (
                        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold">
                                CEO / Guild Master Control
                            </span>
                            <button
                                onClick={handleRegenerate}
                                disabled={regenerating}
                                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                                <span>Regenerate Code</span>
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
