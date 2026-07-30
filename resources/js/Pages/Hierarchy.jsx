import React, { useState, useCallback, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ReactFlow,
    Controls,
    Background,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Crown,
    ShieldCheck,
    Code2,
    Terminal,
    Feather,
    Shield,
    Users,
    Sliders,
    Plus,
    X,
    Check,
    Sparkles,
    Trash2,
    UserPlus,
    Edit3,
    GitBranch
} from 'lucide-react';

const ICON_MAP = {
    Crown: Crown,
    ShieldCheck: ShieldCheck,
    Code2: Code2,
    Terminal: Terminal,
    Feather: Feather,
    Shield: Shield,
};

const ALL_AVAILABLE_PERMISSIONS = [
    { name: 'create_channels', label: 'Create Channels', desc: 'Allows creating new text & voice channels' },
    { name: 'delete_channels', label: 'Delete Channels', desc: 'Allows deleting existing channels' },
    { name: 'kick_members', label: 'Kick Members', desc: 'Allows kicking lower hierarchy members' },
    { name: 'promote_members', label: 'Promote Members', desc: 'Allows reassigning roles and promoting users' },
    { name: 'manage_quests', label: 'Manage Quests', desc: 'Allows creating, editing, and posting RPG quests' },
    { name: 'approve_projects', label: 'Approve Projects', desc: 'Allows approving Trello project proposals' },
];

// Custom React Flow Role Node Component with Generous Spacing
function RoleNode({ data }) {
    const IconComp = ICON_MAP[data.icon] || Shield;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 shadow-2xl cursor-pointer transition-all duration-200 ${
                data.isSelected
                    ? 'ring-4 ring-indigo-500/40 border-indigo-500'
                    : 'border-gray-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
            }`}
            onClick={() => data.onSelect(data.role)}
        >
            <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3.5 !h-3.5 !border-2 !border-slate-950" />

            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: data.color }}
                    >
                        <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug tracking-tight">
                            {data.name}
                        </h4>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">
                            Rank {data.hierarchy_level}
                        </span>
                    </div>
                </div>

                <span
                    className="px-2.5 py-1 text-[10px] font-black rounded-full text-white shadow-sm"
                    style={{ backgroundColor: data.color }}
                >
                    Lvl {data.hierarchy_level}
                </span>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        Members ({data.members_count || 0})
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {data.hierarchy_level >= 80 ? 'Council' : 'Party'}
                    </span>
                </div>

                {/* Member Avatar Stack */}
                {data.members && data.members.length > 0 ? (
                    <div className="flex items-center -space-x-2 pt-1">
                        {data.members.slice(0, 5).map((m) => (
                            <img
                                key={m.id}
                                src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.id}`}
                                alt={m.name}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 object-cover shadow-sm"
                                title={`${m.name} (Lvl ${m.level})`}
                            />
                        ))}
                        {data.members.length > 5 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200 dark:bg-slate-800 text-[10px] font-black text-gray-700 dark:text-slate-300 flex items-center justify-center shadow-sm">
                                +{data.members.length - 5}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-[10px] text-gray-400 italic">No members assigned</p>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3.5 !h-3.5 !border-2 !border-slate-950" />
        </motion.div>
    );
}

