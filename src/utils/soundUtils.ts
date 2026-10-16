export type SoundFile = 'amongus.mp3' 
| 'millionaire.mp3' 
| 'negativebeeps.mp3' 
| 'minecraft-cat-meow.mp3' 
| 'computer-says-no.mp3'
| 'rizz.mp3'
| 'family-fortunes-wrong-buzzer.mp3'; // Add more as you add files

const NO_CONFETTI_SOUNDS: SoundFile[] = [
    'amongus.mp3',
    'millionaire.mp3',
    'negativebeeps.mp3',
    'minecraft-cat-meow.mp3',
    'computer-says-no.mp3',
    'rizz.mp3',
    'family-fortunes-wrong-buzzer.mp3'
    // Add more sounds here as you add them
];

export const playRandomNoConfettiSound = (): void => {
    if (NO_CONFETTI_SOUNDS.length === 0) return;

    const randomIndex = Math.floor(Math.random() * NO_CONFETTI_SOUNDS.length);
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