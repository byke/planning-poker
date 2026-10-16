import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { uniqueNamesGenerator } from 'unique-names-generator';
import * as gamesService from '../../../service/games';
import { CreateGame } from './CreateGame';
import * as themeUtils from '../../../utils/themeUtils';

jest.mock('../../../service/games');
jest.mock('../../../utils/themeUtils');
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('unique-names-generator', () => ({
  starWars: ['Jabba'],
  colors: ['red'],
  animals: ['kangaroo'],
  uniqueNamesGenerator: jest.fn(),
  Config: jest.fn(),
}));

describe('CreateGame component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (themeUtils.getSelectedTheme as jest.Mock).mockReturnValue('light');
  });

  it('should display correct text fields', () => {
    render(<CreateGame />);
    expect(screen.getByPlaceholderText('Enter a session name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('should display create button', () => {
    render(<CreateGame />);
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('should have default values in the input fields', () => {
    (uniqueNamesGenerator as jest.Mock).mockReturnValueOnce('user name');
    render(<CreateGame />);
    const sessionName = screen.getByPlaceholderText('Enter a session name');
    const userName = screen.getByPlaceholderText('Enter your name');

    // Session name defaults to "Estimating"
    expect(sessionName).toHaveValue('Estimating');
    expect(userName).toHaveValue('user name');
  });

  it('should empty inputs when clicked', () => {
    render(<CreateGame />);
    const sessionName = screen.getByPlaceholderText('Enter a session name');
    const userName = screen.getByPlaceholderText('Enter your name');

    userEvent.click(sessionName);
    userEvent.click(userName);

    expect(sessionName).toHaveValue('');
    expect(userName).toHaveValue('');
  });

  it('should pre-fill the name field from localStorage', () => {
    localStorage.setItem('recentPlayerName', 'Alice');
    render(<CreateGame />);
    expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('Alice');
  });

  it('should be able to create new session', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'Days (Imperial)',
        name: 'Marvels',
        isAllowMembersToManageSession: false,
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should be able to create new session with Allow members to manage session', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const checkbox = screen.getByRole('checkbox');
    userEvent.click(checkbox);

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'Days (Imperial)',
        name: 'Marvels',
        isAllowMembersToManageSession: true,
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should be able to create new session of TShirt Sizing', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    // Be more specific - avoid matching "T-Shirt & Numbers"
    const tShirtRadio = screen.getByLabelText(/T-Shirt \(XXS, XS, S, M, L, XL, XXL\)/);
    userEvent.click(tShirtRadio);

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'TShirt',
        name: 'Marvels',
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should be able to create new session of Short Fibonacci Sizing', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const shortFibRadio = screen.getByLabelText(/Short Fibonacci/);
    userEvent.click(shortFibRadio);

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'ShortFibonacci',
        name: 'Marvels',
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should be able to create new session of TShirt & Numbers', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const tShirtNumberRadio = screen.getByLabelText(/T-Shirt & Numbers/);
    userEvent.click(tShirtNumberRadio);

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'TShirtAndNumber',
        name: 'Marvels',
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should be able to create new session of Custom option', async () => {
    const mockResult = { gameId: 'gameId123', playerId: 'playerId123' };
    (gamesService.addNewGame as jest.Mock).mockResolvedValue(mockResult);

    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const customRadio = screen.getByLabelText(/Custom/);
    userEvent.click(customRadio);

    const input1 = screen.getByTestId('custom-option-0');
    userEvent.type(input1, '1');

    const input2 = screen.getByTestId('custom-option-1');
    userEvent.type(input2, '2');

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(gamesService.addNewGame).toHaveBeenCalled();
    });

    expect(gamesService.addNewGame).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 'Rock',
        gameType: 'Custom',
        name: 'Marvels',
        createdByTeam: 'Back End Developers',
      }),
    );
  });

  it('should display error when no custom options entered', async () => {
    render(<CreateGame />);

    const sessionName = screen.getByPlaceholderText('Enter a session name');
    userEvent.clear(sessionName);
    userEvent.type(sessionName, 'Marvels');

    const userName = screen.getByPlaceholderText('Enter your name');
    userEvent.clear(userName);
    userEvent.type(userName, 'Rock');

    const teamSelect = screen.getByDisplayValue('-- Select your team --');
    userEvent.selectOptions(teamSelect, 'Back End Developers');

    const customRadio = screen.getByLabelText(/Custom/);
    userEvent.click(customRadio);

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter values for at least two custom option/i)).toBeInTheDocument();
    });
  });
});