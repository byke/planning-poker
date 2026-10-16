import { useEffect, useRef, useState } from 'react';
import { getAutoTheme, getSelectedTheme, setSelectedTheme, themes, ThemeName } from '../../utils/themeUtils';

export const ThemeSelector = () => {
    const [theme, setThemeState] = useState<ThemeName>(() => getSelectedTheme());
    const [displayTheme, setDisplayTheme] = useState<ThemeName>(() => getSelectedTheme());
    const [autoTheme] = useState<ThemeName>(getAutoTheme());
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Listen to game theme changes and update display
    useEffect(() => {
        const handleThemeChange = (event: Event) => {
            const customEvent = event as CustomEvent<ThemeName>;
            setDisplayTheme(customEvent.detail); // Show the applied theme
        };

        window.addEventListener('themeChanged', handleThemeChange);
        return () => window.removeEventListener('themeChanged', handleThemeChange);
    }, []);

    // Apply theme on mount and when it changes
    useEffect(() => {
        const applyTheme = () => {
            const currentTheme = getSelectedTheme();
            setThemeState(currentTheme);
            setDisplayTheme(currentTheme);

            const themeConfig = themes[currentTheme];

            // Remove all theme classes
            document.documentElement.classList.remove(
                'halloween-theme',
                'christmas-theme',
                'stPatricks-theme',
                'easter-theme'
            );

            // Add current theme class if it's a special theme
            if (currentTheme !== 'light' && currentTheme !== 'dark') {
                document.documentElement.classList.add(`${currentTheme}-theme`);
            }

            // Toggle dark mode based on theme config
            const darkThemes = ['dark', 'halloween'];
            document.documentElement.classList.toggle('dark', darkThemes.includes(currentTheme));
        };

        applyTheme();
    }, []);

    useEffect(() => {
        setSelectedTheme(theme);
        const themeConfig = themes[theme];

        // Remove all theme classes
        document.documentElement.classList.remove(
            'halloween-theme',
            'christmas-theme',
            'stPatricks-theme',
            'easter-theme'
        );

        // Add current theme class if it's a special theme
        if (theme !== 'light' && theme !== 'dark') {
            document.documentElement.classList.add(`${theme}-theme`);
        }

        // Toggle dark mode based on theme config
        const darkThemes = ['dark', 'halloween'];
        document.documentElement.classList.toggle('dark', darkThemes.includes(theme));

        // Update display to match what's actually active
        setDisplayTheme(theme);
    }, [theme]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    const themeOptions = Object.values(themes);
    const currentTheme = themes[displayTheme]; // Use displayTheme for what shows in dropdown

    const handleThemeSelect = (selectedTheme: ThemeName) => {
        setThemeState(selectedTheme);
        setSelectedTheme(selectedTheme);
        setDisplayTheme(selectedTheme);
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: selectedTheme }));
    };

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
                title='Select Theme'
            >
                <span>{currentTheme.emoji}</span>
            </button>

            {isOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 flex flex-col'>
                    {themeOptions.map((themeConfig) => (
                        <button
                            key={themeConfig.name}
                            onClick={() => handleThemeSelect(themeConfig.name)}
                            className={`px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${displayTheme === themeConfig.name ? 'bg-blue-100 dark:bg-blue-900 font-semibold' : ''
                                }`}
                        >
                            <span>{themeConfig.emoji}</span>
                            <span>{themeConfig.label}</span>
                            {themeConfig.name === autoTheme && displayTheme !== themeConfig.name && (
                                <span className='text-xs text-gray-500 ml-auto'>(Auto)</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};