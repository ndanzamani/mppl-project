import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VoiceMeetingRoom3D from '@/Components/3D/VoiceMeetingRoom3D';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Hash,
    Volume2,
    Beer,
    Plus,
    Send,
    Smile,
    Paperclip,
    Users,
    X,
    Sparkles,
    Shield,
    Hand,
    ScreenShare,
    Mic,
    Check
} from 'lucide-react';

const EMOJIS = ['⚔️', '🛡️', '🍺', '👑', '🔥', '✨', '🚀', '🎉', '👍', '❤️'];

export default function Channels({ initialChannels = [] }) {
    const [channels, setChannels] = useState(initialChannels);
    const [activeChannel, setActiveChannel] = useState(initialChannels[0] || null);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Voice & Presentation Queue state
    const [participants, setParticipants] = useState([]);
    const [handQueue, setHandQueue] = useState([]);
    const [activePresentation, setActivePresentation] = useState(null);

    // Channel Creation Modal
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [newChannelForm, setNewChannelForm] = useState({ name: '', type: 'text', topic: '' });
    const [saving, setSaving] = useState(false);

    // Load channel content when active channel changes
    useEffect(() => {
        if (!activeChannel) return;

        if (activeChannel.type === 'text') {
            fetchMessages(activeChannel.id);
        } else {
            fetchVoiceState(activeChannel.id);
        }
    }, [activeChannel?.id]);

    // Fetch chat messages
    const fetchMessages = async (channelId) => {
        try {
            const res = await axios.get(`/api/channels/${channelId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    // Fetch voice participants & queue
    const fetchVoiceState = async (channelId) => {
        try {
            const res = await axios.get('/api/channels');
            const ch = res.data.find((c) => c.id === channelId);
            if (ch) {
                setParticipants(ch.participants || []);
            }
        } catch (err) {
            console.error('Failed to fetch voice state:', err);
        }
    };

    // Post new chat message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChannel) return;

        const text = newMessage;
        setNewMessage('');
        setShowEmojiPicker(false);

        try {
            const res = await axios.post(`/api/channels/${activeChannel.id}/messages`, {
                content: text,
            });
            setMessages([res.data, ...messages]);
        } catch (err) {
            console.error('Failed to post message:', err);
        }
    };

    // Join Voice Channel
    const handleJoinVoice = async () => {
        if (!activeChannel) return;
        try {
            const res = await axios.post(`/api/channels/${activeChannel.id}/join`);
            await fetchVoiceState(activeChannel.id);
        } catch (err) {
            console.error('Failed to join voice:', err);
        }
    };

    // Leave Voice Channel
    const handleLeaveVoice = async () => {
        if (!activeChannel) return;
        try {
            await axios.post(`/api/channels/${activeChannel.id}/leave`);
            await fetchVoiceState(activeChannel.id);
        } catch (err) {
            console.error('Failed to leave voice:', err);
        }
    };

    // Raise Hand in presentation queue
    const handleRaiseHand = async () => {
        if (!activeChannel) return;
        try {
            const res = await axios.post(`/api/channels/${activeChannel.id}/presentation/raise-hand`);
            setHandQueue(res.data.queue || []);
        } catch (err) {
            console.error('Failed to raise hand:', err);
        }
    };

    // Create New Channel
    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post('/api/channels', newChannelForm);
            setIsCreatingChannel(false);
            setNewChannelForm({ name: '', type: 'text', topic: '' });

            const updatedRes = await axios.get('/api/channels');
            setChannels(updatedRes.data);
            setActiveChannel(res.data.channel);
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating channel');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Guild Channels & 3D Meeting Room" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Channel Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                            {activeChannel?.type === 'voice' ? (
                                <Volume2 className="w-5 h-5" />
                            ) : activeChannel?.type === 'tavern' ? (
                                <Beer className="w-5 h-5 text-amber-300" />
                            ) : (
                                <Hash className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                                #{activeChannel?.name || 'general-hall'}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 uppercase">
                                    {activeChannel?.type || 'text'}
                                </span>
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                {activeChannel?.settings?.topic || 'Discord-style chat, 3D voice meeting room, and presentation queue.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreatingChannel(true)}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create Channel
                    </button>
                </div>

                {/* 2-Column Split View: Channel Selector + Active Viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Left 1 Col: Channel Categories Sidebar */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-5">
                        {/* Text Channels Category */}
                        <div>
                            <div className="px-2 mb-2 text-[11px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Text Channels</span>
                                <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Chat</span>
                            </div>
                            <div className="space-y-1">
                                {channels.filter((c) => c.type === 'text').map((ch) => (
                                    <button
                                        key={ch.id}
                                        onClick={() => setActiveChannel(ch)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                            activeChannel?.id === ch.id
                                                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm'
                                                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-indigo-500" />
                                            <span>{ch.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Voice & Tavern Channels Category */}
                        <div>
                            <div className="px-2 mb-2 text-[11px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                <span>3D Voice & Taverns</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">3D Scene</span>
                            </div>
                            <div className="space-y-1">
                                {channels.filter((c) => c.type === 'voice' || c.type === 'tavern').map((ch) => (
                                    <button
                                        key={ch.id}
                                        onClick={() => {
                                            setActiveChannel(ch);
                                            handleJoinVoice();
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                            activeChannel?.id === ch.id
                                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm'
                                                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {ch.type === 'tavern' ? (
                                                <Beer className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <Volume2 className="w-4 h-4 text-emerald-500" />
                                            )}
                                            <span>{ch.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                                            {ch.active_participants_count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 3 Cols: Active Channel Content Area */}
                    <div className="lg:col-span-3">
                        {activeChannel?.type === 'text' ? (
                            /* Text Chat Stream */
                            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col h-[580px]">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-5 h-5 text-indigo-500" />
                                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                            #{activeChannel.name} Chat Stream
                                        </h3>
                                    </div>
                                    <span className="text-xs text-gray-400">{messages.length} messages</span>
                                </div>

                                {/* Chat Messages Container */}
                                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                                    {messages.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic text-center py-10">No messages in this channel yet.</p>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/60 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/60">
                                                <img
                                                    src={msg.user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user_id}`}
                                                    alt={msg.user_name}
                                                    className="w-9 h-9 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-800 shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{msg.user_name}</span>
                                                        <span className="text-[10px] text-gray-400">{msg.created_at || 'Just now'}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-700 dark:text-slate-300 mt-1 leading-relaxed">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="relative pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={`Message #${activeChannel.name}...`}
                                            className="w-full pl-4 pr-20 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />

                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-1 rounded-lg text-gray-400 hover:text-amber-500 transition-colors"
                                            >
                                                <Smile className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Emoji Picker Popup */}
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 right-0 p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl grid grid-cols-5 gap-1 z-30">
                                                {EMOJIS.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => setNewMessage(newMessage + ' ' + emoji)}
                                                        className="p-1.5 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1 shadow-md shadow-indigo-500/20"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* 3D Voice & Meeting Room View */
                            <VoiceMeetingRoom3D
                                channelName={activeChannel?.name || 'voice-tavern'}
                                isTavern={activeChannel?.type === 'tavern'}
                                participants={participants}
                                presentation={activePresentation}
                                onRaiseHand={handleRaiseHand}
                                onLeave={handleLeaveVoice}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Create Channel Modal */}
            <AnimatePresence>
                {isCreatingChannel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                                <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-indigo-500" />
                                    Create New Channel
                                </h3>
                                <button onClick={() => setIsCreatingChannel(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateChannel} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Channel Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newChannelForm.name}
                                        onChange={(e) => setNewChannelForm({ ...newChannelForm, name: e.target.value })}
                                        placeholder="e.g. strategy-room"
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Channel Type</label>
                                    <select
                                        value={newChannelForm.type}
                                        onChange={(e) => setNewChannelForm({ ...newChannelForm, type: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="text">Text Chat Channel (#)</option>
                                        <option value="voice">3D Voice Boardroom (🔊)</option>
                                        <option value="tavern">3D RPG Tavern Lounge (🍺)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Channel Topic / Description</label>
                                    <input
                                        type="text"
                                        value={newChannelForm.topic}
                                        onChange={(e) => setNewChannelForm({ ...newChannelForm, topic: e.target.value })}
                                        placeholder="e.g. Weekly party sync and bounty board"
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingChannel(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                                    >
                                        {saving ? 'Creating...' : 'Create Channel'}
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
