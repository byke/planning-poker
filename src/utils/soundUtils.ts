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
];

// Cycle through sounds in order based on time
export const getSequentialIndex = (gameSeed: number): number => {
    // Change sound every minute
    const currentMinute = Math.floor(Date.now() / 60000);
    const combinedSeed = gameSeed + currentMinute;

    // Cycle through sequentially
    return combinedSeed % NO_CONFETTI_SOUNDS.length;
};

export const playSequentialNoConfettiSound = (gameSeed: number): void => {
    if (NO_CONFETTI_SOUNDS.length === 0) return;

    const soundIndex = getSequentialIndex(gameSeed);
    const sound = NO_CONFETTI_SOUNDS[soundIndex];
    playSound(sound);
};

export const playSound = (soundFile: string): void => {
    if (!getSoundEnabled()) return;

    try {
        const audio = new Audio(`/sounds/${soundFile}`);
        audio.volume = 0.7;
        audio.play().catch((error) => {
            console.log('Audio play failed:', error);
        });
    } catch (error) {
        console.log('Error playing sound:', error);
    }
};

export const getSoundEnabled = (): boolean => {
    const stored = localStorage.getItem('soundEnabled');
    return stored !== 'false';
};

export const setSoundEnabled = (enabled: boolean): void => {
    localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
};