export const playSound = (soundFile: string) => {
    try {
        const audio = new Audio(`/sounds/${soundFile}`);
        audio.volume = 0.7; // Set volume to 70%
        audio.play().catch((error) => {
            console.log('Audio play failed:', error);
        });
    } catch (error) {
        console.log('Error playing sound:', error);
    }
};

export const getSoundEnabled = (): boolean => {
    const stored = localStorage.getItem('soundEnabled');
    return stored !== null ? stored === 'true' : true; // Default to true
};

export const setSoundEnabled = (enabled: boolean) => {
    localStorage.setItem('soundEnabled', String(enabled));
};