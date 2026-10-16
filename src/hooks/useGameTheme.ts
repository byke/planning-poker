import { useEffect, useRef } from 'react';
import { Game } from '../types/game';

export const useGameTheme = (game: Game | null) => {
    const hasApplied = useRef(false);

    useEffect(() => {
        // Only apply the game theme ONCE when the game first loads
        if (!game || !game.theme || hasApplied.current) return;

        const darkThemes = ['dark', 'halloween'];

        // Remove all theme classes
        document.documentElement.classList.remove(
            'halloween-theme',
            'christmas-theme',
            'stPatricks-theme',
            'easter-theme'
        );

        // Add game's theme class if it's a special theme
        if (game.theme !== 'light' && game.theme !== 'dark') {
            document.documentElement.classList.add(`${game.theme}-theme`);
        }

        // Toggle dark mode based on game theme
        document.documentElement.classList.toggle('dark', darkThemes.includes(game.theme));

        // Dispatch event so ThemeSelector and Players know what theme is active
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: game.theme }));

        hasApplied.current = true;
        console.log('Applied game theme once:', game.theme);
    }, [game?.id]); // Only run when game ID changes (new game)
};