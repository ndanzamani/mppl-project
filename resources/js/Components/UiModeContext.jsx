import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UiModeContext = createContext();

export const DICTIONARY = {
    rpg: {
        appName: 'GuildHall RPG',
        dashboardTitle: 'Guild Hall',
        dashboardDesc: 'Guild Realm Center & Adventurer Lounge',
        projectsTitle: 'Missions Board',
        projectsDesc: 'Council Voting & Mission Proposals Board',
        questsTitle: 'Quest Log',
        questsDesc: 'Help Requests & Bounty Reward System',
        hierarchyTitle: 'Hierarchy of Honor',
        hierarchyDesc: 'Guild Rank Hierarchy & Council Permissions',
        teamTitle: 'Party Members',
        teamDesc: 'Active Guild Party Members & Adventurers Roster',
        profileTitle: 'Character Sheet',
        profileDesc: 'Adventurer Stats, RPG Level & Achievements',
        textHalls: 'Text Halls',
        voiceTaverns: 'Voice Taverns',
        statusBadge: 'Status Aura',
        xpOrbLabel: 'Experience Orb',
        submitProjectBtn: 'Submit Mission Scroll (+20 XP)',
        approveBtn: 'Seal with Honor',
        rejectBtn: 'Dismiss',
        resignBtn: 'Resign from Company 🚪',
        adminRole: 'Guild Master',
        pmRole: 'Quest Giver',
        voiceRoomTitle: '3D Voice Tavern',
        voiceRoomAction: '🍺 Raise Tankard',
    },
    corporate: {
        appName: 'Enterprise Workplace',
        dashboardTitle: 'Executive Dashboard',
        dashboardDesc: 'Company Analytics & Workspace Performance',
        projectsTitle: 'Project Roadmap',
        projectsDesc: 'Team Kanban Board & Proposal Approval Workflow',
        questsTitle: 'Task & Help Desk',
        questsDesc: 'Internal Help Requests & Deliverable Task Backlog',
        hierarchyTitle: 'Org Chart & Roles',
        hierarchyDesc: 'Corporate Organizational Structure & Permissions',
        teamTitle: 'Employee Directory',
        teamDesc: 'Active Staff & Team Roster',
        profileTitle: 'Employee Performance Profile',
        profileDesc: 'Key Metrics, Performance Level & Badges',
        textHalls: 'Team Channels',
        voiceTaverns: 'Conference Rooms',
        statusBadge: 'Availability Status',
        xpOrbLabel: 'Performance Score',
        submitProjectBtn: 'Submit New Proposal',
        approveBtn: 'Approve Proposal',
        rejectBtn: 'Decline',
        resignBtn: 'Leave Organization 🚪',
        adminRole: 'CEO / Administrator',
        pmRole: 'Project Manager',
        voiceRoomTitle: 'Virtual Conference Room',
        voiceRoomAction: '✋ Raise Hand',
    }
};

export function UiModeProvider({ children, initialMode = 'rpg', userId }) {
    const [uiMode, setUiModeState] = useState(() => {
        const local = localStorage.getItem('guildhall_ui_mode');
        return local || initialMode || 'rpg';
    });

    useEffect(() => {
        localStorage.setItem('guildhall_ui_mode', uiMode);
    }, [uiMode]);

    const changeUiMode = async (nextMode) => {
        setUiModeState(nextMode);
        localStorage.setItem('guildhall_ui_mode', nextMode);

        if (userId) {
            try {
                await axios.patch(`/api/users/${userId}/ui-mode`, { ui_mode: nextMode });
            } catch (err) {
                console.error('Failed to sync UI mode:', err);
            }
        }
    };

    const toggleUiMode = () => {
        const nextMode = uiMode === 'rpg' ? 'corporate' : 'rpg';
        changeUiMode(nextMode);
    };

    const t = (key) => {
        return DICTIONARY[uiMode]?.[key] || DICTIONARY['rpg']?.[key] || key;
    };

    return (
        <UiModeContext.Provider value={{
            uiMode,
            setUiMode: changeUiMode,
            changeUiMode,
            toggleUiMode,
            t,
            isCorporate: uiMode === 'corporate'
        }}>
            {children}
        </UiModeContext.Provider>
    );
}

export function useUiMode() {
    return useContext(UiModeContext) || {
        uiMode: 'rpg',
        setUiMode: () => {},
        changeUiMode: () => {},
        toggleUiMode: () => {},
        t: (k) => DICTIONARY['rpg']?.[k] || k,
        isCorporate: false,
    };
}
