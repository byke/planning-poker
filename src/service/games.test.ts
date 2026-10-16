import * as fb from '../repository/firebase';
import { GameType } from '../types/game';
import { Status } from '../types/status';
import {
  addNewGame,
  finishGame,
  getGame,
  getGameStatus,
  resetGame,
  streamGame,
  streamPlayers,
  updateGame,
  updateGameStatus,
  updateStoryName,
} from './games';
import * as players from './players';

jest.mock('../repository/firebase', () => ({
  addGameToStore: jest.fn(),
  addPlayerToGameInStore: jest.fn(),
  streamData: jest.fn(),
  streamPlayersFromStore: jest.fn(),
  getGameFromStore: jest.fn(),
  updateGameDataInStore: jest.fn(),
  getPlayersFromStore: jest.fn(),
}));

jest.mock('./players', () => ({
  resetPlayers: jest.fn(),
  updatePlayerGames: jest.fn(),
}));

jest.mock('ulid', () => ({ ulid: () => '321cba' }));

describe('games service', () => {
  const mockUlid = '321cba';
  const mockId = 'fancy pants';
  const mockGame = {
    id: 'fee-fii-foo-fum',
    name: 'Cadburys',
    average: 2,
    gameStatus: Status.NotStarted,
    gameType: GameType.Fibonacci,
    cards: [
      { value: 1, displayValue: '1', color: 'red' },
      { value: 2, displayValue: '2', color: 'blue' },
      { value: 3, displayValue: '3', color: 'green' },
    ],
    createdBy: 'Jack',
    createdById: 'beanstalk',
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(),
  };

  const mockPlayers = [
    {
      name: 'Jack',
      id: 'beanstalk',
      status: Status.Finished,
      value: 4,
      emoji: 'smirk',
      team: 'Back End Developers',
    },
    {
      name: 'Jill',
      id: 'hill',
      status: Status.Started,
      value: 1,
      emoji: 'thumbsup',
      team: 'Back End Developers',
    },
    {
      name: 'Humpty',
      id: 'dumpty',
      status: Status.InProgress,
      value: 500,
      emoji: 'egg',
      team: 'Back End Developers',
    },
  ];

  const finishedPlayers = [{ ...mockPlayers[0] }, { ...mockPlayers[1] }, { ...mockPlayers[2] }];
  finishedPlayers[0].status = Status.Finished;
  finishedPlayers[1].status = Status.Finished;
  finishedPlayers[2].status = Status.Finished;

  it('should store the new game info in the DB', async () => {
    const fakeGame = {
      name: 'cherries',
      gameType: 'uno',
      createdBy: 'Santa',
      cards: [
        { value: 1, displayValue: '1', color: 'red' },
        { value: 2, displayValue: '2', color: 'blue' },
        { value: 3, displayValue: '3', color: 'green' },
      ],
      createdAt: new Date(),
      createdByTeam: 'Back End Developers',
    };

    const resPlayer = {
      name: fakeGame.createdBy,
      id: mockUlid,
      status: Status.NotStarted,
      team: fakeGame.createdByTeam,
    };

    const resGame = {
      ...fakeGame,
      id: mockUlid,
      average: 0,
      createdById: mockUlid,
      createdByPlayerId: mockUlid,
      gameStatus: Status.Started,
      theme: expect.any(String), // Any theme value
    };

    const gameSpy = jest.spyOn(fb, 'addGameToStore');
    const playerSpy = jest.spyOn(fb, 'addPlayerToGameInStore');
    const updateSpy = jest.spyOn(players, 'updatePlayerGames');

    // addNewGame now returns {gameId, playerId}
    const result = await addNewGame(fakeGame as any);

    expect(result).toEqual({
      gameId: mockUlid,
      playerId: mockUlid,
    });

    expect(gameSpy).toHaveBeenCalledWith(
      mockUlid,
      expect.objectContaining({
        id: mockUlid,
        average: 0,
        createdById: mockUlid,
        gameStatus: Status.Started,
      }),
    );

    expect(playerSpy).toHaveBeenCalledWith(
      mockUlid,
      expect.objectContaining({
        name: fakeGame.createdBy,
        id: mockUlid,
        status: Status.NotStarted,
        team: fakeGame.createdByTeam,
      }),
    );

    expect(updateSpy).toHaveBeenCalledWith(
      mockUlid,
      fakeGame.name,
      fakeGame.createdBy,
      mockUlid,
      mockUlid,
    );
  });

  it("should request the given game's stream", () => {
    const spy = jest.spyOn(fb, 'streamData');
    streamGame(mockId);
    expect(spy).toHaveBeenCalledWith(mockId);
  });

  it("should request the given player's stream", () => {
    const spy = jest.spyOn(fb, 'streamPlayersFromStore');
    streamPlayers(mockId);
    expect(spy).toHaveBeenCalledWith(mockId);
  });

  it('should get the game from the DB', () => {
    const spy = jest.spyOn(fb, 'getGameFromStore');
    getGame(mockId);
    expect(spy).toHaveBeenCalledWith(mockId);
  });

  it('should update the game in the DB', () => {
    const spy = jest.spyOn(fb, 'updateGameDataInStore');
    updateGame(mockId, 'banana');
    expect(spy).toHaveBeenCalledWith(mockId, 'banana');
  });

  describe('reset the game', () => {
    it('should update the game and reset the players', async () => {
      const expectGame = { average: 0, gameStatus: Status.Started };
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(mockGame);
      const updateSpy = jest.spyOn(fb, 'updateGameDataInStore');
      const playerSpy = jest.spyOn(players, 'resetPlayers');

      await resetGame(mockId);

      expect(updateSpy).toHaveBeenCalledWith(mockId, expectGame);
      expect(playerSpy).toHaveBeenCalledWith(mockId);
    });

    it("should not touch the DB if the game doesn't exist", async () => {
      jest.resetAllMocks();
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(undefined);
      const updateSpy = jest.spyOn(fb, 'updateGameDataInStore');
      const playerSpy = jest.spyOn(players, 'resetPlayers');

      await resetGame(mockId);

      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(playerSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('finish the game', () => {
    it('update the game with the average and finished status', async () => {
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(mockGame);
      jest.spyOn(fb, 'getPlayersFromStore').mockResolvedValueOnce(mockPlayers as any);
      const spy = jest.spyOn(fb, 'updateGameDataInStore');

      await finishGame(mockId);

      expect(spy).toHaveBeenCalledWith(mockId, expect.objectContaining({ gameStatus: Status.Finished }));
    });

    it("should not touch the DB if the game doesn't exist", async () => {
      jest.resetAllMocks();
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(undefined);
      jest.spyOn(fb, 'getPlayersFromStore').mockResolvedValueOnce(mockPlayers as any);
      const spy = jest.spyOn(fb, 'updateGameDataInStore');

      await finishGame(mockId);

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('get the game status', () => {
    it("should have in progress status when there's some players who have finished", () => {
      const res = getGameStatus(mockPlayers as any);
      expect(res).toEqual(Status.InProgress);
    });

    it("should be started when there's no players that have finished", () => {
      const fakePlayers = [mockPlayers[1], mockPlayers[2]];
      const res = getGameStatus(fakePlayers as any);
      expect(res).toEqual(Status.Started);
    });
  });

  describe('update the game status', () => {
    it("should not touch the DB if the game doesn't exist", async () => {
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(undefined);
      const res = await updateGameStatus(mockId);
      expect(res).toBe(false);
    });

    it('should return false if there are no players in the game in the DB', async () => {
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(mockGame);
      jest.spyOn(fb, 'getPlayersFromStore').mockResolvedValueOnce(undefined);
      const res = await updateGameStatus(mockId);
      expect(res).toBe(false);
    });

    it('should update the game with the new status', async () => {
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(mockGame);
      jest.spyOn(fb, 'getPlayersFromStore').mockResolvedValueOnce(mockPlayers as any);
      const spy = jest.spyOn(fb, 'updateGameDataInStore').mockResolvedValueOnce(true);

      const res = await updateGameStatus(mockId);

      expect(spy).toHaveBeenCalledWith(mockId, { gameStatus: Status.InProgress });
      expect(res).toBe(true);
    });
  });

  describe('update the game story name', () => {
    it('should update the game with the new story name', async () => {
      jest.spyOn(fb, 'getGameFromStore').mockResolvedValueOnce(mockGame);
      jest.spyOn(fb, 'getPlayersFromStore').mockResolvedValueOnce(mockPlayers as any);
      const spy = jest.spyOn(fb, 'updateGameDataInStore').mockResolvedValueOnce(true);

      await updateStoryName(mockId, 'User story 1');

      expect(spy).toHaveBeenCalledWith(mockId, expect.objectContaining({ storyName: 'User story 1' }));
    });
  });
});