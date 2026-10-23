export type SoundFile = 'amongus.mp3'
    | 'millionaire.mp3'
    | 'negativebeeps.mp3'
    | 'minecraft-cat-meow.mp3'
    | 'computer-says-no.mp3'
    | 'rizz.mp3'
    | 'faaah.mp3'
    | 'family-fortunes-wrong-buzzer.mp3';

const NO_CONFETTI_SOUNDS: SoundFile[] = [
    'amongus.mp3',
    'millionaire.mp3',
    'negativebeeps.mp3',
    'minecraft-cat-meow.mp3',
    'computer-says-no.mp3',
    'rizz.mp3',
    'faaah.mp3',
    'family-fortunes-wrong-buzzer.mp3',
];

export const getNextSoundFromIndex = (currentSoundIndex: number): SoundFile => {
    return NO_CONFETTI_SOUNDS[currentSoundIndex % NO_CONFETTI_SOUNDS.length];
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