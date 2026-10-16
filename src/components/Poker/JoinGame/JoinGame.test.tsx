import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import reactRouter from 'react-router';
import * as gameService from '../../../service/games';
import * as playersService from '../../../service/players';
import { Game } from '../../../types/game';
import { JoinGame } from './JoinGame';

jest.mock('../../../service/players');
jest.mock('../../../service/games');

const mockHistoryPush = jest.fn();

describe('JoinGame component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reactRouter, 'useHistory').mockReturnValue({ push: mockHistoryPush } as any);
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ id: '' });
    localStorage.clear();
  });

  it('should display correct text fields', async () => {
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(false);

    render(<JoinGame />);

    expect(screen.getByPlaceholderText('xyz...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('should pre-fill the name field from localStorage', async () => {
    localStorage.setItem('recentPlayerName', 'Alice');
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(false);

    render(<JoinGame />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('Alice');
    });
  });

  it('should display join button', async () => {
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(false);
    render(<JoinGame />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
    });
  });

  it('should be able to join a session', async () => {
    (playersService.addPlayerToGame as jest.Mock).mockResolvedValue('playerId123');
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(false);

    render(<JoinGame />);

    const sessionID = screen.getByPlaceholderText('xyz...');
    const userName = screen.getByPlaceholderText('Enter your name');
    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    const joinButton = screen.getByRole('button', { name: /join/i });

    // User interactions should NOT be wrapped in waitFor
    userEvent.clear(sessionID);
    userEvent.type(sessionID, 'gameId');

    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    userEvent.selectOptions(teamSelect, 'Back End Developers');

    userEvent.click(joinButton);

    // Only assertions and async operations should use waitFor
    await waitFor(() => {
      expect(playersService.addPlayerToGame).toHaveBeenCalled();
    });

    expect(playersService.addPlayerToGame).toHaveBeenCalledWith(
      'gameId',
      'Rock',
      'Back End Developers',
    );

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/game/gameId');
    });

    expect(localStorage.getItem('recentPlayerName')).toBe('Rock');
  });

  it('should automatically join the game when player has already joined', async () => {
    const gameId = 'abc';
    (reactRouter.useParams as jest.Mock).mockReturnValue({ id: gameId });
    (gameService.getGame as jest.Mock).mockResolvedValue({ id: gameId } as Game);
    (playersService.addPlayerToGame as jest.Mock).mockResolvedValue('playerId123');
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(true);

    render(<JoinGame />);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/game/abc');
    });
  });

  it('should not automatically join the game when player is not in the game', async () => {
    const gameId = 'abc';
    (reactRouter.useParams as jest.Mock).mockReturnValue({ id: gameId });
    (gameService.getGame as jest.Mock).mockResolvedValue({ id: gameId } as Game);
    (playersService.addPlayerToGame as jest.Mock).mockResolvedValue('playerId123');
    (playersService.isCurrentPlayerInGame as jest.Mock).mockResolvedValue(false);

    render(<JoinGame />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });
  });
});