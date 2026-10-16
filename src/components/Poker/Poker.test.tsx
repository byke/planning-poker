import { render, screen, waitFor } from '@testing-library/react';
import reactRouter from 'react-router';
import * as gamesService from '../../service/games';
import * as playersService from '../../service/players';
import { Game } from '../../types/game';
import { Player } from '../../types/player';
import { Status } from '../../types/status';
import { Poker } from './Poker';

jest.mock('../../service/players');
jest.mock('../../service/games');

const mockHistoryPush = jest.fn();
const mockUnblock = jest.fn();
const mockHistory = {
  push: mockHistoryPush,
  goBack: jest.fn(),
  block: jest.fn(() => mockUnblock),
};

describe('Poker component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('currentPlayerId', 'xx');
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ id: 'abc' } as any);
    jest.spyOn(reactRouter, 'useHistory').mockReturnValue(mockHistory as any);
  });

  it('should display game not found', async () => {
    (gamesService.streamGame as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => success({ exists: false })),
      } as any;
    });

    (gamesService.streamPlayers as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => success({ forEach: jest.fn() })),
      } as any;
    });

    render(<Poker />);

    await waitFor(() => {
      expect(screen.getByText('Game not found')).toBeInTheDocument();
    });
  });

  it('should display game area when game is found', async () => {
    const mockGame: Game = {
      id: 'abc',
      name: 'avengers',
      cards: [
        { value: 1, displayValue: '1', color: 'red' },
        { value: 2, displayValue: '2', color: 'blue' },
        { value: 3, displayValue: '3', color: 'green' },
      ],
      createdBy: 'IronMan',
      createdById: 'iron123',
      createdAt: new Date(),
      gameStatus: Status.Started,
      average: 0,
    } as Game;

    const mockPlayers: Player[] = [
      {
        id: 'xx',
        name: 'xyz',
        status: Status.NotStarted,
        value: null,
        team: 'Back End Developers',
      },
    ] as Player[];

    (gamesService.streamGame as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => success({ exists: true, data: () => mockGame })),
      } as any;
    });

    (gamesService.streamPlayers as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => {
          success({
            forEach: (callback: (doc: any) => void) => {
              mockPlayers.forEach((player) => {
                callback({ data: () => player });
              });
            },
          });
        }),
      } as any;
    });

    (playersService.getCurrentPlayerId as jest.Mock).mockReturnValue('xx');

    render(<Poker />);

    await waitFor(() => {
      expect(screen.getByText(mockGame.name)).toBeInTheDocument();
    });

    expect(screen.getByText(mockGame.name)).toBeInTheDocument();
  });

  it('should display confirmation dialog when user clicks the back button', async () => {
    const mockGame: Game = {
      id: 'abc',
      name: 'avengers',
      cards: [
        { value: 1, displayValue: '1', color: 'red' },
        { value: 2, displayValue: '2', color: 'blue' },
        { value: 3, displayValue: '3', color: 'green' },
      ],
      createdBy: 'IronMan',
      createdById: 'iron123',
      createdAt: new Date(),
      gameStatus: Status.Started,
      average: 0,
    } as Game;

    const mockPlayers: Player[] = [
      {
        id: 'xx',
        name: 'xyz',
        status: Status.NotStarted,
        value: null,
        team: 'Back End Developers',
      },
    ] as Player[];

    (gamesService.streamGame as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => success({ exists: true, data: () => mockGame })),
      } as any;
    });

    (gamesService.streamPlayers as jest.Mock).mockImplementation(() => {
      return {
        onSnapshot: jest.fn((success) => {
          success({
            forEach: (callback: (doc: any) => void) => {
              mockPlayers.forEach((player) => {
                callback({ data: () => player });
              });
            },
          });
        }),
      } as any;
    });

    (playersService.getCurrentPlayerId as jest.Mock).mockReturnValue('xx');

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    let blockCallback: ((location: any, action: string) => boolean) | undefined;
    const unblockMock = jest.fn();
    const testMockHistory = {
      push: jest.fn(),
      goBack: jest.fn(),
      block: jest.fn((callback) => {
        blockCallback = callback;
        return unblockMock;
      }),
    };

    jest.spyOn(reactRouter, 'useHistory').mockReturnValue(testMockHistory as any);

    render(<Poker />);

    await waitFor(() => {
      expect(screen.getByText(mockGame.name)).toBeInTheDocument();
    });

    // Simulate back navigation by invoking the block callback
    if (blockCallback) {
      blockCallback({}, 'POP');
    }

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to go back?');

    confirmSpy.mockRestore();
  });
});