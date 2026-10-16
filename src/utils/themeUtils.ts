export type ThemeName = 'light' | 'dark' | 'halloween' | 'christmas' | 'stPatricks' | 'easter';

export interface ThemeConfig {
    name: ThemeName;
    label: string;
    emoji: string;
    resetEmoji: string;
    useDarkMode: boolean; // Whether to apply 'dark' class
}

export const themes: Record<ThemeName, ThemeConfig> = {
    light: {
        name: 'light',
        label: 'Light',
        emoji: '☀️',
        resetEmoji: '🤔',
        useDarkMode: false,
    },
    dark: {
        name: 'dark',
        label: 'Dark',
        emoji: '🌙',
        resetEmoji: '🤔',
        useDarkMode: true,
    },
    halloween: {
        name: 'halloween',
        label: 'Halloween',
        emoji: '🎃',
        resetEmoji: '👻',
        useDarkMode: true,
    },
    christmas: {
        name: 'christmas',
        label: 'Christmas',
        emoji: '🎄',
        resetEmoji: '🎅',
        useDarkMode: false,
    },
    stPatricks: {
        name: 'stPatricks',
        label: "St. Patrick's Day",
        emoji: '☘️',
        resetEmoji: '🍀',
        useDarkMode: false,
    },
    easter: {
        name: 'easter',
        label: 'Easter',
        emoji: '🥚',
        resetEmoji: '🐰',
        useDarkMode: false,
    },
};

export const getAutoTheme = (): ThemeName => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    if (month === 10) return 'halloween';
    if (month === 12) return 'christmas';
    if (month === 3 && date <= 21) return 'stPatricks';
    if ((month === 3 && date >= 22) || (month === 4 && date <= 25)) return 'easter';

    return 'light';
};

export const getSelectedTheme = (): ThemeName => {
    const stored = localStorage.getItem('selectedTheme') as ThemeName;
    if (stored && themes[stored]) {
        return stored;
    }
    return getAutoTheme();
};

export const setSelectedTheme = (theme: ThemeName) => {
    localStorage.setItem('selectedTheme', theme);
};

export const getThemeConfig = (): ThemeConfig => {
    const themeName = getSelectedTheme();
    return themes[themeName];
};