export default function Hierarchy({ initialRoles = [], allUsers = [] }) {
    const [roles, setRoles] = useState(initialRoles);
    const [selectedRole, setSelectedRole] = useState(initialRoles[0] || null);
    const [userList, setUserList] = useState(allUsers);
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [saving, setSaving] = useState(false);

    const [newRoleForm, setNewRoleForm] = useState({
        name: '',
        color: '#3B82F6',
        hierarchy_level: 50,
        icon: 'ShieldCheck',
        permissions: ['create_channels'],
    });

    const nodeTypes = useMemo(() => ({ roleNode: RoleNode }), []);

    // Branching Tree Root Position Algorithm
    const getTreePosition = (role, index, sortedRoles) => {
        const rankPositions = {
            100: { x: 380, y: 40 },   // Guild Master Top Root Center
            80:  { x: 120, y: 220 },  // Project Manager Left Branch
            60:  { x: 640, y: 220 },  // Senior Developer Right Branch
            40:  { x: 220, y: 400 },  // Developer Sub-branch
            20:  { x: 740, y: 400 },  // Intern Leaf Branch
        };

        if (rankPositions[role.hierarchy_level]) {
            return rankPositions[role.hierarchy_level];
        }

        // Dynamic fallback positioning for custom created roles
        const col = index % 3;
        const row = Math.floor(index / 3);
        return { x: col * 320 + 80, y: row * 200 + 40 };
    };

    // Generate Nodes from roles in a branching tree root formation
    const generateNodes = (roleList, selectedId) => {
        const sorted = [...roleList].sort((a, b) => b.hierarchy_level - a.hierarchy_level);
        return sorted.map((role, idx) => {
            const pos = getTreePosition(role, idx, sorted);
            return {
                id: String(role.id),
                type: 'roleNode',
                position: pos,
                data: {
                    role,
                    name: role.name,
                    color: role.color,
                    hierarchy_level: role.hierarchy_level,
                    icon: role.icon,
                    members_count: role.members_count,
                    members: role.members,
                    isSelected: selectedRole?.id === role.id,
                    onSelect: (r) => setSelectedRole(r),
                },
            };
        });
    };

    // Generate Branching Edges connecting parent hierarchy ranks
    const generateEdges = (roleList) => {
        const sorted = [...roleList].sort((a, b) => b.hierarchy_level - a.hierarchy_level);
        const edges = [];
        
        // Find specific nodes
        const gm = sorted.find(r => r.hierarchy_level === 100);
        const pm = sorted.find(r => r.hierarchy_level === 80);
        const srDev = sorted.find(r => r.hierarchy_level === 60);
        const dev = sorted.find(r => r.hierarchy_level === 40);
        const intern = sorted.find(r => r.hierarchy_level === 20);

        // Branch 1: Guild Master -> Project Manager
        if (gm && pm) {
            edges.push({
                id: `e-${gm.id}-${pm.id}`,
                source: String(gm.id),
                target: String(pm.id),
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#EAB308', strokeWidth: 3 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#EAB308' },
            });
        }

        // Branch 2: Guild Master -> Senior Developer
        if (gm && srDev) {
            edges.push({
                id: `e-${gm.id}-${srDev.id}`,
                source: String(gm.id),
                target: String(srDev.id),
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#EAB308', strokeWidth: 3 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#EAB308' },
            });
        }

        // Branch 3: Project Manager -> Developer
        if (pm && dev) {
            edges.push({
                id: `e-${pm.id}-${dev.id}`,
                source: String(pm.id),
                target: String(dev.id),
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#8B5CF6', strokeWidth: 3 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
            });
        }

        // Branch 4: Senior Developer -> Intern
        if (srDev && intern) {
            edges.push({
                id: `e-${srDev.id}-${intern.id}`,
                source: String(srDev.id),
                target: String(intern.id),
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#3B82F6', strokeWidth: 3 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
            });
        }

        // Fallback for custom roles: connect sequentially if not matched above
        if (edges.length === 0) {
            for (let i = 0; i < sorted.length - 1; i++) {
                edges.push({
                    id: `e-${sorted[i].id}-${sorted[i + 1].id}`,
                    source: String(sorted[i].id),
                    target: String(sorted[i + 1].id),
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: sorted[i].color, strokeWidth: 3 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: sorted[i].color },
                });
            }
        }

        return edges;
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes(roles, selectedRole?.id));
    const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges(roles));

    const fetchRoles = async () => {
        try {
            const res = await axios.get('/api/roles');
            setRoles(res.data);
            setNodes(generateNodes(res.data, selectedRole?.id));
            setEdges(generateEdges(res.data));
            if (selectedRole) {
                const updated = res.data.find(r => r.id === selectedRole.id);
                if (updated) setSelectedRole(updated);
            }
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    };

    const handleTogglePermission = async (permName) => {
        if (!selectedRole) return;
        setSaving(true);

        const currentPerms = selectedRole.permissions || [];
        const newPerms = currentPerms.includes(permName)
            ? currentPerms.filter(p => p !== permName)
            : [...currentPerms, permName];

        try {
            const res = await axios.patch(`/api/roles/${selectedRole.id}`, {
                permissions: newPerms,
            });

            const updatedRole = res.data.role;
            const newRolesList = roles.map(r => r.id === updatedRole.id ? updatedRole : r);
            setRoles(newRolesList);
            setSelectedRole(updatedRole);
            setNodes(generateNodes(newRolesList, updatedRole.id));
        } catch (err) {
            console.error('Failed to update permission:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post('/api/roles', newRoleForm);
            setIsCreatingRole(false);
            setNewRoleForm({ name: '', color: '#3B82F6', hierarchy_level: 50, icon: 'ShieldCheck', permissions: ['create_channels'] });
            await fetchRoles();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating role');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Hierarchy of Honor Tree Root - GuildHall" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="space-y-1 relative z-10">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                            <GitBranch className="w-4 h-4 text-amber-400" />
                            ORGANIZATIONAL TREE ROOT PYRAMID
                        </span>
                        <h2 className="text-2xl font-black text-white">
                            Hierarchy of Honor Tree Root
                        </h2>
                        <p className="text-xs text-amber-200/80">
                            Branching organizational root pyramid showing role ranks, member distribution, and Spatie permission controls.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreatingRole(true)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 shrink-0 border border-yellow-200"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Create New Role</span>
                    </button>
                </div>

                {/* Main Graph & Slide-Over Panel Split Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left 2 Cols: Branching React Flow Tree Root Canvas */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl h-[620px] relative overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md z-10">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                <Crown className="w-4 h-4 text-amber-400" />
                                Branching Hierarchy Tree Root
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">Drag nodes or click to inspect permissions</span>
                        </div>

                        <div className="flex-1 w-full h-full relative bg-slate-950">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                nodeTypes={nodeTypes}
                                fitView
                                attributionPosition="bottom-left"
                            >
                                <Controls className="!bg-slate-900 !border-slate-800 !text-white !rounded-xl !shadow-xl" />
                                <Background color="#F59E0B" gap={24} size={1} opacity={0.12} />
                            </ReactFlow>
                        </div>
                    </div>

                    {/* Right 1 Col: Selected Role Side Permission Panel */}
                    <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-20">
                        {selectedRole ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedRole.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    {/* Role Header */}
                                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg border border-yellow-200/30"
                                                style={{ backgroundColor: selectedRole.color }}
                                            >
                                                {React.createElement(ICON_MAP[selectedRole.icon] || Shield, { className: 'w-5 h-5' })}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                                                    {selectedRole.name}
                                                </h3>
                                                <span className="text-xs text-amber-400 font-bold">
                                                    Hierarchy Level {selectedRole.hierarchy_level}
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className="px-3 py-1 text-xs font-black text-white rounded-full shadow-md"
                                            style={{ backgroundColor: selectedRole.color }}
                                        >
                                            Rank {selectedRole.hierarchy_level}
                                        </span>
                                    </div>

                                    {/* Permissions Switches */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                                <Sliders className="w-4 h-4 text-indigo-500" />
                                                Spatie Permissions
                                            </h4>
                                            {saving && <span className="text-[10px] text-amber-400 font-bold animate-pulse">Saving...</span>}
                                        </div>

                                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                            {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                                                const hasPerm = (selectedRole.permissions || []).includes(perm.name);
                                                return (
                                                    <div
                                                        key={perm.name}
                                                        onClick={() => handleTogglePermission(perm.name)}
                                                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                                            hasPerm
                                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                                                : 'bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="text-xs font-bold">{perm.label}</div>
                                                            <div className="text-[10px] text-gray-400 leading-tight">{perm.desc}</div>
                                                        </div>
                                                        <div
                                                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-white transition-colors ${
                                                                hasPerm ? 'bg-amber-500 text-slate-950 font-black' : 'bg-gray-300 dark:bg-slate-700'
                                                            }`}
                                                        >
                                                            {hasPerm && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Assigned Members List */}
                                    <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-purple-500" />
                                                Assigned Members ({selectedRole.members_count || 0})
                                            </h4>
                                        </div>

                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            {selectedRole.members && selectedRole.members.length > 0 ? (
                                                selectedRole.members.map((mem) => (
                                                    <div
                                                        key={mem.id}
                                                        className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <img
                                                                src={mem.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${mem.id}`}
                                                                alt={mem.name}
                                                                className="w-8 h-8 rounded-full object-cover border border-amber-500/30 bg-slate-800"
                                                            />
                                                            <div>
                                                                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">{mem.name}</div>
                                                                <div className="text-[10px] text-amber-400 font-extrabold">Lvl {mem.level} • {mem.xp} XP</div>
                                                            </div>
                                                        </div>
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">No members assigned to this role yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <p className="text-xs text-gray-400 italic text-center py-10">Select a role node in the org chart to inspect permissions.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Role Modal */}
            <AnimatePresence>
                {isCreatingRole && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                                <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                    Create New RPG Role
                                </h3>
                                <button onClick={() => setIsCreatingRole(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateRole} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Role Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newRoleForm.name}
                                        onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                                        placeholder="e.g. Lead Architect"
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Hierarchy Level (0-100)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            required
                                            value={newRoleForm.hierarchy_level}
                                            onChange={(e) => setNewRoleForm({ ...newRoleForm, hierarchy_level: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Theme Color</label>
                                        <input
                                            type="color"
                                            value={newRoleForm.color}
                                            onChange={(e) => setNewRoleForm({ ...newRoleForm, color: e.target.value })}
                                            className="w-full h-9 p-1 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">RPG Icon</label>
                                    <select
                                        value={newRoleForm.icon}
                                        onChange={(e) => setNewRoleForm({ ...newRoleForm, icon: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    >
                                        <option value="Crown">Crown (Guild Owner)</option>
                                        <option value="ShieldCheck">ShieldCheck (Officer / PM)</option>
                                        <option value="Code2">Code2 (Senior Dev)</option>
                                        <option value="Terminal">Terminal (Developer)</option>
                                        <option value="Feather">Feather (Intern)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingRole(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                                    >
                                        {saving ? 'Creating...' : 'Create Role'}
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
