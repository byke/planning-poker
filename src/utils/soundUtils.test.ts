import { playSound, getSoundEnabled, setSoundEnabled } from './soundUtils';

// Mock HTMLAudioElement
global.Audio = jest.fn((src: string) => ({
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    volume: 0.7,
    src,
})) as any;

describe('soundUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('playSound', () => {
        it('should play a sound file', () => {
            const audioMock = jest.fn();
            global.Audio = jest.fn(() => ({
                play: audioMock.mockResolvedValue(undefined),
                pause: jest.fn(),
                volume: 0.7,
            })) as any;

            playSound('test.mp3');

            expect(global.Audio).toHaveBeenCalledWith('/sounds/test.mp3');
        });

        it('should handle play errors gracefully', () => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
            const playError = new Error('Play failed');

            global.Audio = jest.fn(() => ({
                play: jest.fn().mockRejectedValue(playError),
                pause: jest.fn(),
                volume: 0.7,
            })) as any;

            playSound('test.mp3');

            setTimeout(() => {
                expect(consoleLogSpy).toHaveBeenCalled();
                consoleLogSpy.mockRestore();
            }, 0);
        });
    });

    describe('getSoundEnabled', () => {
        it('should return true by default', () => {
            const result = getSoundEnabled();
            expect(result).toBe(true);
        });

        it('should return saved preference from localStorage', () => {
            localStorage.setItem('soundEnabled', 'false');
            const result = getSoundEnabled();
            expect(result).toBe(false);
        });
    });

    describe('setSoundEnabled', () => {
        it('should save preference to localStorage', () => {
            setSoundEnabled(false);
            expect(localStorage.getItem('soundEnabled')).toBe('false');

            setSoundEnabled(true);
            expect(localStorage.getItem('soundEnabled')).toBe('true');
        });
    });
});