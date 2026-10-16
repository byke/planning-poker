export type SoundFile = 'amongus.mp3'
    | 'millionaire.mp3'
    | 'negativebeeps.mp3'
    | 'minecraft-cat-meow.mp3'
    | 'computer-says-no.mp3'
    | 'rizz.mp3'
    | 'family-fortunes-wrong-buzzer.mp3';

const NO_CONFETTI_SOUNDS: SoundFile[] = [
    'amongus.mp3',
    'millionaire.mp3',
    'negativebeeps.mp3',
    'minecraft-cat-meow.mp3',
    'computer-says-no.mp3',
    'rizz.mp3',
    'family-fortunes-wrong-buzzer.mp3',
    // Add more sounds here as you add them
];

// Seeded random: always returns the same "random" value for the same seed
export const getSeededRandomIndex = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * NO_CONFETTI_SOUNDS.length);
};

export const playRandomNoConfettiSound = (gameSeed: number): void => {
    if (NO_CONFETTI_SOUNDS.length === 0) return;

    const randomIndex = getSeededRandomIndex(gameSeed);
    const randomSound = NO_CONFETTI_SOUNDS[randomIndex];
    playSound(randomSound);
};

export const playSound = (soundFile: string): void => {
    if (!getSoundEnabled()) return;

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
    return stored !== 'false'; // Default to true
};

export const setSoundEnabled = (enabled: boolean): void => {
    localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
};