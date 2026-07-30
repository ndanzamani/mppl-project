import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useUiMode } from '@/Components/UiModeContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { playQuestComplete } from '@/Utils/sound';
import {
    Kanban,
    Plus,
    Search,
    Clock,
    User,
    CheckCircle2,
    X,
    ExternalLink,
    MessageSquare,
    Shield,
    Sparkles,
    Briefcase,
    FileCheck,
    Send,
    ThumbsUp,
    ThumbsDown,
    Paperclip,
    FileText,
    Image as ImageIcon,
    Download,
    Eye,
    Timer,
    Flame,
    XCircle,
    Upload
} from 'lucide-react';

export default function ProjectsBoard() {
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};
    const { t, isCorporate } = useUiMode();

    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Active Selected Project Modal (Clickable Card)
    const [selectedProject, setSelectedProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitTargetProject, setSubmitTargetProject] = useState(null);
    const [showCeoApprovalModal, setShowCeoApprovalModal] = useState(false);
    const [ceoTargetProject, setCeoTargetProject] = useState(null);
    const [approvalForm, setApprovalForm] = useState({
        approval_mode: 'manual',
        timer_hours: 24,
    });

    const [actionLoading, setActionLoading] = useState(false);

    // Create Project Form
    const [form, setForm] = useState({
        name: '',
        description: '',
        assigned_to: '',
        deadline: '',
        live_url: '',
    });

    // Work Submission Form
    const [submitForm, setSubmitForm] = useState({
        submission_notes: '',
        live_url: '',
    });

    // 5 Columns (Restored Rejected / Declined)
    const columns = [
        { id: 'backlog', title: isCorporate ? 'Backlog & Assigned' : 'Mission Backlog', color: 'border-slate-700 bg-slate-900/40 text-slate-300' },
        { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/40 bg-blue-950/20 text-blue-400' },
        { id: 'in_review', title: isCorporate ? 'Executive Review' : 'Awaiting Council', color: 'border-amber-500/40 bg-amber-950/20 text-amber-400' },
        { id: 'approved', title: isCorporate ? 'Approved & Completed' : 'Sealed with Honor', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' },
        { id: 'rejected', title: isCorporate ? 'Declined / Rejected' : 'Dismissed', color: 'border-rose-500/40 bg-rose-950/20 text-rose-400' },
    ];

    useEffect(() => {
        fetchProjects();
        fetchTeam();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            const res = await axios.get('/api/users');
            setTeamMembers(res.data);
        } catch (err) {
            console.error('Failed to fetch team members:', err);
        }
    };

    // Open Clickable Project Detail Modal
    const openProjectDetails = async (project) => {
        setSelectedProject(project);
        try {
            const res = await axios.get(`/api/projects/${project.id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };

    // Vote on Project Proposal
    const handleVote = async (projectId, type) => {
        try {
            const res = await axios.post(`/api/projects/${projectId}/vote`, { type });
            const updatedProjects = projects.map(p => p.id === projectId ? {
                ...p,
                votes_for: res.data.votes_for,
                votes_against: res.data.votes_against,
                total_votes: res.data.votes_for + res.data.votes_against,
            } : p);

            setProjects(updatedProjects);
            if (selectedProject?.id === projectId) {
                setSelectedProject({
                    ...selectedProject,
                    votes_for: res.data.votes_for,
                    votes_against: res.data.votes_against,
                    total_votes: res.data.votes_for + res.data.votes_against,
                });
            }
        } catch (err) {
            console.error('Failed to record vote:', err);
        }
    };

    // File Upload Handler for Project Attachments (PDF, Images, ZIP)
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedProject) return;

        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`/api/projects/${selectedProject.id}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newAttachment = res.data.attachment;
            const updatedAttachments = [...(selectedProject.attachments || []), newAttachment];

            setSelectedProject({ ...selectedProject, attachments: updatedAttachments });
            setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, attachments: updatedAttachments } : p));
        } catch (err) {
            alert(err.response?.data?.message || 'Error uploading attachment.');
        } finally {
            setUploadingFile(false);
        }
    };

    // CEO 3-Option Approval Action Handler
    const handleCeoDecision = async (decision) => {
        if (!ceoTargetProject) return;
        setActionLoading(true);
        try {
            const res = await axios.post(`/api/projects/${ceoTargetProject.id}/verify`, { decision });
            setProjects(projects.map(p => p.id === ceoTargetProject.id ? res.data.project : p));
            if (selectedProject?.id === ceoTargetProject.id) setSelectedProject(res.data.project);
            setShowCeoApprovalModal(false);
            if (decision === 'approved') playQuestComplete();
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating decision');
        } finally {
            setActionLoading(false);
        }
    };

    // CEO Timed / Vote Approval Mode Config
    const handleSetApprovalMode = async (e) => {
        e.preventDefault();
        if (!ceoTargetProject) return;
        setActionLoading(true);
        try {
            const res = await axios.post(`/api/projects/${ceoTargetProject.id}/approval-mode`, approvalForm);
            setProjects(projects.map(p => p.id === ceoTargetProject.id ? res.data.project : p));
            if (selectedProject?.id === ceoTargetProject.id) setSelectedProject(res.data.project);
            setShowCeoApprovalModal(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error setting approval mode');
        } finally {
            setActionLoading(false);
        }
    };

    // Worker Submit Deliverables
    const handleSubmitWork = async (e) => {
        e.preventDefault();
        if (!submitTargetProject) return;
        setActionLoading(true);
        try {
            const res = await axios.post(`/api/projects/${submitTargetProject.id}/submit-work`, submitForm);
            setProjects(projects.map(p => p.id === submitTargetProject.id ? res.data.project : p));
            if (selectedProject?.id === submitTargetProject.id) setSelectedProject(res.data.project);
            setShowSubmitModal(false);
            setSubmitForm({ submission_notes: '', live_url: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting work');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const newStatus = destination.droppableId;
        const projectId = parseInt(draggableId);

        setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));

        try {
            await axios.patch(`/api/projects/${projectId}/status`, { status: newStatus });
            if (newStatus === 'approved') playQuestComplete();
        } catch (err) {
            console.error('Failed to update status:', err);
            fetchProjects();
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await axios.post('/api/projects', form);
            setProjects([res.data.project, ...projects]);
            setShowCreateModal(false);
            setForm({ name: '', description: '', assigned_to: '', deadline: '', live_url: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Only CEOs / PMs (Rank 60+) can assign projects.');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedProject) return;

        try {
            const res = await axios.post(`/api/projects/${selectedProject.id}/comments`, { content: newComment });
            setComments([...comments, res.data.comment]);
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment:', err);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title={isCorporate ? "Project Roadmap & Kanban - Workplace" : "Missions Board - GuildHall"} />

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
                            {isCorporate ? <Briefcase className="w-4 h-4 text-indigo-400" /> : <Kanban className="w-4 h-4 text-amber-400" />}
                            {t('projectsTitle')}
                        </span>
                        <h2 className="text-2xl font-black text-white">
                            {t('projectsTitle')}
                        </h2>
                        <p className="text-xs text-slate-300">
                            {isCorporate
                                ? 'Official company assignments created by Executive Management & CEOs for assigned developers.'
                                : 'Official council mission assignments created by Guild Masters & Quest Givers for adventurers.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter assignments..."
                                className="pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none w-48 sm:w-64"
                            />
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl transition-all hover:scale-105 ${
                                isCorporate
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/30'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            <span>{isCorporate ? 'Assign New Project (CEO/PM)' : 'Assign New Mission'}</span>
                        </button>
                    </div>
                </div>

                {/* 5-Column Kanban Board */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
                        {columns.map((col) => {
                            const colProjects = filteredProjects.filter(p => p.status === col.id);
                            return (
                                <div key={col.id} className="space-y-3">
                                    <div className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-between shadow-sm ${col.color}`}>
                                        <span className="uppercase tracking-wider">{col.title}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px]">
                                            {colProjects.length}
                                        </span>
                                    </div>

                                    <Droppable droppableId={col.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`min-h-[550px] p-2.5 rounded-2xl border transition-colors space-y-3.5 ${
                                                    snapshot.isDraggingOver
                                                        ? 'bg-indigo-500/5 border-indigo-500/40'
                                                        : 'bg-slate-900/40 border-slate-800/80'
                                                }`}
                                            >
                                                {colProjects.map((p, index) => (
                                                    <Draggable key={p.id} draggableId={String(p.id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => openProjectDetails(p)}
                                                                className={`p-4 rounded-2xl bg-slate-900 border transition-all cursor-pointer hover:-translate-y-0.5 space-y-3 shadow-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'ring-2 ring-indigo-500 border-indigo-500 scale-105 z-50'
                                                                        : 'border-slate-800 hover:border-indigo-500/40'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <h4 className="font-extrabold text-sm text-white leading-tight hover:text-indigo-400 transition-colors">
                                                                        {p.name}
                                                                    </h4>
                                                                    <div className="flex items-center gap-1">
                                                                        {p.attachments && p.attachments.length > 0 && (
                                                                            <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                                                                        )}
                                                                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                                                    </div>
                                                                </div>

                                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                                    {p.description}
                                                                </p>

                                                                {/* Assignee & Votes */}
                                                                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                                                                    <div className="flex items-center justify-between text-slate-400">
                                                                        <span className="flex items-center gap-1 font-bold">
                                                                            <User className="w-3.5 h-3.5 text-indigo-400" />
                                                                            <span>{p.assigned_name || 'Unassigned'}</span>
                                                                        </span>

                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-emerald-400 font-bold">👍 {p.votes_for || 0}</span>
                                                                            <span className="text-rose-400 font-bold">👎 {p.votes_against || 0}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Action Triggers */}
                                                                {col.id === 'in_progress' && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSubmitTargetProject(p);
                                                                            setShowSubmitModal(true);
                                                                        }}
                                                                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
                                                                    >
                                                                        <Send className="w-3.5 h-3.5" />
                                                                        <span>Submit Deliverables</span>
                                                                    </button>
                                                                )}

                                                                {col.id === 'in_review' && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCeoTargetProject(p);
                                                                            setShowCeoApprovalModal(true);
                                                                        }}
                                                                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                                                                    >
                                                                        <FileCheck className="w-4 h-4 fill-slate-950" />
                                                                        <span>CEO Approval Options</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>
            </div>

            {/* Clickable Project Detail Modal (Voting, Comments, Attachment Uploader, Inline PDF/Image Reader) */}
            <AnimatePresence>
                {selectedProject && (
                    <div
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto cursor-default"
                        >
                            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase">
                                        Status: {selectedProject.status}
                                    </span>
                                    <h2 className="text-xl font-black text-white">
                                        {selectedProject.name}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Assigned To: <strong className="text-indigo-400">{selectedProject.assigned_name}</strong> | Created By: <strong className="text-slate-300">{selectedProject.submitter_name}</strong>
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Description & Submission Notes */}
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-slate-400">Description</h4>
                                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mt-1">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {selectedProject.submission_notes && (
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-amber-400">Submission Deliverable Notes</h4>
                                        <p className="text-xs text-amber-200 leading-relaxed bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/30 mt-1">
                                            {selectedProject.submission_notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Voting & Rating Section */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="text-xs font-bold text-slate-300">Community & Reviewer Feedback:</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleVote(selectedProject.id, 'up')}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>Upvote ({selectedProject.votes_for || 0})</span>
                                    </button>

                                    <button
                                        onClick={() => handleVote(selectedProject.id, 'down')}
                                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                        <span>Downvote ({selectedProject.votes_against || 0})</span>
                                    </button>
                                </div>
                            </div>

                            {/* File Attachment Section & Inline Viewer */}
                            <div className="space-y-3 border-t border-slate-800 pt-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
                                        <Paperclip className="w-4 h-4 text-indigo-400" />
                                        File Attachments & Review Assets
                                    </h4>

                                    <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>{uploadingFile ? 'Uploading...' : 'Upload File'}</span>
                                        <input type="file" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>

                                {/* Attachments List */}
                                <div className="space-y-3">
                                    {(selectedProject.attachments || []).map((att) => {
                                        const isPdf = att.file_type?.includes('pdf') || att.file_name?.endsWith('.pdf');
                                        const isImg = att.file_type?.includes('image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(att.file_name);

                                        return (
                                            <div key={att.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {isPdf ? <FileText className="w-5 h-5 text-rose-400" /> : isImg ? <ImageIcon className="w-5 h-5 text-emerald-400" /> : <Paperclip className="w-5 h-5 text-amber-400" />}
                                                        <div>
                                                            <div className="font-extrabold text-xs text-white">{att.file_name}</div>
                                                            <div className="text-[10px] text-slate-400">Uploaded by {att.uploaded_by}</div>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={att.file_path}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Download</span>
                                                    </a>
                                                </div>

                                                {/* On-the-spot Inline PDF Previewer */}
                                                {isPdf && (
                                                    <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-800">
                                                        <iframe src={att.file_path} className="w-full h-full" title={att.file_name} />
                                                    </div>
                                                )}

                                                {/* On-the-spot Inline Image Viewer */}
                                                {isImg && (
                                                    <div className="max-h-64 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center bg-black/40">
                                                        <img src={att.file_path} alt={att.file_name} className="max-h-64 object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comments & Discussion */}
                            <div className="space-y-3 border-t border-slate-800 pt-4">
                                <h4 className="text-xs font-black uppercase text-slate-300">Comments & Review Discussion</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {comments.map((c) => (
                                        <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-indigo-400">{c.user?.name || 'User'}</span>
                                                <span className="text-[10px] text-slate-500">{c.created_at}</span>
                                            </div>
                                            <p className="text-slate-300">{c.content}</p>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a review comment..."
                                        className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <button type="submit" className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black">
                                        Post
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CEO 3-Option Approval Modal */}
            <AnimatePresence>
                {showCeoApprovalModal && ceoTargetProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-base font-black text-white flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-amber-400" />
                                    CEO Approval Options
                                </h3>
                                <button onClick={() => setShowCeoApprovalModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Option 1: Instantly Accept */}
                                <button
                                    onClick={() => handleCeoDecision('approved')}
                                    className="w-full p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs text-left flex items-center justify-between group transition-all"
                                >
                                    <div>
                                        <div className="font-black text-sm">1. Instantly Accept</div>
                                        <div className="text-[11px] text-emerald-300/80">Immediately approve and mark project as sealed with honor.</div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                                </button>

                                {/* Option 1b: Instantly Reject */}
                                <button
                                    onClick={() => handleCeoDecision('rejected')}
                                    className="w-full p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs text-left flex items-center justify-between group transition-all"
                                >
                                    <div>
                                        <div className="font-black text-sm">Decline / Reject</div>
                                        <div className="text-[11px] text-rose-300/80">Reject submission and move card to Declined column.</div>
                                    </div>
                                    <XCircle className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                                </button>

                                {/* Config Form for Timed & Vote Based */}
                                <form onSubmit={handleSetApprovalMode} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                                    <div className="font-black text-slate-200">2 & 3. Automated Approval Config</div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Approval Mode</label>
                                        <select
                                            value={approvalForm.approval_mode}
                                            onChange={(e) => setApprovalForm({ ...approvalForm, approval_mode: e.target.value })}
                                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="timer_accept">2. Auto-Accept after Timer</option>
                                            <option value="vote_based">3. Auto-Decide based on Net Votes</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-1">Timer Hours</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="168"
                                            value={approvalForm.timer_hours}
                                            onChange={(e) => setApprovalForm({ ...approvalForm, timer_hours: e.target.value })}
                                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase"
                                    >
                                        Set Auto Approval Timer
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CEO Create & Assign Project Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-base font-black text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-400" />
                                    {isCorporate ? 'Assign New Project (Executive)' : 'Assign Official Mission'}
                                </h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Upgrade Database Indexes & Server Infrastructure"
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Assign to Employee</label>
                                    <select
                                        value={form.assigned_to}
                                        onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="">-- Select Worker --</option>
                                        {teamMembers.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} ({m.role_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Scope & Requirements</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Detail project specifications and expectations..."
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="px-5 py-2 text-xs font-black rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30"
                                    >
                                        Create & Assign
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Worker Submit Deliverables Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-base font-black text-white flex items-center gap-2">
                                    <Send className="w-5 h-5 text-blue-400" />
                                    Submit Work Deliverables
                                </h3>
                                <button onClick={() => setShowSubmitModal(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitWork} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Submission Notes & Completion Details</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={submitForm.submission_notes}
                                        onChange={(e) => setSubmitForm({ ...submitForm, submission_notes: e.target.value })}
                                        placeholder="Describe what was accomplished and completed..."
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-300 block mb-1">Live URL / Demo Link (Optional)</label>
                                    <input
                                        type="url"
                                        value={submitForm.live_url}
                                        onChange={(e) => setSubmitForm({ ...submitForm, live_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(false)}
                                        className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="px-5 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30"
                                    >
                                        Submit for Verification
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
