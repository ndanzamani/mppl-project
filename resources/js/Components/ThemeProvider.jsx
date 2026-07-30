import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext({
    theme: 'dark',
    setTheme: () => {},
    changeTheme: () => {},
});

export function ThemeProvider({ children, initialUserTheme, userId }) {
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('guildhall_theme') || initialUserTheme || 'dark';
    });

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (targetTheme) => {
        document.documentElement.setAttribute('data-theme', targetTheme);
        if (targetTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    const setTheme = async (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('guildhall_theme', newTheme);
        applyTheme(newTheme);

        if (userId) {
            try {
                await axios.patch(`/api/users/${userId}/theme`, { theme: newTheme });
            } catch (err) {
                console.error('Failed to sync theme preference to DB:', err);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, changeTheme: setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext) || {
    theme: 'dark',
    setTheme: () => {},
    changeTheme: () => {},
};
